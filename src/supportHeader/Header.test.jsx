import React from 'react';
import { mergeConfig } from '@edx/frontend-platform';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { render } from '@testing-library/react';
import { Context as ResponsiveContext } from 'react-responsive';
import { AppContext } from '@edx/frontend-platform/react';

import Header from './Header';

describe('<Header />', () => {
  const appContextValue = {
    authenticatedUser: {
      userId: '123',
      username: 'abc',
      name: 'full name',
    },
    config: {
      LMS_BASE_URL: process.env.LMS_BASE_URL,
      LOGO_URL: 'logo_url.jpg',
    },
  };

  it('renders correctly for authenticated desktop', () => {
    const component = (
      <ResponsiveContext.Provider value={{ width: 1200 }}>
        <IntlProvider locale="en">
          <AppContext.Provider value={appContextValue}>
            <Header />
          </AppContext.Provider>
        </IntlProvider>
      </ResponsiveContext.Provider>
    );

    const { container: wrapper } = render(component);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly for authenticated desktop when HIDE_USERNAME_FROM_HEADER is set to true', () => {
    mergeConfig({
      HIDE_USERNAME_FROM_HEADER: true,
    });

    const component = (
      <ResponsiveContext.Provider value={{ width: 1200 }}>
        <IntlProvider locale="en">
          <AppContext.Provider value={appContextValue}>
            <Header />
          </AppContext.Provider>
        </IntlProvider>
      </ResponsiveContext.Provider>
    );

    const { container: wrapper } = render(component);
    expect(wrapper).toMatchSnapshot();

    mergeConfig({
      HIDE_USERNAME_FROM_HEADER: '',
    });
  });

  it('renders correctly for authenticated mobile', () => {
    const component = (
      <ResponsiveContext.Provider value={{ width: 500 }}>
        <IntlProvider locale="en">
          <AppContext.Provider value={appContextValue}>
            <Header />
          </AppContext.Provider>
        </IntlProvider>
      </ResponsiveContext.Provider>
    );

    const { container: wrapper } = render(component);
    expect(wrapper).toMatchSnapshot();
  });
});
