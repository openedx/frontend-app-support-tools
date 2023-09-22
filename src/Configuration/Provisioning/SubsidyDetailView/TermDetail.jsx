import PropTypes from 'prop-types';
import {
  Icon,
  IconButtonWithTooltip,
  Stack,
} from '@edx/paragon';
import { InfoOutline } from '@edx/paragon/icons';
import PROVISIONING_PAGE_TEXT from '../data/constants';
import dayjs from '../data/dayjs';

const TermDetail = ({ startDate, endDate }) => {
  const { FORM: { TERM } } = PROVISIONING_PAGE_TEXT;
  return (
    <article className="mt-4.5">
      <div className="mb-1">
        <Stack direction="horizontal" className="mb-1">
          <h3 className="mb-0 align-self-center">{TERM.TITLE}</h3>
          <IconButtonWithTooltip
            src={InfoOutline}
            size="sm"
            tooltipPlacement="right"
            tooltipContent={TERM.TOOLTIP}
            iconAs={Icon}
            invertColors
            isActive
            alt="Plan activation tooltip"
          />
        </Stack>
      </div>
      <div className="mb-1 ml-3 mt-3">
        <h4>{TERM.OPTIONS.startDate}</h4>
        <p className="small">
          {dayjs(startDate).utc().format('MMMM D, YYYY')}
        </p>
      </div>
      <div className="mb-1 ml-3 mt-3">
        <h4>{TERM.OPTIONS.endDate}</h4>
        <p className="small">
          {dayjs(endDate).utc().format('MMMM D, YYYY')}
        </p>
      </div>
    </article>
  );
};

TermDetail.propTypes = {
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
};

export default TermDetail;
