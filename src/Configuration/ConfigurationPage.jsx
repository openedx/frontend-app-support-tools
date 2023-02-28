import {
  Container,
  Hyperlink,
  Stack,
} from '@edx/paragon';
import { v4 as uuidv4 } from 'uuid';
import ROUTES from '../data/constants/routes';
import { titleCase } from '../utils';
import CONFIGURATION_PAGE_TEXT from './data/constants';

/* Stand in component if user were to manually navigate to this page, no direct route here */
const ConfigurationPage = () => {
  const { CONFIGURATION: { SUB_DIRECTORY } } = ROUTES;
  return (
    <Container className="mt-3">
      <h1>{CONFIGURATION_PAGE_TEXT.HEADER}</h1>
      <Stack>
        {Object.keys(SUB_DIRECTORY).map((route) => (
          <Hyperlink destination={SUB_DIRECTORY[route].HOME} key={uuidv4()}>
            {titleCase(route)}
          </Hyperlink>
        ))}
      </Stack>
    </Container>
  );
};

export default ConfigurationPage;
