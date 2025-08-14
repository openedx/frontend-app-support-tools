import { useState, useRef, useEffect } from 'react';
import { Form, Icon, Button } from '@openedx/paragon';
import { ArrowDropDown, Check, Search } from '@openedx/paragon/icons';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';

import messages from './messages';

const OrgDropdownWithSearch = ({ org, setOrg, orgFilterChoices }) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const dropdownRef = useRef();

  const filteredChoices = orgFilterChoices.filter((choice) => choice.name.toLowerCase()
    .includes(searchValue.toLowerCase()));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }} className="ml-2">
      <Button
        variant="outline-primary"
        className="w-100 text-start d-flex justify-content-between align-items-center"
        onClick={() => setIsOpen((prev) => !prev)}
        data-testid="org-dropdown-toggle"
      >
        <span
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            marginRight: 8,
          }}
        >
          {org
            ? orgFilterChoices.find((c) => c.value === org)?.name
            : intl.formatMessage(messages.allOrgsFilterLabel)}
        </span>
        <Icon src={ArrowDropDown} />
      </Button>

      {isOpen && (
        <div
          className="border rounded-sm bg-white"
          style={{
            position: 'absolute',
            top: '50px',
            zIndex: 1000,
            width: '250%',
            maxHeight: 250,
            overflowY: 'auto',
          }}
        >
          <Form.Control
            type="text"
            placeholder={intl.formatMessage(messages.searchPlaceholder)}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="m-2"
            leadingElement={<Icon src={Search} />}
          />

          <div>
            {filteredChoices.length > 0 && (
              <div
                className="dropdown-item d-flex justify-content-between align-items-center"
                onClick={() => {
                  setOrg('');
                  setIsOpen(false);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setOrg('');
                    setIsOpen(false);
                  }
                }}
                data-testid="org-dropdown-option-all"
              >
                {intl.formatMessage(messages.allOrgsFilterDropdownLabel)}
                {org === '' && <Icon src={Check} className="float-end" size="sm" />}
              </div>
            )}
            {filteredChoices.map((choice) => (
              <div
                key={choice.value}
                className="dropdown-item d-flex justify-content-between align-items-center"
                onClick={() => {
                  setOrg(choice.value);
                  setIsOpen(false);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setOrg('');
                    setIsOpen(false);
                  }
                }}
                data-testid={`org-dropdown-option-${choice.value}`}
              >
                {choice.name}
                {org === choice.value && <Icon src={Check} className="float-end" size="sm" />}
              </div>
            ))}
            {filteredChoices.length === 0 && (
              <div className="dropdown-item d-flex justify-content-center mb-2 py-2">
                {intl.formatMessage(messages.noOrgFoundOrgsFilterDropdownLabel)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrgDropdownWithSearch;

OrgDropdownWithSearch.propTypes = {
  org: PropTypes.string.isRequired,
  setOrg: PropTypes.func.isRequired,
  orgFilterChoices: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
};
