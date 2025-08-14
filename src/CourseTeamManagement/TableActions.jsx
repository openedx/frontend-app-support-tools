import {
  Dropdown,
  DropdownButton,
  Form,
  Icon,
} from '@openedx/paragon';
import { Check, Search, ArrowDropDown } from '@openedx/paragon/icons';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';

import OrgDropdownWithSearch from './OrgDropdownWithSearch';
import messages from './messages';

const TableActions = ({
  search,
  setSearch,
  searchInputRef,
  status,
  setStatus,
  org,
  setOrg,
  orgFilterChoices,
  setRowRoles,
  sortedAndFilteredData,
  checkedRows,
  userCoursesData,
}) => {
  const intl = useIntl();
  let statusLabelMessage = messages.allCoursesFilterLabel;
  if (status === 'active') {
    statusLabelMessage = messages.activeCoursesFilterLabel;
  } else if (status === 'archived') {
    statusLabelMessage = messages.archivedCoursesFilterLabel;
  }

  return (
    <div className="custom-table-actions-container">
      <div className="custom-table-filter-actions">
        <Form.Control
          ref={searchInputRef}
          type="text"
          placeholder={intl.formatMessage(messages.searchPlaceholder)}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          trailingElement={<Icon src={Search} />}
        />
        <DropdownButton
          id="status-dropdown"
          title={
            (
              <span className="d-flex align-items-center">
                {intl.formatMessage(statusLabelMessage)}
                <Icon style={{ marginLeft: 8 }} src={ArrowDropDown} />
              </span>
            )
          }
          onSelect={(eventKey) => setStatus(eventKey)}
          className="ml-2"
          variant="outline-primary"
        >
          {[
            { value: '', label: messages.allCoursesFilterLabel },
            { value: 'active', label: messages.activeCoursesFilterLabel },
            { value: 'archived', label: messages.archivedCoursesFilterLabel },
          ].map((option) => (
            <Dropdown.Item
              data-testid={`status-dropdown-item-${option.value}`}
              key={option.value}
              eventKey={option.value}
              className="d-flex justify-content-between align-items-center"
            >
              {intl.formatMessage(option.label)}
              {status === option.value && <Icon src={Check} size="sm" />}
            </Dropdown.Item>
          ))}
        </DropdownButton>

        <OrgDropdownWithSearch
          org={org}
          setOrg={setOrg}
          orgFilterChoices={orgFilterChoices}
        />

        <DropdownButton
          id="role-dropdown"
          title={
            (
              <span className="d-flex align-items-center">
                {intl.formatMessage(messages.statusActionsFilterLabel)}
                <Icon style={{ marginLeft: 8 }} src={ArrowDropDown} />
              </span>
            )
          }
          onSelect={(eventKey) => {
            if (eventKey === 'staff' || eventKey === 'instructor') {
              const filteredCourseIds = new Set(sortedAndFilteredData.map((row) => row.course_id));
              setRowRoles((prev) => {
                const updated = { ...prev };
                Object.keys(checkedRows).forEach((courseId) => {
                  if (checkedRows[courseId] && filteredCourseIds.has(courseId)) {
                    updated[courseId] = eventKey;
                  }
                });
                return updated;
              });
            }
          }}
          className="ml-2"
          variant="outline-primary"
        >
          {[
            { value: 'staff', label: messages.statusStaffFilterLabel },
            { value: 'instructor', label: messages.statusAdminFilterLabel },
          ].map((option) => (
            <Dropdown.Item key={option.value} eventKey={option.value}>
              {intl.formatMessage(option.label)}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      </div>

      <div className="pgn__data-table-footer custom-table-data-actions">
        <p>
          {
            intl.formatMessage(
              messages.tableNoOfEntriesShowingLabel,
              {
                sortedAndFilteredDataLength: sortedAndFilteredData.length,
                userCoursesDataLength: userCoursesData.length,
              },
            )
          }
        </p>
      </div>
    </div>
  );
};

export default TableActions;

TableActions.propTypes = {
  search: PropTypes.string.isRequired,
  setSearch: PropTypes.func.isRequired,
  searchInputRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  status: PropTypes.string.isRequired,
  setStatus: PropTypes.func.isRequired,
  org: PropTypes.string.isRequired,
  setOrg: PropTypes.func.isRequired,
  orgFilterChoices: PropTypes.arrayOf(PropTypes.string).isRequired,
  setRowRoles: PropTypes.func.isRequired,
  sortedAndFilteredData: PropTypes.arrayOf(PropTypes.shape({
    course_id: PropTypes.string.isRequired,
  })).isRequired,
  checkedRows: PropTypes.objectOf(PropTypes.bool).isRequired,
  userCoursesData: PropTypes.arrayOf(PropTypes.shape({
    course_id: PropTypes.string.isRequired,
  })).isRequired,
};
