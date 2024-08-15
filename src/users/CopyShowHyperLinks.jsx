import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Hyperlink } from '@openedx/paragon';

export default function CopyShowHyperlinks({ text }) {
  const [copyText, setCopyText] = useState('Copy ');

  return (
    <>
      <Hyperlink
        destination=""
        showLaunchIcon={false}
        target="_blank"
        onClick={(e) => {
          e.preventDefault();
          navigator.clipboard.writeText(text);
          // show temp check mark after copy
          setCopyText('Copy\u2713');
          setInterval(() => setCopyText('Copy '), 3000);
        }}
      >
        {copyText}
      </Hyperlink>
      <Hyperlink
        destination=""
        showLaunchIcon={false}
        target="_blank"
        onClick={(e) => {
          e.preventDefault();
          // eslint-disable-next-line no-alert
          alert(text);
        }}
      >
        Show
      </Hyperlink>
    </>
  );
}

CopyShowHyperlinks.propTypes = {
  text: PropTypes.string.isRequired,
};
