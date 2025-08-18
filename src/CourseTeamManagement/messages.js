import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  pageTitle: {
    id: 'courseTeamManagementPageTitle',
    defaultMessage: 'Manage Access',
    description: 'Course Team Management Page Title',
  },
  noUserSelected: {
    id: 'courseTeamManagementNoUserSelected',
    defaultMessage: 'No user selected',
    description: 'Message displayed when no user is selected in Course Team Management',
  },
  noUserSelectedDescription: {
    id: 'courseTeamManagementNoUserSelectedDescription',
    defaultMessage: 'Search by username or email to view courses and manage access.',
    description: 'Description displayed when no user is selected in Course Team Management',
  },
  searchPlaceholder: {
    id: 'courseTeamManagementSearchPlaceholder',
    defaultMessage: 'Search',
    description: 'Course Team Management search field placeholder',
  },
  allCoursesFilterLabel: {
    id: 'courseTeamManagementAllCoursesFilterLabel',
    defaultMessage: 'All Courses',
    description: 'Course Team Management All courses filter label',
  },
  activeCoursesFilterLabel: {
    id: 'courseTeamManagementActiveCoursesFilterLabel',
    defaultMessage: 'Active',
    description: 'Course Team Management Active courses filter label',
  },
  archivedCoursesFilterLabel: {
    id: 'courseTeamManagementArchivedCoursesFilterLabel',
    defaultMessage: 'Archived',
    description: 'Course Team Management Active courses filter label',
  },
  allOrgsFilterLabel: {
    id: 'courseTeamManagementAllOrgsFilterLabel',
    defaultMessage: 'All Orgs',
    description: 'Course Team Management All Organizations filter label',
  },
  allOrgsFilterDropdownLabel: {
    id: 'courseTeamManagementAllOrgsFilterDropdownLabel',
    defaultMessage: 'All Organizations',
    description: 'Course Team Management All Organizations filter Dropdown label',
  },
  noOrgFoundOrgsFilterDropdownLabel: {
    id: 'courseTeamManagementNoOrgFoundOrgsFilterDropdownLabel',
    defaultMessage: 'No results found',
    description: 'Course Team Management No results found Organizations filter Dropdown label',
  },
  noResultsFoundForTable: {
    id: 'courseTeamManagementNoResultsFoundForTable',
    defaultMessage: 'No results found',
    description: 'Course Team Management No results found in table to show',
  },
  statusActionsFilterLabel: {
    id: 'courseTeamManagementStatusActionsFilterLabel',
    defaultMessage: 'Actions',
    description: 'Course Team Management Actions filter label',
  },
  statusStaffFilterLabelChoice: {
    id: 'courseTeamManagementStatusStaffFilterLabelChoice',
    defaultMessage: 'Staff',
    description: 'Course Team Management Actions(set staff) filter label',
  },
  statusAdminFilterLabelChoice: {
    id: 'courseTeamManagementStatusAdminFilterLabelChoice',
    defaultMessage: 'Admin',
    description: 'Course Team Management Actions(set admin) filter label',
  },
  statusStaffFilterLabel: {
    id: 'courseTeamManagementStatusStaffFilterLabel',
    defaultMessage: 'Set role as staff',
    description: 'Course Team Management Actions(set staff) filter label',
  },
  statusAdminFilterLabel: {
    id: 'courseTeamManagementStatusAdminFilterLabel',
    defaultMessage: 'Set role as admin',
    description: 'Course Team Management Actions(set admin) filter label',
  },
  tableHeaderNameLabel: {
    id: 'courseTeamManagementTableHeaderNameLabel',
    defaultMessage: 'Name',
    description: 'Course Team Management Table Header Name Label',
  },
  tableHeaderNumberLabel: {
    id: 'courseTeamManagementTableHeaderNumberLabel',
    defaultMessage: 'Number',
    description: 'Course Team Management Table Header Number Label',
  },
  tableHeaderRunLabel: {
    id: 'courseTeamManagementTableHeaderRunLabel',
    defaultMessage: 'Run',
    description: 'Course Team Management Table Header Run Label',
  },
  tableHeaderAllCoursesStatusLabel: {
    id: 'courseTeamManagementTableHeaderAllCoursesStatusLabel',
    defaultMessage: 'Status',
    description: 'Course Team Management Table Header All courses(status) Label',
  },
  tableHeaderRoleLabel: {
    id: 'courseTeamManagementTableHeaderRoleLabel',
    defaultMessage: 'Role',
    description: 'Course Team Management Table Header Role Label',
  },
  tableNoResultsFound: {
    id: 'courseTeamManagementTableNoResultsFound',
    defaultMessage: 'No results found',
    description: 'Course Team Management Table No results found text message',
  },
  courseAccessForUsernameTitle: {
    id: 'courseTeamManagementCourseAccessFor',
    defaultMessage: 'Course access for {username}',
    description: 'Title for the course access page for a specific user',
  },
  courseAccessDescription: {
    id: 'courseTeamManagementCourseAccessForDescription',
    defaultMessage: 'Use checkboxes to add or remove course access.',
    description: 'Description for the course access page for a specific user',
  },
  saveButtonLabel: {
    id: 'courseTeamManagementSaveButtonLabel',
    defaultMessage: 'Save',
    description: 'Label for the save button in Course Team Management',
  },
  tableNoOfEntriesShowingLabel: {
    id: 'courseTeamManagementTableNoOfEntriesShowingLabel',
    defaultMessage: 'Showing 1 - {sortedAndFilteredDataLength} of {userCoursesDataLength}.',
    description: 'Label for the number of entries showing in the table',
  },
  usernameOrEmailUserSearchPlaceholder: {
    id: 'courseTeamManagementTableUsernameOrEmailUserSearchPlaceholder',
    defaultMessage: 'Username or email',
    description: 'Placeholder for User Search field',
  },
  userSearchUnsavedChangesModalHeader: {
    id: 'courseTeamManagementTableUserSearchUnsavedChangesModalHeader',
    defaultMessage: 'Unsaved changes',
    description: 'User Search Unsaved Changes Modal Header',
  },
  userSearchUnsavedChangesModalDescription: {
    id: 'courseTeamManagementTableUserSearchUnsavedChangesModalDescription',
    defaultMessage: 'Are you sure you want to leave this page? All unsaved changes will be lost.',
    description: 'User Search Unsaved Changes Modal Description',
  },
  userSearchUnsavedChangesModalStageOnPageBtn: {
    id: 'courseTeamManagementTableUserSearchUnsavedChangesModalStageOnPageBtn',
    defaultMessage: 'Stay on page',
    description: 'User Search Unsaved Changes Modal Stage On Page Button',
  },
  userSearchUnsavedChangesModalLeavePageBtn: {
    id: 'courseTeamManagementTableUserSearchUnsavedChangesModalLeavePageBtn',
    defaultMessage: 'Leave page',
    description: 'User Search Unsaved Changes Modal Leave Page Button',
  },
  supportToolHomePageUsernameOrEmailUserSearchPlaceholder: {
    id: 'supportToolHomePageUsernameOrEmailUserSearchPlaceholder',
    defaultMessage: 'Username, Email or LMS User ID',
    description: 'Placeholder for User Search field on support tool home page',
  },
  confirmChangesModalHeader: {
    id: 'courseTeamManagementTableConfirmChangesModalHeader',
    defaultMessage: 'Confirm changes?',
    description: 'Confirm changes? Modal Header',
  },
  errorChangesModalHeader: {
    id: 'courseTeamManagementTableErrorChangesModalHeader',
    defaultMessage: 'Changes not saved',
    description: 'Changes not saved Header in case of error in Modal',
  },
  confirmChangesModalDescription: {
    id: 'courseTeamManagementTableConfirmChangesModalDescription',
    defaultMessage: 'Are you sure you want to update access for:',
    description: 'Confirm changes Modal Description',
  },
  errorChangesModalDescription: {
    id: 'courseTeamManagementTableErrorChangesModalDescription',
    defaultMessage: 'We couldn\'t save the following updates for:',
    description: 'Changes not saved header description in case of error in Modal',
  },
  confirmChangesModalCloseButtonText: {
    id: 'confirmChangesModalCancelButton',
    defaultMessage: 'Cancel',
    description: 'Confirm changes Modal Cencel Button text',
  },
  confirmChangesModalSaveButton: {
    id: 'confirmChangesModalSaveButton',
    defaultMessage: 'Save',
    description: 'Confirm changes Modal Save Button text',
  },
  errorChangesModalCloseButtonText: {
    id: 'changesWithErrorsModalCloseButton',
    defaultMessage: 'Close',
    description: 'Error changes Modal Close Button text',
  },
  showMoreChangesInConfirmChangesModal: {
    id: 'showMoreChangesInConfirmChangesModal',
    defaultMessage: 'Show {hiddenCount} more',
    description: 'Show {count} more statement in confirm changes Modal',
  },
  addedToCourseCountChangesInConfirmChangesModal: {
    id: 'addedToCourseCountChangesInConfirmChangesModal',
    defaultMessage: 'Added to {count} course(s):',
    description: 'Added to {count} course(s) statement in confirm changes Modal',
  },
  removedFromCourseCountChangesInConfirmChangesModal: {
    id: 'removedFromCourseCountChangesInConfirmChangesModal',
    defaultMessage: 'Removed from {count} course(s):',
    description: 'Removed from {count} course(s): statement in confirm changes Modal',
  },
  roleUpdatedInCourseCountChangesInConfirmChangesModal: {
    id: 'roleUpdatedInCourseCountChangesInConfirmChangesModal',
    defaultMessage: 'Role updated in {count} course(s):',
    description: 'Role updated in {count} course(s): statement in confirm changes Modal',
  },
  addedToCourseCountChangesInConfirmChangesModalError: {
    id: 'addedToCourseCountChangesInConfirmChangesModalError',
    defaultMessage: 'Couldn\'t add to {count} course(s):',
    description: 'Added to {count} course(s) statement in confirm changes Modal',
  },
  removedFromCourseCountChangesInConfirmChangesModalError: {
    id: 'removedFromCourseCountChangesInConfirmChangesModalError',
    defaultMessage: 'Couldn\'t remove from {count} course(s):',
    description: 'Removed from {count} course(s): statement in confirm changes Modal',
  },
  roleUpdatedInCourseCountChangesInConfirmChangesModalError: {
    id: 'roleUpdatedInCourseCountChangesInConfirmChangesModalError',
    defaultMessage: 'Couldn\'t update role in {count} course(s):',
    description: 'Role updated in {count} course(s): statement in confirm changes Modal',
  },
  courseUpdatesErrorsAlertMessage: {
    id: 'courseUpdatesErrorsAlertMessage',
    defaultMessage: 'Some changes couldn\'t be saved.',
    description: 'Error message for course role updates alert.',
  },
  courseUpdatesErrorsAlertViewDetailsMessage: {
    id: 'courseUpdatesErrorsAlertViewDetailsMessage',
    defaultMessage: 'View details',
    description: 'Error message view details text for course role updates alert.',
  },
  courseTeamUpdateApiError: {
    id: 'courseTeamUpdateApiError',
    defaultMessage: 'Unexpected error occured while updating user roles.',
    description: 'Error message for Put API error.',
  },
  courseTeamGetApiError: {
    id: 'courseTeamGetApiError',
    defaultMessage: 'Unexpected error occured while fetching user courses.',
    description: 'Error message for Get API error.',
  },
  staffRole: {
    id: 'courseTeamManagementStaffRole',
    defaultMessage: 'Staff',
    description: 'Course Team Management Staff role text',
  },
  instructorRole: {
    id: 'courseTeamManagementInstructorRole',
    defaultMessage: 'Instructor',
    description: 'Course Team Management Instructor role text',
  },
  saveChangesButtonText: {
    id: 'courseTeamManagementSaveChangesButtonText',
    defaultMessage: 'Save',
    description: 'Course Team Management Save changes button text',
  },
  savingChangesButtonText: {
    id: 'courseTeamManagementSavingChangesButtonText',
    defaultMessage: 'Saving',
    description: 'Course Team Management Saving changes button text',
  },
  savedChangesButtonText: {
    id: 'courseTeamManagementSavedChangesButtonText',
    defaultMessage: 'Saved',
    description: 'Course Team Management Saved changes button text',
  },
  alertDismissBtnText: {
    id: 'alertDismissBtnText',
    defaultMessage: 'Dismiss',
    description: 'Alert dismiss button text',
  },
});
export default messages;
