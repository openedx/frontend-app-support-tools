export function getChangedRows(checkedRows, originalCheckedRows, rowRoles, originalRowRoles, userCoursesData) {
  const newlyCheckedWithRole = [];
  const uncheckedWithRole = [];
  const roleChangedRows = [];

  // Create a quick lookup for course metadata by runId
  const courseMetadata = userCoursesData.reduce((acc, row) => {
    acc[row.run] = {
      courseName: row.course_name,
      number: row.number,
      courseId: row.course_id,
    };
    return acc;
  }, {});

  Object.keys(checkedRows).forEach((runId) => {
    const wasChecked = originalCheckedRows[runId] || false;
    const isChecked = checkedRows[runId] || false;

    const originalRole = originalRowRoles[runId];
    const currentRole = rowRoles[runId];

    const { courseName, number, courseId } = courseMetadata[runId] || {};

    if (!wasChecked && isChecked && currentRole) {
      newlyCheckedWithRole.push({
        runId,
        role: currentRole === 'null' ? 'staff' : currentRole,
        courseName,
        number,
        courseId,
      });
    }

    if (wasChecked && !isChecked && originalRole) {
      uncheckedWithRole.push({
        runId,
        role: originalRole,
        courseName,
        number,
        courseId,
      });
    }

    if (wasChecked && isChecked && originalRole !== currentRole) {
      roleChangedRows.push({
        runId,
        from: originalRole,
        to: currentRole,
        courseName,
        number,
        courseId,
      });
    }
  });

  return {
    newlyCheckedWithRole,
    uncheckedWithRole,
    roleChangedRows,
  };
}

export function getDataToUpdateForPutRequest(changedData) {
  const dataToUpdate = [];

  const addUpdates = (rows, action) => {
    rows?.forEach(row => {
      dataToUpdate.push({
        course_id: row.courseId,
        role: row.role || row.to,
        action,
      });
    });
  };

  addUpdates(changedData?.newlyCheckedWithRole, 'assign');
  addUpdates(changedData?.roleChangedRows, 'assign');
  addUpdates(changedData?.uncheckedWithRole, 'revoke');

  return dataToUpdate;
}

export function extractErrorsFromUpdateResponse(changedData, response) {
  const newlyCheckedWithRoleErrors = [];
  const uncheckedWithRoleErrors = [];
  const roleChangedRowsErrors = [];

  const failedRows = (response?.results || []).filter(r => r.status === 'failed');

  const matchedKeys = new Set(); // to avoid adding the same row twice

  const collectErrors = (sourceArray, action, targetArray) => {
    sourceArray?.forEach(row => {
      const key = `${row.course_id}::${row.role}::${action}`;
      if (!matchedKeys.has(key)) {
        const failed = failedRows.find(
          r => r.course_id === row.course_id && r.role === row.role && r.action === action,
        );
        if (failed) {
          targetArray.push({ ...row, error: failed.error || 'Unknown error' });
          matchedKeys.add(key); // mark as processed so it won't be added to other arrays
        }
      }
    });
  };

  collectErrors(changedData.newlyCheckedWithRole, 'assign', newlyCheckedWithRoleErrors);
  collectErrors(changedData.uncheckedWithRole, 'revoke', uncheckedWithRoleErrors);
  collectErrors(changedData.roleChangedRows, 'assign', roleChangedRowsErrors);

  return {
    newlyCheckedWithRoleErrors,
    uncheckedWithRoleErrors,
    roleChangedRowsErrors,
  };
}
