import { Image } from '@edx/paragon';
import PropTypes from 'prop-types';

const ErrorPageImage = ({ image, imageAltText }) => (
  <Image
    src={image}
    alt={imageAltText}
    fluid
  />
);

ErrorPageImage.propTypes = {
  image: PropTypes.string.isRequired,
  imageAltText: PropTypes.string.isRequired,
};

export default ErrorPageImage;
