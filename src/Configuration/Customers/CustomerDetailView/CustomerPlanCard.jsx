import {
  Button, Card, Hyperlink,
} from '@openedx/paragon';
import { getConfig } from '@edx/frontend-platform';
import { useParams } from 'react-router-dom';

const CustomerPlanCard = ({ enterpriseCustomer }) => {
  const { ADMIN_PORTAL_BASE_URL } = getConfig();
  const { id } = useParams();
  console.log(id)
  return (
    <>
      <h2>Associated subsidy plans</h2>
      <Card>
        <Card.Section className="pb-0">
          <h6 className="mb-0">{enterpriseCustomer.name}</h6>
          <h3 className="mt-0">{enterpriseCustomer.name}</h3>
        </Card.Section>
        <Card.Section className="pt-0 x-small text-gray-400">
          <div>hi</div>
        </Card.Section>
        <Card.Footer>
          <Button>
            <Hyperlink
              destination={`${ADMIN_PORTAL_BASE_URL}/FAKE_SLUG/admin/learners`}
              key="SHOULD BE SLUG"
              rel="noopener noreferrer"
              target="_blank"
              className="text-white"
              showLaunchIcon
            >
            </Hyperlink>
          </Button>
        </Card.Footer>

      </Card>
    </>

  );
};

export default CustomerPlanCard;