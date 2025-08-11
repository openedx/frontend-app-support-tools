import { mount } from 'enzyme';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { act } from 'react-dom/test-utils';
import CoursesTable from './CoursesTable';
import * as api from './data/api';

export const intlProviderWrapper = (component) => (
  <IntlProvider locale="en" messages={{}}>
    {component}
  </IntlProvider>
);

const sampleCourses = [
  {
    course_name: 'Test Course A',
    number: 'CS101',
    run: 'run1',
    status: 'active',
    role: 'staff',
    org: 'edx',
    course_url: 'https://example.com/course-a',
  },
  {
    course_name: 'Test Course B',
    number: 'CS102',
    run: 'run2',
    status: 'archived',
    role: 'instructor',
    org: 'mitx',
    course_url: 'https://example.com/course-b',
  },
];

describe('CoursesTable', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(intlProviderWrapper(
      <CoursesTable username="testuser" userCourses={sampleCourses} />,
    ));
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('.course-team-management-courses-table')).toHaveLength(1);
    });

    it('renders course rows', () => {
      expect(wrapper.find('a').at(0).text()).toEqual('Test Course A');
      expect(wrapper.find('a').at(1).text()).toEqual('Test Course B');
    });

    it('shows empty state if no matching results', () => {
      const input = wrapper.find('input[type="text"]').at(0);
      input.simulate('change', { target: { value: 'non-existent' } });
      wrapper.update();
      expect(wrapper.find('.pgn__data-table-empty').text())
        .toContain('No results'); // adjust string if localized
    });

    it('renders Save button', () => {
      expect(wrapper.find('button').last().text()).toEqual('Save');
    });
  });

  describe('Checkbox Selection', () => {
    it('checks default checkbox states', () => {
      expect(wrapper.find('input[type="checkbox"]').at(1).prop('checked')).toBe(true);
      expect(wrapper.find('input[type="checkbox"]').at(2).prop('checked')).toBe(true);
    });

    it('toggles row checkbox state on click', () => {
      const firstCheckbox = wrapper.find('input[type="checkbox"]').at(1);
      firstCheckbox.simulate('change');
      wrapper.update();
      expect(wrapper.find('input[type="checkbox"]').at(1).prop('checked')).toBe(false);
    });

    it('unchecks all checkboxes when header checkbox is clicked and all are already checked', () => {
      const headerCheckbox = wrapper.find('input[type="checkbox"]').at(0);
      headerCheckbox.simulate('change');
      wrapper.update();

      const checkboxes = wrapper.find('input[type="checkbox"]');
      expect(checkboxes.at(1).prop('checked')).toBe(false);
      expect(checkboxes.at(2).prop('checked')).toBe(false);
    });

    it('checks all checkboxes when header checkbox is clicked and not all are checked', () => {
      const rowCheckbox = wrapper.find('input[type="checkbox"]').at(1);
      rowCheckbox.simulate('change');
      wrapper.update();

      const headerCheckbox = wrapper.find('input[type="checkbox"]').at(0);
      headerCheckbox.simulate('change');
      wrapper.update();

      const checkboxes = wrapper.find('input[type="checkbox"]');
      expect(checkboxes.at(1).prop('checked')).toBe(true);
      expect(checkboxes.at(2).prop('checked')).toBe(true);
    });
  });

  describe('Sorting', () => {
    it('sorts by course_name ascending when header is clicked once', () => {
      const headerIcon = wrapper.find('[data-testid="sort-icon-course_name"]').first();
      headerIcon.simulate('click');
      wrapper.update();

      const sortedCourseName = wrapper.find('a').at(0).text();
      expect(sortedCourseName).toBe('Test Course A');
    });

    it('sorts by course_name descending when header is clicked twice', () => {
      const headerIcon = wrapper.find('[data-testid="sort-icon-course_name"]').first();
      headerIcon.simulate('click'); // ascending
      headerIcon.simulate('click'); // descending
      wrapper.update();

      const sortedCourseName = wrapper.find('a').at(0).text();
      expect(sortedCourseName).toBe('Test Course B');
    });

    it('keeps original order for items with same course_name (stable sort)', () => {
      const duplicateCourses = [
        {
          course_name: 'Same Course',
          number: 'CS201',
          run: 'run3',
          status: 'active',
          role: 'staff',
          org: 'edx',
          course_url: 'https://example.com/course-c',
        },
        {
          course_name: 'Same Course',
          number: 'CS202',
          run: 'run4',
          status: 'archived',
          role: 'instructor',
          org: 'mitx',
          course_url: 'https://example.com/course-d',
        },
      ];

      const duplicateWrapper = mount(intlProviderWrapper(
        <CoursesTable username="testuser" userCourses={duplicateCourses} />,
      ));

      const headerIcon = duplicateWrapper.find('[data-testid="sort-icon-course_name"]').first();
      headerIcon.simulate('click');
      duplicateWrapper.update();

      const anchors = duplicateWrapper.find('a');
      expect(anchors.at(0).prop('href')).toBe('https://example.com/course-c');
      expect(anchors.at(1).prop('href')).toBe('https://example.com/course-d');
    });
  });

  describe('Role Dropdown', () => {
    it('updates role to "staff" when staff dropdown item is clicked', () => {
      const toggle = wrapper.find('[data-testid="role-dropdown-run1"]').at(0);
      expect(toggle.exists()).toBe(true);
      toggle.simulate('click');
      wrapper.update();

      const staffItem = wrapper.find('[data-testid="role-dropdown-item-staff-run1"]');
      staffItem.at(0).simulate('click');
      wrapper.update();

      expect(wrapper.text()).toContain('Staff');
    });

    it('updates role to "instructor" when instructor dropdown item is clicked', () => {
      const toggle = wrapper.find('[data-testid="role-dropdown-run1"]').at(0);
      toggle.simulate('click');
      wrapper.update();

      const instructorItem = wrapper.find('[data-testid="role-dropdown-item-instructor-run1"]');
      instructorItem.at(0).simulate('click');
      wrapper.update();

      expect(wrapper.text()).toContain('Admin');
    });
  });

  describe('Table Actions - Status Dropdown', () => {
    it('updates status to "active" and filters only active courses', () => {
      const dropdownButton = wrapper.find('DropdownButton#status-dropdown');
      expect(dropdownButton.exists()).toBe(true);

      dropdownButton.prop('onSelect')('active');
      wrapper.update();

      expect(wrapper.text()).toContain('Active');

      const courseNames = wrapper.find('a').map(a => a.text());
      expect(courseNames).toContain('Test Course A');
      expect(courseNames).not.toContain('Test Course B');
    });

    it('updates status to "archived" and filters only archived courses', () => {
      const dropdownButton = wrapper.find('DropdownButton#status-dropdown');
      expect(dropdownButton.exists()).toBe(true);

      dropdownButton.prop('onSelect')('archived');
      wrapper.update();

      expect(wrapper.text()).toContain('Archived');

      const courseNames = wrapper.find('a').map(a => a.text());
      expect(courseNames).not.toContain('Test Course A');
      expect(courseNames).toContain('Test Course B');
    });
  });
  describe('Table Actions - Role Action', () => {
    it('updates role to "staff" for all selected and visible rows when selected via table-level role dropdown', () => {
      // Initially all checkboxes are selected
      const roleDropdown = wrapper.find('DropdownButton#role-dropdown');
      expect(roleDropdown.exists()).toBe(true);

      // Simulate selecting "staff" from the table-level dropdown
      roleDropdown.prop('onSelect')('staff');
      wrapper.update();

      // Now check if all visible selected rows (both) have role changed to "Staff"
      const text = wrapper.text();
      expect(text).toContain('Staff');
    });

    it('updates role to "instructor" for all selected and visible rows when selected via table-level role dropdown', () => {
      const roleDropdown = wrapper.find('DropdownButton#role-dropdown');
      expect(roleDropdown.exists()).toBe(true);

      // Simulate selecting "instructor" from the table-level dropdown
      roleDropdown.prop('onSelect')('instructor');
      wrapper.update();

      // Now check if all visible selected rows (both) have role changed to "Admin"
      const text = wrapper.text();
      expect(text).toContain('Admin');
    });

    it('updates role only for checked rows, not for unchecked ones', () => {
      // Uncheck first row manually
      const firstCheckbox = wrapper.find('input[type="checkbox"]').at(1);
      firstCheckbox.simulate('change');
      wrapper.update();

      const roleDropdown = wrapper.find('DropdownButton#role-dropdown');
      roleDropdown.prop('onSelect')('staff');
      wrapper.update();

      const rows = wrapper.find('tbody tr');
      const firstRow = rows.at(0);
      const secondRow = rows.at(1);

      // First row should still show original role
      expect(firstRow.text()).toMatch(/Staff/i);

      // Second row (still checked) should have updated role from admin to staff
      expect(secondRow.text()).toMatch(/Staff/i);
    });
  });
  describe('Table Actions - Status Dropdown', () => {
    it('shows all courses again when status filter is cleared', () => {
      const dropdownButton = wrapper.find('DropdownButton#status-dropdown');
      expect(dropdownButton.exists()).toBe(true);

      // Apply "archived" filter first
      dropdownButton.prop('onSelect')('archived');
      wrapper.update();
      expect(wrapper.text()).not.toContain('Test Course A');
      expect(wrapper.text()).toContain('Test Course B');

      // Clear filter (pass empty string)
      dropdownButton.prop('onSelect')('');
      wrapper.update();

      const courseNames = wrapper.find('a').map(a => a.text());
      expect(courseNames).toContain('Test Course A');
      expect(courseNames).toContain('Test Course B');
    });

    it('renders correct course count after status filter is applied', () => {
      const dropdownButton = wrapper.find('DropdownButton#status-dropdown');

      // Apply "active" filter
      dropdownButton.prop('onSelect')('active');
      wrapper.update();

      const rows = wrapper.find('tbody tr');
      expect(rows).toHaveLength(1);
      expect(rows.at(0).text()).toContain('Test Course A');
    });
  });

  describe('Table Actions - Org Dropdown', () => {
    it('filters courses by organization when a specific org is selected', () => {
      // Open dropdown
      const orgDropdownToggle = wrapper.find('[data-testid="org-dropdown-toggle"]').at(0);
      expect(orgDropdownToggle.exists()).toBe(true);

      orgDropdownToggle.simulate('click');
      wrapper.update();

      // Select "mitx" org
      const mitxOption = wrapper.find('[data-testid="org-dropdown-option-mitx"]').at(0);
      expect(mitxOption.exists()).toBe(true);

      mitxOption.simulate('click');
      wrapper.update();

      const courseNames = wrapper.find('a').map((a) => a.text());
      expect(courseNames).not.toContain('Test Course A'); // org: edx
      expect(courseNames).toContain('Test Course B'); // org: mitx
    });

    it('clears organization filter when All Organizations is selected', () => {
      // Open dropdown
      const orgDropdownToggle = wrapper.find('[data-testid="org-dropdown-toggle"]').at(0);
      orgDropdownToggle.simulate('click');
      wrapper.update();

      // Select "mitx"
      wrapper.find('[data-testid="org-dropdown-option-mitx"]').simulate('click');
      wrapper.update();

      // Confirm only Test Course B is shown
      let courseNames = wrapper.find('a').map((a) => a.text());
      expect(courseNames).not.toContain('Test Course A');
      expect(courseNames).toContain('Test Course B');

      // Reopen dropdown
      const dropdownToggle = wrapper.find('[data-testid="org-dropdown-toggle"]').at(0);
      dropdownToggle.simulate('click');
      wrapper.update();

      // Click on "All Organizations"
      wrapper.find('[data-testid="org-dropdown-option-all"]').simulate('click').at(0);
      wrapper.update();

      // Confirm both courses are shown again
      courseNames = wrapper.find('a').map((a) => a.text());
      expect(courseNames).toContain('Test Course A');
      expect(courseNames).toContain('Test Course B');
    });

    it('shows "No organizations found" when search yields no results', () => {
      const dropdownToggle = wrapper.find('[data-testid="org-dropdown-toggle"]').at(0);
      dropdownToggle.simulate('click');
      wrapper.update();

      const searchInput = wrapper.find('input[placeholder="Search"]').at(1);
      expect(searchInput.exists()).toBe(true);

      searchInput.simulate('change', { target: { value: 'nonexistent' } });
      wrapper.update();

      expect(wrapper.text()).toContain('No results found');
    });
  });

  describe('CoursesTable save workflow', () => {
    const mockCourses = [
      {
        course_name: 'Test Course A',
        number: 'CS101',
        run: 'run1',
        status: 'active',
        role: 'staff',
        org: 'edx',
        course_url: 'https://example.com/course-a',
      },
      {
        course_name: 'Test Course B',
        number: 'CS102',
        run: 'run2',
        status: 'archived',
        role: 'instructor',
        org: 'mitx',
        course_url: 'https://example.com/course-b',
      },
      {
        course_name: 'Test Course c',
        number: 'CS103',
        run: 'run3',
        status: 'active',
        org: 'harvard',
        role: null,
        course_url: 'https://example.com/course-c',
      },
      {
        course_name: 'Test Course d',
        number: 'CS104',
        run: 'run4',
        status: 'active',
        org: 'harvard',
        role: null,
        course_url: 'https://example.com/course-d',
      },
      {
        course_name: 'Test Course e',
        number: 'CS105',
        run: 'run5',
        status: 'active',
        org: 'harvard',
        role: null,
        course_url: 'https://example.com/course-e',
      },
      {
        course_name: 'Test Course f',
        number: 'CS106',
        run: 'run6',
        status: 'active',
        org: 'harvard',
        role: null,
        course_url: 'https://example.com/course-f',
      },
      {
        course_name: 'Test Course g',
        number: 'CS107',
        run: 'run7',
        status: 'active',
        org: 'harvard',
        role: null,
        course_url: 'https://example.com/course-g',
      },
    ];

    const setCourseUpdateErrorsMock = jest.fn();
    const defaultProps = {
      userCourses: mockCourses,
      username: 'test',
      email: 'test@test.com',
      setCourseUpdateErrors: setCourseUpdateErrorsMock,
    };

    beforeEach(() => {
      jest.spyOn(api, 'updateUserRolesInCourses').mockResolvedValue([]); // mock API success
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('opens ChangeConfirmationModal and confirms save', async () => {
      wrapper = mount(intlProviderWrapper(<CoursesTable {...defaultProps} />));

      // make changes in course table
      wrapper.find('input[type="checkbox"]').at(1).simulate('change');
      wrapper.find('input[type="checkbox"]').at(3).simulate('change');
      wrapper.find('input[type="checkbox"]').at(4).simulate('change');
      wrapper.find('input[type="checkbox"]').at(5).simulate('change');
      wrapper.find('input[type="checkbox"]').at(6).simulate('change');
      wrapper.find('input[type="checkbox"]').at(7).simulate('change');
      wrapper.find('[data-testid="role-dropdown-run2"]').at(0).simulate('click');
      wrapper.find('[data-testid="role-dropdown-item-staff-run2"]').at(0).simulate('click');

      // open, then close, then re-open modal and also try show more course changes
      wrapper.find('[data-testid="save-course-changes"]').at(0).simulate('click');
      wrapper.find('[data-testid="cancel-save-course-changes"]').at(0).simulate('click');
      wrapper.find('[data-testid="save-course-changes"]').at(0).simulate('click');
      wrapper.find('[data-testid="show-more-changes"]').at(0).simulate('click');

      // confirm save in modal
      wrapper.find('[data-testid="confirm-save-course-changes"]').at(0).simulate('click');

      // wait for async useEffect
      jest.useFakeTimers();
      await act(async () => {
        await Promise.resolve();
        jest.runAllTimers(); // for the setTimeout in useEffect
      });

      wrapper.update();

      expect(api.updateUserRolesInCourses).toHaveBeenCalledWith({
        userEmail: defaultProps.email,
        changedCourses: expect.any(Object),
      });
    });
    it('adds beforeunload listener and prevents unload when there are unsaved changes', () => {
      wrapper = mount(intlProviderWrapper(<CoursesTable {...defaultProps} />));
      // make changes in course table and it will set hasUnsavedChangesRef.current to true
      wrapper.find('input[type="checkbox"]').at(1).simulate('change');
      const event = new Event('beforeunload');
      Object.defineProperty(event, 'returnValue', {
        writable: true,
        value: undefined,
      });
      window.dispatchEvent(event);

      expect(event.returnValue).toBe('');
    });
  });
});
