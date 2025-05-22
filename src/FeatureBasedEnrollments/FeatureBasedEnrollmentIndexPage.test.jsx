import {
  fireEvent, render, screen, waitFor,
} from '@testing-library/react';
import React from 'react';
import PropTypes from 'prop-types';
import { MemoryRouter } from 'react-router-dom';
import FeatureBasedEnrollmentIndexPage from './FeatureBasedEnrollmentIndexPage';
import UserMessagesProvider from '../userMessages/UserMessagesProvider';
import { fbeEnabledResponse } from './data/test/featureBasedEnrollment';

import * as api from './data/api';

const mockedNavigator = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigator,
}));

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
  let apiMock;
  const courseId = 'course-v1:testX+test123+2030';

  afterEach(() => {
    if (apiMock) {
      apiMock.mockReset();
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('default page render', async () => {
    render(<FeatureBasedEnrollmentIndexPageWrapper />);

    const courseIdInput = document.querySelector('input[name="courseId"]');
    const searchButton = document.querySelector('button.btn-primary');

    expect(courseIdInput.defaultValue).toEqual('');
    expect(searchButton.textContent).toEqual('Search');
  });

  it('default page render with query param course id', async () => {
    apiMock = jest.spyOn(api, 'default').mockImplementationOnce(() => Promise.resolve({}));
    render(<FeatureBasedEnrollmentIndexPageWrapper searchQuery={`?course_id=${courseId}`} />);

    const courseIdInput = document.querySelector('input[name="courseId"]');
    const searchButton = document.querySelector('button.btn-primary');

    expect(courseIdInput.defaultValue).toEqual(courseId);
    expect(searchButton.textContent).toEqual('Search');
  });

  it('valid search value', async () => {
    apiMock = jest.spyOn(api, 'default').mockImplementationOnce(() => Promise.resolve(fbeEnabledResponse));

    render(<FeatureBasedEnrollmentIndexPageWrapper />);

    document.querySelector('input[name="courseId"]').value = courseId;
    fireEvent.click(document.querySelector('button.btn-primary'));

    expect(apiMock).toHaveBeenCalledTimes(1);
    waitFor(async () => {
      const cards = await screen.findAllByTestId('feature-based-enrollment-card');
      expect(cards).toHaveLength(2);
      expect(mockedNavigator).toHaveBeenCalledWith(`/feature_based_enrollments/?course_id=${courseId}`);
    });
  });

  it('api call made on each click', async () => {
    apiMock = jest.spyOn(api, 'default').mockImplementation(() => Promise.resolve(fbeEnabledResponse));

    render(<FeatureBasedEnrollmentIndexPageWrapper />);

    document.querySelector('input[name="courseId"]').value = courseId;
    fireEvent.click(document.querySelector('button.btn-primary'));

    waitFor(() => {
      expect(apiMock).toHaveBeenCalledTimes(1);

      fireEvent.click(document.querySelector('button.btn-primary'));
      expect(apiMock).toHaveBeenCalledTimes(2);
    });
  });

  it('empty search value does not yield anything', async () => {
    apiMock = jest.spyOn(api, 'default').mockImplementationOnce(() => Promise.resolve(fbeEnabledResponse));
    render(<FeatureBasedEnrollmentIndexPageWrapper />);

    document.querySelector('input[name="courseId"]').value = '';
    fireEvent.click(document.querySelector('button.btn-primary'));
    waitFor(async () => {
      expect(apiMock).toHaveBeenCalledTimes(0);
      const cards = await screen.queryAllByTestId('feature-based-enrollment-card');
      expect(cards).toHaveLength(0);
      expect(mockedNavigator).toHaveBeenCalledWith('/feature_based_enrollments', { replace: true });
    });
  });

  it('Invalid search value', async () => {
    apiMock = jest.spyOn(api, 'default').mockImplementationOnce(() => Promise.resolve(fbeEnabledResponse));
    render(<FeatureBasedEnrollmentIndexPageWrapper />);

    document.querySelector('input[name="courseId"]').value = 'invalid-value';
    fireEvent.click(document.querySelector('button.btn-primary'));

    expect(apiMock).toHaveBeenCalledTimes(0);
    const cards = await screen.queryAllByTestId('feature-based-enrollment-card');
    expect(cards).toHaveLength(0);
    expect(document.querySelector('.alert').textContent).toEqual('Supplied course ID "invalid-value" is either invalid or incorrect.');
    expect(mockedNavigator).toHaveBeenCalledWith('/feature_based_enrollments', { replace: true });
  });
});
