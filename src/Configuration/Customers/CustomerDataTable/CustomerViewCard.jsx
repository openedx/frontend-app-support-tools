import {
  Button, Card, Hyperlink,
} from '@openedx/paragon';
import { getConfig } from '@edx/frontend-platform';

const CustomerViewCard = ({ header, title, subtext, button1, button2 }) => {
  const { ADMIN_PORTAL_BASE_URL } = getConfig();

  return (
    <Card>
      <Card.Section className="pb-0">
        <h6 className="mb-0">{header.toUpperCase()}</h6>
        <h3 className="mt-0">{title[0].toUpperCase() + title.substr(1).toLowerCase()}</h3>
      </Card.Section>
      <Card.Section className="pt-0 x-small text-gray-400">
        <div>{subtext}</div>
      </Card.Section>
      <Card.Footer>
        {button1 && <Button variant='tertiary'>{button1}</Button>}
        <Button>
          <Hyperlink
            destination={`${ADMIN_PORTAL_BASE_URL}/FAKE_SLUG/admin/learners`}
            key="SHOULD BE SLUG"
            rel="noopener noreferrer"
            target="_blank"
            className="text-white"
            showLaunchIcon
          >
            {button2}
          </Hyperlink>
        </Button>
      </Card.Footer>

    </Card>
  );
};

export default CustomerViewCard;

