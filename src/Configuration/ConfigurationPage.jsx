import {
  Container,
  Hyperlink,
  Stack,
} from '@edx/paragon';
import ROUTES from '../data/constants/routes';
import { titleCase } from '../utils';

/* Stand in component if user were to manually navigate to this page, no direct route here */
const ConfigurationPage = () => {
  const { CONFIGURATION: { SUB_DIRECTORY } } = ROUTES;
  return (
    <Container className="mt-3">
      <h1>Configuration</h1>
      <Stack>
        {Object.keys(SUB_DIRECTORY).map((route) => (
          <Hyperlink destination={SUB_DIRECTORY[route]}>
            {titleCase(route)}
          </Hyperlink>
        ))}
      </Stack>
    </Container>
  );
};

export default ConfigurationPage;
