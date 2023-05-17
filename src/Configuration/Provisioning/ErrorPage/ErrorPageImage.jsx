import { Image } from '@edx/paragon';
import PropTypes from 'prop-types';

const ErrorPageImage = ({ image }) => (
  <Image
    src={image}
    fluid
    alt="Portable computer in need of a repair shop"
  />
);

ErrorPageImage.propTypes = {
  image: PropTypes.string.isRequired,
};

export default ErrorPageImage;
