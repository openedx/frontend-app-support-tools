import { v4 as uuidv4 } from 'uuid';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import AssociatedCatalogDetail from '../AssociatedCatalogDetail';
import { initialStateValue, ProvisioningContext } from '../../../../testData/Provisioning';
import { PREDEFINED_QUERIES_ENUM, PREDEFINED_QUERY_DISPLAY_NAMES } from '../../../data/constants';

const AssociatedCatalogDetailWrapper = ({
  // eslint-disable-next-line react/prop-types
  value = initialStateValue,
}) => (
  <ProvisioningContext value={value}>
    <AssociatedCatalogDetail index={0} />
  </ProvisioningContext>
);

describe('AssociatedCatalog', () => {
  it('renders the component with only the predefined catalog type', () => {
    const mockCatalogUuid = uuidv4();
    const mockCatalogTitle = (
      `${initialStateValue.enterpriseUUID} --- ${PREDEFINED_QUERY_DISPLAY_NAMES[PREDEFINED_QUERIES_ENUM.openCourses]}`
    );
    const value = {
      ...initialStateValue,
      formData: {
        ...initialStateValue.formData,
        policies: [
          {
            predefinedQueryType: PREDEFINED_QUERIES_ENUM.openCourses,
            customCatalog: false,
            catalogTitle: mockCatalogTitle,
            catalogUuid: mockCatalogUuid,
          },
        ],
      },
    };
    render(<AssociatedCatalogDetailWrapper value={value} />);
    expect(screen.getByText('Catalog')).toBeInTheDocument();
    expect(screen.getByText('Associated catalog')).toBeInTheDocument();
    expect(screen.getByText('Open Courses')).toBeInTheDocument();

    // Also, must not render the catalog title or uuid since this is a predefined catalog.
    expect(screen.queryByText(mockCatalogTitle, { exact: false })).toBeNull();
    expect(screen.queryByText(mockCatalogUuid, { exact: false })).toBeNull();
  });
  it('renders the component with the full custom catalog title and uuid', () => {
    const mockCatalogUuid = uuidv4();
    const mockCatalogTitle = 'foo bar custom catalog title';
    const value = {
      ...initialStateValue,
      formData: {
        ...initialStateValue.formData,
        policies: [
          {
            predefinedQueryType: undefined,
            customCatalog: true,
            catalogTitle: mockCatalogTitle,
            catalogUuid: mockCatalogUuid,
          },
        ],
      },
    };
    render(<AssociatedCatalogDetailWrapper value={value} />);
    expect(screen.getByText('Catalog')).toBeInTheDocument();
    expect(screen.getByText('Associated catalog')).toBeInTheDocument();
    expect(screen.getByText('Select existing unique/curated enterprise catalog')).toBeInTheDocument();
    expect(screen.getByText(mockCatalogTitle)).toBeInTheDocument();
  });
});
