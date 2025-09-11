import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { HelmetProvider } from 'react-helmet-async';
import { getConfig } from '@edx/frontend-platform';
import Head from './Head';

describe('<Head />', () => {
  const props = {};

  it('should render title tag and favicon with site configuration values', async () => {
    render(
      <HelmetProvider>
        <IntlProvider locale="en">
          <Head {...props} />
        </IntlProvider>
      </HelmetProvider>,
    );

    // Wait for <title> to be updated
    await waitFor(() => {
      expect(document.title).toEqual(`Support Tools | ${getConfig().SITE_NAME}`);
    });

    // Check <link rel="shortcut icon">
    const linkTags = document.head.querySelectorAll('link[rel="shortcut icon"]');
    expect(linkTags.length).toBeGreaterThan(0);
    expect(linkTags[0].getAttribute('href')).toEqual(getConfig().FAVICON_URL);
  });
});
