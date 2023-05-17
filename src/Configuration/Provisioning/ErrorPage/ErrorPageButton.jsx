import { Button } from '@edx/paragon';
import PropTypes from 'prop-types';

const ErrorPageButton = ({ buttonInteraction, buttonText }) => (
  <div className="mt-4">
    <Button
      variant="primary"
      as="a"
      onClick={buttonInteraction}
    >
      {buttonText}
    </Button>
  </div>
);

ErrorPageButton.propTypes = {
  buttonInteraction: PropTypes.func.isRequired,
  buttonText: PropTypes.string.isRequired,
};

export default ErrorPageButton;
