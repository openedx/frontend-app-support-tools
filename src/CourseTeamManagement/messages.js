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
});
export default messages;
