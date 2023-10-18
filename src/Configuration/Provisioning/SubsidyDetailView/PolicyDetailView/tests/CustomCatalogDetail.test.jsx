import React from 'react';
import { screen, act } from '@testing-library/react';
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import '@testing-library/jest-dom/extend-expect';
import CustomCatalogDetail from '../CustomCatalogDetail';
import LmsApiService from '../../../../../data/services/EnterpriseApiService';

const mockData = {
  data: {
    results: [
      {
        title: 'TestTest',
        content_filter: {
          content_type: 'courses',
          availability: [
            'Current',
            'Starting Soon',
            'Upcoming',
          ],
          partner: 'edx',
        },
      },
    ],
  },
  catalogTitle: '5c0ced09-db71-438f-bfb5-fac49644e26d - TestTest',
};

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../../../../../data/services/EnterpriseApiService', () => ({
  fetchEnterpriseCatalogQueries: jest.fn(() => Promise.resolve(mockData)),
}));

describe('CustomCatalogDetail', () => {
  it('renders the component with content when loading is false', async () => {
    await act(async () => renderWithRouter(
      <CustomCatalogDetail catalogTitle={mockData.catalogTitle} />,
    ));
    expect(screen.getByText(mockData.catalogTitle)).toBeInTheDocument();
    expect(screen.getByText('Content filter')).toBeInTheDocument();
    const textContent = (
      '{ "content_type": "courses", "availability": [ "Current", "Starting Soon", "Upcoming" ], "partner": "edx" }'
    );
    expect(screen.getByTestId('content-filter'))
      .toHaveTextContent(textContent);
  });

  it('redirects to error page if API call fails', async () => {
    LmsApiService.fetchEnterpriseCatalogQueries.mockImplementation(() => Promise.reject(new Error('API error')));

    await act(async () => renderWithRouter(<CustomCatalogDetail catalogTitle={mockData.catalogTitle} />));

    expect(mockNavigate).toHaveBeenCalledWith('/enterprise-configuration/learner-credit/error', { state: { errorMessage: 'Error undefined: Error: API error' } });
  });
});
