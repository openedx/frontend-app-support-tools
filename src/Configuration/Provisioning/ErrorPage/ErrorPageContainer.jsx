import { Button, Container, Image } from '@edx/paragon';
import ErrorPage from '../data/images/ErrorPage.svg';
import ROUTES from '../../../data/constants/routes';
import { ERROR_PAGE_TEXT } from '../data/constants';

// TODO: Update routing to determine error page message based on error code
const ErrorPageContainer = () => {
  const { HOME } = ROUTES.CONFIGURATION.SUB_DIRECTORY.PROVISIONING;

  return (
    <Container
      size="md"
      className="mt-5 text-center"
    >
      <Image
        src={ErrorPage}
        fluid
        alt="Portable computer in need of a repair shop"
      />
      <div className="mt-4">
        <h1
          className="text-danger"
          style={{
            fontSize: '3.75rem',
            lineHeight: '4rem',
          }}
        >
          {ERROR_PAGE_TEXT.TITLE}&nbsp;
          <span className="text-primary">
            {ERROR_PAGE_TEXT.SPANNED_TITLE}
          </span>
        </h1>
      </div>
      <div className="mt-4">
        <p>
          Error 500: System Failure
          <p>
            {ERROR_PAGE_TEXT.SUB_TITLE}
          </p>
        </p>
      </div>
      <div className="mt-4">
        <Button
          variant="primary"
          as="a"
          href={HOME}
        >
          Return to Learner Credit Plans
        </Button>
      </div>
    </Container>
  );
};

export default ErrorPageContainer;
