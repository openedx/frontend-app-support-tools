export function getChangedRows(checkedRows, originalCheckedRows, rowRoles, originalRowRoles, userCoursesData) {
  const newlyCheckedWithRole = [];
  const uncheckedWithRole = [];
  const roleChangedRows = [];

  const courseMetadata = userCoursesData.reduce((acc, row) => {
    acc[row.course_id] = {
      courseName: row.course_name,
      number: row.number,
      courseId: row.course_id,
      runId: row.run,
    };
    return acc;
  }, {});

  Object.keys(checkedRows).forEach((courseId) => {
    const wasChecked = originalCheckedRows[courseId] || false;
    const isChecked = checkedRows[courseId] || false;

    const originalRole = originalRowRoles[courseId];
    const currentRole = rowRoles[courseId];

    const { courseName, number, runId } = courseMetadata[courseId] || {};

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

  const matchedKeys = new Set();

  const collectErrors = (sourceArray, action, targetArray) => {
    sourceArray?.forEach(row => {
      const key = `${row.course_id}::${row.role}::${action}`;
      if (!matchedKeys.has(key)) {
        const failed = failedRows.find(
          r => r.course_id === row.course_id && r.role === row.role && r.action === action,
        );
        if (failed) {
          targetArray.push({ ...row, error: failed.error || 'Unknown error' });
          matchedKeys.add(key);
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
