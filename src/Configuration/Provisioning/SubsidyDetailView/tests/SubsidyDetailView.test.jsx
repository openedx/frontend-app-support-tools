import React from 'react';
import BrowserRouter from 'react-router-dom';
import { screen, act } from '@testing-library/react';
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import '@testing-library/jest-dom/extend-expect';
import SubsidyDetailView from '../SubsidyDetailView';
import LmsApiService from '../../../../data/services/EnterpriseApiService';

const mocks = {
  enterpriseCustomerCatalogsMock: {
    data: {
      results: [{
        enterprise_customer: '4a67c952-8eb1-44ba-9ab3-2faa5d0905de',
        title: '4a67c952-8eb1-44ba-9ab3-2faa5d0905de - Open Courses budget',
        uuid: '69035754-fa48-4519-92d8-a723ae0f6e58',
      }],
    },
  },
  customersBasicListMock: {
    data: [{
      id: '4a67c952-8eb1-44ba-9ab3-2faa5d0905de',
      name: 'MA Corp',
    }],
  },
  singleSubsidyMock: {
    data: {
      results: [{
        uuid: '0196e5c3-ba08-4798-8bf1-019d747c27bf',
        title: 'AshKetchum-Test',
        enterprise_customer_uuid: '4a67c952-8eb1-44ba-9ab3-2faa5d0905de',
        active_datetime: '2023-06-20T00:00:00Z',
        expiration_datetime: '2023-06-22T00:00:00Z',
        reference_id: '00sdfsdfsdfsadfasd',
        current_balance: 900000,
        starting_balance: 900000,
        internal_only: true,
        revenue_category: 'partner-no-rev-prepay',
        is_active: false,
      }],
    },
  },
  policyMock: {
    data: {
      results: [
        {
          uuid: '1fedab07-8872-4795-8f8c-e4035b1f41b7',
          description: 'description',
          enterprise_customer_uuid: '4a67c952-8eb1-44ba-9ab3-2faa5d0905de',
          catalog_uuid: '69035754-fa48-4519-92d8-a723ae0f6e58',
          subsidy_uuid: '0196e5c3-ba08-4798-8bf1-019d747c27bf',
          per_learner_enrollment_limit: null,
          per_learner_spend_limit: 5000,
          spend_limit: 500000,
          subsidy_active_datetime: '2023-06-20T00:00:00Z',
          subsidy_expiration_datetime: '2023-06-22T00:00:00Z',
          is_subsidy_active: false,
        },
      ],
    },
  },
};

const mockNavigate = jest.fn();

jest.mock('../../../../data/services/EnterpriseApiService', () => ({
  fetchEnterpriseCustomerCatalogs: jest.fn(() => Promise.resolve(mocks.enterpriseCustomerCatalogsMock)),
  fetchSubsidyAccessPolicies: jest.fn(() => Promise.resolve(mocks.policyMock)),
  fetchEnterpriseCustomersBasicList: jest.fn(() => Promise.resolve(mocks.customersBasicListMock)),
}));

jest.mock('../../../../data/services/SubsidyApiService', () => ({
  fetchSingleSubsidy: jest.fn(() => Promise.resolve(mocks.singleSubsidyMock)),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useNavigate: () => mockNavigate,
}));

describe('SubsidyDetailView', () => {
  it('renders the component with content when loading is true', async () => {
    jest.spyOn(BrowserRouter, 'useParams').mockReturnValue({ id: '0196e5c3-ba08-4798-8bf1-019d747c27bf' });
    await act(async () => renderWithRouter(
      <SubsidyDetailView />,
    ));
    expect(screen.getByText('Plan Details')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('AshKetchum-Test')).toBeInTheDocument();
    expect(screen.getByText('Customer')).toBeInTheDocument();
    expect(screen.getByText('Enterprise Customer / UUID')).toBeInTheDocument();
    expect(screen.getByText('MA Corp / 4a67c952-8eb1-44ba-9ab3-2faa5d0905de')).toBeInTheDocument();
    expect(screen.getByText('Opportunity Product')).toBeInTheDocument();
    expect(screen.getByText('00sdfsdfsdfsadfasd')).toBeInTheDocument();
    expect(screen.getByText('Term')).toBeInTheDocument();
    expect(screen.getByText('Start Date')).toBeInTheDocument();
    expect(screen.getByText('June 20, 2023')).toBeInTheDocument();
    expect(screen.getByText('End Date')).toBeInTheDocument();
    expect(screen.getByText('June 22, 2023')).toBeInTheDocument();
    expect(screen.getByText('Internal only')).toBeInTheDocument();
    expect(screen.getByText('Test Plan')).toBeInTheDocument();
    expect(screen.getByText('Subsidy Type')).toBeInTheDocument();
    expect(screen.getByText('Rev req through standard commercial process?')).toBeInTheDocument();
    expect(screen.getByText('No (partner no rev prepay)')).toBeInTheDocument();
    expect(screen.getByText('Budget by product')).toBeInTheDocument();
    expect(screen.getByText('Divide Learner Credit purchase value by product?')).toBeInTheDocument();
    expect(screen.getByText('No, create one Learner Credit budget')).toBeInTheDocument();
    expect(screen.getByText('Budget')).toBeInTheDocument();
    expect(screen.getByText('Rev req through standard commercial process?')).toBeInTheDocument();
    expect(screen.getByText('Display name')).toBeInTheDocument();
    expect(screen.getByText('AshKetchum-Test - Open Courses budget')).toBeInTheDocument();
    expect(screen.getByText('Budget starting balance ($)')).toBeInTheDocument();
    expect(screen.getByText('$5,000')).toBeInTheDocument();
    expect(screen.getByText('Catalog')).toBeInTheDocument();
    expect(screen.getByText('Open Courses')).toBeInTheDocument();
    expect(screen.getByText('Limits')).toBeInTheDocument();
    expect(screen.getByText('Create learner spend limits?')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('Per learner spend limit ($)')).toBeInTheDocument();
    expect(screen.getByText('$50')).toBeInTheDocument();
  });

  it('redirects to error page if at least one API call fails', async () => {
    LmsApiService.fetchEnterpriseCustomerCatalogs.mockImplementation(() => Promise.reject(new Error('API error')));
    await act(async () => renderWithRouter(<SubsidyDetailView />));
    expect(mockNavigate).toHaveBeenCalledWith('/enterprise-configuration/learner-credit/error', { state: { errorMessage: 'Error undefined: Error: API error' } });
  });
});
