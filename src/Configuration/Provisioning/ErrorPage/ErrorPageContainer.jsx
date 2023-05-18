import { Container } from '@edx/paragon';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import ErrorPage from '../data/images/ErrorPage.svg';
import ROUTES from '../../../data/constants/routes';
import { ERROR_PAGE_TEXT } from '../data/constants';
import ErrorPageImage from './ErrorPageImage';
import ErrorPageMessage from './ErrorPageMessage';
import ErrorPageButton from './ErrorPageButton';

const ErrorPageContainer = () => {
  const { HOME } = ROUTES.CONFIGURATION.SUB_DIRECTORY.PROVISIONING;
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
  }, [locationState.errorMessage]);

  // Went with this implementation to allow for future expansion of error page
  const handleOnClick = () => {
    history.push(HOME);
  };

  return (
    <Container size="md" className="mt-5 text-center">
      <ErrorPageImage image={ErrorPage} imageAltText="Portable computer in need of a repair shop" />
      <ErrorPageMessage message={errorMessage} />
      <ErrorPageButton buttonInteraction={handleOnClick} buttonText={ERROR_PAGE_TEXT.BUTTON} />
    </Container>
  );
};

export default ErrorPageContainer;
