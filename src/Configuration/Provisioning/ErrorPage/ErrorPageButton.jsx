import { Button } from '@edx/paragon';
import PropTypes from 'prop-types';

const ErrorPageButton = ({
  as, to, className, children, onClick,
}) => (
  <Button
    as={as}
    to={to}
    className={className}
    onClick={onClick}
    variant="primary"
  >
    {children}
  </Button>
);

ErrorPageButton.propTypes = {
  as: PropTypes.oneOfType([PropTypes.node, PropTypes.shape({})]).isRequired,
  to: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
};

ErrorPageButton.defaultProps = {
  className: undefined,
  onClick: () => {},
};

export default ErrorPageButton;
