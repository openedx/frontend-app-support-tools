/* eslint-disable react/prop-types */
import { screen, render } from '@testing-library/react';
import { getConfig } from '@edx/frontend-platform';
import {
  CustomerNameHyperlink,
  DjangoIconHyperlink,
  PlanIdHyperlink,
  PlanTitleHyperlink,
} from '../DashboardTableLinks';
import '@testing-library/jest-dom';

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(),
}));

describe('DashboardTableLinks', () => {
  const row = {
    values: {
      uuid: '123456789',
      title: 'Pikachu',
      enterpriseCustomerName: 'Ash Ketchum',
    },
  };

  describe('PlanIdHyperlink', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('renders hyperlink if FEATURE_CONFIGURATION_EDIT_ENTERPRISE_PROVISION is true', () => {
      getConfig.mockImplementation(() => ({
        FEATURE_CONFIGURATION_EDIT_ENTERPRISE_PROVISION: 'true',
      }));
      render(<PlanIdHyperlink row={row} />);
      expect(screen.getByRole('link', { name: '123456789' })).toHaveAttribute('href', '/enterprise-configuration/learner-credit/123456789/view');
    });

    it('does not render hyperlink if FEATURE_CONFIGURATION_EDIT_ENTERPRISE_PROVISION is false', () => {
      getConfig.mockReturnValue({ FEATURE_CONFIGURATION_EDIT_ENTERPRISE_PROVISION: false });
      render(<PlanIdHyperlink row={row} />);
      expect(screen.queryByRole('link', { name: '123456789' })).toBeNull();
    });
  });

  describe('PlanTitleHyperlink', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('renders hyperlink if FEATURE_CONFIGURATION_EDIT_ENTERPRISE_PROVISION is true', () => {
      getConfig.mockImplementation(() => ({
        FEATURE_CONFIGURATION_EDIT_ENTERPRISE_PROVISION: 'true',
      }));
      render(<PlanTitleHyperlink row={row} />);
      expect(screen.getByRole('link', { name: 'Pikachu' })).toHaveAttribute('href', '/enterprise-configuration/learner-credit/123456789/view');
    });

    it('does not render hyperlink if FEATURE_CONFIGURATION_EDIT_ENTERPRISE_PROVISION is false', () => {
      getConfig.mockReturnValue({ FEATURE_CONFIGURATION_EDIT_ENTERPRISE_PROVISION: false });
      render(<PlanTitleHyperlink row={row} />);
      expect(screen.queryByRole('link', { name: 'Pikachu' })).toBeNull();
    });
  });

  describe('CustomerNameHyperlink', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('renders hyperlink if FEATURE_CONFIGURATION_EDIT_ENTERPRISE_PROVISION is true', () => {
      getConfig.mockImplementation(() => ({
        FEATURE_CONFIGURATION_EDIT_ENTERPRISE_PROVISION: 'true',
      }));
      render(<CustomerNameHyperlink row={row} />);
      expect(screen.getByRole('link', { name: 'Ash Ketchum' })).toHaveAttribute('href', '/enterprise-configuration/learner-credit/123456789/view');
    });

    it('does not render hyperlink if FEATURE_CONFIGURATION_EDIT_ENTERPRISE_PROVISION is false', () => {
      getConfig.mockReturnValue({ FEATURE_CONFIGURATION_EDIT_ENTERPRISE_PROVISION: false });
      render(<CustomerNameHyperlink row={row} />);
      expect(screen.queryByRole('link', { name: 'Ash Ketchum' })).toBeNull();
    });
  });

  describe('DjangoIconHyperlink', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('renders and links to subsidy edit route', () => {
      getConfig.mockImplementation(() => ({
        DJANGO_ADMIN_SUBSIDY_BASE_URL: 'https://pokemons.com',
      }));
      render(<DjangoIconHyperlink row={row} />);
      expect(screen.getByTestId('django-admin-link')).toHaveAttribute('href', 'https://pokemons.com/admin/subsidy/subsidy/123456789/change/');
    });
  });
});
