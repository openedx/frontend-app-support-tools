import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Hyperlink } from '@edx/paragon';

export default function CopyShowHyperlinks({ text }) {
  const [copyText, setCopyText] = useState('Copy');

  return (
    <div>
      <Hyperlink
        className="mr-1"
        destination=""
        target="_blank"
        onClick={(e) => {
          e.preventDefault();
          navigator.clipboard.writeText(text);
          // show temp check mark after copy
          setCopyText('Copy\u2713');
          setInterval(() => setCopyText('Copy'), 3000);
        }}
        showLaunchIcon={false}
      >
        {copyText}
      </Hyperlink>
      <Hyperlink
        destination=""
        target="_blank"
        onClick={(e) => {
          e.preventDefault();
          // eslint-disable-next-line no-alert
          alert(text);
        }}
        showLaunchIcon={false}
      >
        Show
      </Hyperlink>
    </div>
  );
}

CopyShowHyperlinks.propTypes = {
  text: PropTypes.string.isRequired,
};
