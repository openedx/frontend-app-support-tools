import '@testing-library/jest-dom/extend-expect';
import { screen, render } from '@testing-library/react';
import PROVISIONING_PAGE_TEXT from '../../../data/constants';
import AssociatedCatalogDetail from '../AssociatedCatalogDetail';

const { FORM: { CATALOG } } = PROVISIONING_PAGE_TEXT;

const mockCatalogs = {
  [CATALOG.OPTIONS.openCourses]: '1234567890 - Open Courses Budget',
};

describe('AssociatedCatalog', () => {
  it('renders the component with only the catalog type and does not include uuid or budget word', () => {
    render(<AssociatedCatalogDetail associatedCatalog={mockCatalogs[CATALOG.OPTIONS.openCourses]} />);
    expect(screen.getByText('Catalog')).toBeInTheDocument();
    expect(screen.getByText('Associated Catalog')).toBeInTheDocument();
    expect(screen.getByText('Open Courses')).toBeInTheDocument();
    expect(screen.queryByText('1234567890')).toBeNull();
    expect(screen.queryByText('Budget')).toBeNull();
  });
});
