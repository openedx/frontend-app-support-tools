import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import FeatureBasedEnrollment from './FeatureBasedEnrollment';
import UserMessagesProvider from '../userMessages/UserMessagesProvider';
import { fbeEnabledResponse } from './data/test/featureBasedEnrollment';

import * as api from './data/api';

const FeatureBasedEnrollmentWrapper = (props) => (
  <UserMessagesProvider>
    <FeatureBasedEnrollment {...props} />
  </UserMessagesProvider>
);

describe('Feature Based Enrollment', () => {
  const props = {
    courseId: 'course-v1:testX+test123+2030',
    apiFetchSignal: true,
  };

  let unmountComponent; let apiMock;

  beforeEach(async () => {
    // api file has only one default export, so that will be spied-on
    apiMock = jest.spyOn(api, 'default').mockImplementationOnce(() => Promise.resolve(fbeEnabledResponse));
    const { unmount } = render(<FeatureBasedEnrollmentWrapper {...props} />);
    unmountComponent = unmount;
  });

  afterEach(() => {
    unmountComponent();
  });

  it('default props', () => {
    expect(apiMock).toBeCalledWith(props.courseId);
  });

  it('Successful fetch for FBE data', async () => {
    const cardList = await screen.findAllByTestId('feature-based-enrollment-card');
    const courseTitle = document.querySelector('h4');

    await waitFor(() => {
      expect(cardList).toHaveLength(2);
      expect(document.querySelector('h3#fbe-title-header').textContent).toEqual('Feature Based Enrollment Configuration');
      expect(courseTitle.textContent).toEqual('Course Title: test course');
    });
  });

  it('No FBE Data', async () => {
    unmountComponent();
    jest.spyOn(api, 'default').mockImplementationOnce(() => Promise.resolve({}));
    render(<FeatureBasedEnrollmentWrapper {...props} />);

    const cardList = await screen.queryAllByTestId('feature-based-enrollment-card');
    const noRecordMessage = document.querySelector('p');

    expect(cardList).toHaveLength(0);
    expect(document.querySelector('h3#fbe-title-header').textContent).toEqual('Feature Based Enrollment Configuration');
    await waitFor(() => expect(noRecordMessage.textContent).toEqual('No Feature Based Enrollment Configurations were found.'));
  });

  it('Page Loading component render', async () => {
    render(<FeatureBasedEnrollmentWrapper {...props} />);
    expect((await screen.findByTestId('page-loading')).textContent).toEqual(expect.stringContaining('Loading'));
  });

  it('Error fetching FBE data', async () => {
    unmountComponent();
    const fbeErrors = {
      errors: [
        {
          code: null,
          dismissible: true,
          text: 'Error fetching FBE Data',
          type: 'error',
          topic: 'featureBasedEnrollment',
        },
      ],
    };
    jest.spyOn(api, 'default').mockImplementationOnce(() => Promise.resolve(fbeErrors));
    render(<FeatureBasedEnrollmentWrapper {...props} />);

    const alert = document.querySelector('.alert');
    waitFor(() => expect(alert.textContent).toEqual('Error fetching FBE Data'));
  });
});
