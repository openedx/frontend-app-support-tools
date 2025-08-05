import React from 'react';
import PropTypes from 'prop-types';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent,waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FeatureBasedEnrollmentIndexPage from './FeatureBasedEnrollmentIndexPage';
import UserMessagesProvider from '../userMessages/UserMessagesProvider';
import { fbeEnabledResponse } from './data/test/featureBasedEnrollment';
import * as api from './data/api';
import '@testing-library/jest-dom'
import { input } from '@testing-library/user-event/dist/cjs/event/input.js';

const mockedNavigator = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigator,
}));
describe('Feature Based Enrollment Index Page', () => {
  afterEach(() =>{
    jest.clearAllMocks();
  });

const FeatureBasedEnrollmentIndexPageWrapper = ({ searchQuery }) => (
  <MemoryRouter initialEntries={[`/feature_based_enrollments${searchQuery}`]}>
    <UserMessagesProvider>
      <FeatureBasedEnrollmentIndexPage />
    </UserMessagesProvider>
  </MemoryRouter>
);

FeatureBasedEnrollmentIndexPageWrapper.propTypes = {
  searchQuery: PropTypes.string,
};

FeatureBasedEnrollmentIndexPageWrapper.defaultProps = {
  searchQuery: '',
};

describe('Feature Based Enrollment Index Page', () => {
  
  const courseId = 'course-v1:testX+test123+2030';

  beforeEach(() => {
    jest.clearAllMocks();
  });
  

  it('default page render',async () => {
    render(<FeatureBasedEnrollmentIndexPageWrapper   courseId ={courseId} />);
    const input =  screen.getByRole("textbox");
    fireEvent.change(input,{target:{value:"course-v1:testX+test123+2030"}});
    const searchButton = screen.getByRole('button', { name: /search/i });

    expect(screen.getByDisplayValue("course-v1:testX+test123+2030")).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
  });

  it('default page render with query param course id', () => {
    jest.spyOn(api, 'default').mockResolvedValueOnce({});
    render(<FeatureBasedEnrollmentIndexPageWrapper searchQuery={`?course_id=${courseId}`} />);
    const courseIdInput = screen.getByRole('textbox');

    expect(courseIdInput).toHaveValue(courseId);
  });
  
  it('api call made on each click', async () => {
    jest.spyOn(api, 'default').mockResolvedValue(fbeEnabledResponse);
    render(<FeatureBasedEnrollmentIndexPageWrapper />);

    const courseIdInput = screen.getByRole('textbox');
    const searchButton = screen.getByRole('button', { name: /search/i });

    await userEvent.clear(courseIdInput);
    await userEvent.type(courseIdInput, courseId);
    await userEvent.click(searchButton);

    await waitFor(() => expect(api.default).toHaveBeenCalledTimes(1));

    await userEvent.click(searchButton);
    await waitFor(() => expect(api.default).toHaveBeenCalledTimes(2));
  });

  it('empty search value does not yield anything', async () => {
    jest.spyOn(api, 'default').mockResolvedValueOnce(fbeEnabledResponse);
    render(<FeatureBasedEnrollmentIndexPageWrapper />);

    const courseIdInput = screen.getByRole('textbox');
    const searchButton = screen.getByRole('button', { name: /search/i });

    await userEvent.clear(courseIdInput);
    await userEvent.click(searchButton);

    await waitFor(() => {
      expect(api.default).not.toHaveBeenCalled();
      expect(screen.queryAllByTestId('fbe-card')).toHaveLength(0);
      expect(mockedNavigator).toHaveBeenCalledWith('/feature_based_enrollments', { replace: true });
    });
  });

  it('Invalid search value', async () => {
    jest.spyOn(api, 'default').mockResolvedValueOnce(fbeEnabledResponse);
    render(<FeatureBasedEnrollmentIndexPageWrapper />);

    const courseIdInput = screen.getByRole('textbox');
    const searchButton = screen.getByRole('button', { name: /search/i });

    await userEvent.clear(courseIdInput);
    await userEvent.type(courseIdInput, 'invalid-value');
    await userEvent.click(searchButton);

    await waitFor(() => {
      expect(api.default).not.toHaveBeenCalled();
      expect(screen.queryAllByTestId('fbe-card')).toHaveLength(0);
      expect(screen.getByText(/supplied course ID "invalid-value" is either invalid or incorrect/i)).toBeInTheDocument();
      expect(mockedNavigator).toHaveBeenCalledWith('/feature_based_enrollments', { replace: true });
    });
  });
});
});
