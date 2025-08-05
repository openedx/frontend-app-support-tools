import React from 'react';
import { render,screen,waitFor } from '@testing-library/react';

import '@testing-library/jest-dom';



import FeatureBasedEnrollment from './FeatureBasedEnrollment';
import UserMessagesProvider from '../userMessages/UserMessagesProvider';


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

  it('renders title when FBE data is fetched', async () => {
    render(<FeatureBasedEnrollmentWrapper {...props} />);
    await waitFor(() => {
        expect(screen.getByText('Feature Based Enrollment Configuration')).toBeInTheDocument();
    });

  });
  it('shows no record message when no FBE data',async () => {
    jest.spyOn(api,'default').mockImplementationOnce(() => Promise.resolve({}));
    render(<FeatureBasedEnrollmentWrapper {...props} />);
    await waitFor(() => {
        expect(screen.getByText('No Feature Based Enrollment Configurations were found.')).toBeInTheDocument();
    });
});
it('shows loading message initially', () => {
    render(<FeatureBasedEnrollmentWrapper {...props} />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
});

it('shows error alert an API error', async () => {
    const fbeErrors = {
        errors: [
            {
                code: null,
                dismissible: true,
                text: 'Error fetching FBE Data',
                type: 'error',
                topic:'featureBasedEnrollment',
            },
        ],
    };
    
    jest.spyOn(api,'default').mockImplementationOnce(() => Promise.resolve(fbeErrors));
    render(<FeatureBasedEnrollmentWrapper {...props} />);
    await waitFor(() => {
        expect(screen.getByText('Error fetching FBE Data')).toBeInTheDocument();
    });
   });
});




 

//   

