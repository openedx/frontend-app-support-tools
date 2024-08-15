import { Container } from '@openedx/paragon';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import ErrorPage from './data/images/ErrorPage.svg';
import ErrorPageImage from './ErrorPageImage';
import ErrorPageMessage from './ErrorPageMessage';
import ErrorPageButton from './ErrorPageButton';
import { ERROR_PAGE_TEXT } from './data/constants';

const ErrorPageContainer = ({ to }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state: locationState } = location;
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (locationState?.errorMessage) {
      setErrorMessage(locationState.errorMessage);
    }
    const newState = { ...locationState };
    delete newState.errorMessage;
    navigate({ ...location, state: newState, replace: true });
  }, [location, locationState, navigate]);

  return (
    <Container size="md" className="mt-5 text-center">
      <ErrorPageImage image={ErrorPage} />
      <ErrorPageMessage message={errorMessage} />
      <ErrorPageButton
        as={Link}
        to={to}
        className="mt-4"
      >
        {ERROR_PAGE_TEXT.BUTTON}
      </ErrorPageButton>
    </Container>
  );
};

ErrorPageContainer.propTypes = {
  to: PropTypes.string.isRequired,
};

export default ErrorPageContainer;
