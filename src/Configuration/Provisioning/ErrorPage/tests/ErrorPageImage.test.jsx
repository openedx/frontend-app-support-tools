import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { screen } from '@testing-library/react';
import ErrorPageImage from '../ErrorPageImage';
import ErrorPage from '../../data/images/ErrorPage.svg';

describe('<ErrorPageImage />', () => {
  it('renders the image', () => {
    const imageAltText = 'Test Image Alt Text';
    renderWithRouter(
      <ErrorPageImage
        image={ErrorPage}
        imageAltText={imageAltText}
      />,
    );
    expect(screen.getByAltText(imageAltText)).toBeTruthy();
  });
});
