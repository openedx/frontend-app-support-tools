import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import '@testing-library/jest-dom/extend-expect';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import CustomCatalogDetail from '../CustomCatalogDetail';

const mockCatalogTitle = 'Foo Bar Catalog';

describe('CustomCatalogDetail', () => {
  it('renders the component with content', () => {
    renderWithRouter(
      <IntlProvider locale="en"><CustomCatalogDetail catalogTitle={mockCatalogTitle} /></IntlProvider>,
    );
    expect(screen.getByText(mockCatalogTitle)).toBeInTheDocument();
  });
  // TODO: add test for making sure that the page correctly navigates to an error page when any API call fails (e.g.
  // during catalog retrieval).
});
