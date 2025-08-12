import { ArrowDropDown, ArrowDropUpDown } from '@openedx/paragon/icons';
import { useIntl } from '@edx/frontend-platform/i18n';
import PropTypes from 'prop-types';

const SortableHeader = ({
  id,
  label,
  sortBy,
  setSortBy,
}) => {
  const intl = useIntl();
  const isSorted = sortBy[0]?.id === id;
  const isDesc = sortBy[0]?.desc;

  const handleClick = () => {
    setSortBy((prev) => {
      if (prev.length === 0 || prev[0].id !== id) {
        return [{ id, desc: false }]; // ascending
      }
      if (!prev[0].desc) {
        return [{ id, desc: true }]; // descending
      }
      return []; // unsorted
    });
  };

  let SortIcon = <ArrowDropUpDown data-testid={`sort-icon-${id}`} onClick={handleClick} />;
  if (isSorted) {
    if (isDesc) {
      SortIcon = <ArrowDropDown onClick={handleClick} style={{ transform: 'rotate(180deg)' }} />;
    } else {
      SortIcon = <ArrowDropDown data-testid={`ascending-sort-icon-${id}`} onClick={handleClick} />;
    }
  }

  return (
    <div
      style={{
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
      }}
    >
      {intl.formatMessage(label)}
      {SortIcon}
    </div>
  );
};

SortableHeader.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  sortBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  setSortBy: PropTypes.func.isRequired,
};

export default SortableHeader;
