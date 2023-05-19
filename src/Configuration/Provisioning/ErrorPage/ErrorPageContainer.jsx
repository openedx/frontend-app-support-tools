import { Container } from '@edx/paragon';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import ErrorPage from '../data/images/ErrorPage.svg';
import { ERROR_PAGE_TEXT } from '../data/constants';
import ErrorPageImage from './ErrorPageImage';
import ErrorPageMessage from './ErrorPageMessage';
import ErrorPageButton from './ErrorPageButton';

const ErrorPageContainer = ({ to }) => {
  const history = useHistory();
  const { location } = history;
  const { state: locationState } = location;
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (locationState?.errorMessage) {
      setErrorMessage(locationState.errorMessage);
    }
    const newState = { ...locationState };
    delete newState.errorMessage;
    history.replace({ ...location, state: newState });
  }, [locationState?.errorMessage]);

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
