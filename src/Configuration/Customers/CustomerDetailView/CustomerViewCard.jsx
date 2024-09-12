import {
  Button, Card, Hyperlink,
} from '@openedx/paragon';
import PropTypes from 'prop-types';

const CustomerViewCard = (
  {
    header, title, subtext, buttonText, buttonLink,
  },
) => (
  <Card className="mb-4">
    <Card.Section className="pb-0">
      <h6 className="mb-0">{header.toUpperCase()}</h6>
      <h3 className="mt-0 mb-0">{title}</h3>
    </Card.Section>
    <Card.Section className="pt-0 x-small text-gray-400">
      {subtext && <div>{subtext}</div>}
    </Card.Section>
    {buttonText && (
      <Card.Footer>
        <Button>
          <Hyperlink
            destination={buttonLink}
            rel="noopener noreferrer"
            target="_blank"
            className="text-white"
            showLaunchIcon
          >
            {buttonText}
          </Hyperlink>
        </Button>
      </Card.Footer>
    )}
    {!buttonText && (
      <p className="mb-5" />
    )}
  </Card>
);

CustomerViewCard.propTypes = {
  header: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtext: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  buttonLink: PropTypes.string.isRequired,
};

export default CustomerViewCard;
