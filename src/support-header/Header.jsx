/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/anchor-has-content */
import React, { useContext } from 'react';
import Responsive from 'react-responsive';
import { AppContext } from '@edx/frontend-platform/react';
import {
  APP_CONFIG_INITIALIZED,
  ensureConfig,
  mergeConfig,
  getConfig,
  subscribe,
} from '@edx/frontend-platform';

import DesktopHeader from './DesktopHeader';
import MobileHeader from './MobileHeader';

import LogoSVG from './logo.svg';

ensureConfig([
  'LMS_BASE_URL',
  'LOGOUT_URL',
  'LOGIN_URL',
  'MARKETING_SITE_BASE_URL',
  'ORDER_HISTORY_URL',
], 'Header component');

subscribe(APP_CONFIG_INITIALIZED, () => {
  mergeConfig({
    MINIMAL_HEADER: !!process.env.MINIMAL_HEADER,
    PUBLISHER_BASE_URL: process.env.PUBLISHER_BASE_URL,
  }, 'Header additional config');
});

export default function Header() {
  const { authenticatedUser, config } = useContext(AppContext);

  const mainMenu = [
    {
      type: 'submenu',
      content: 'Updates',
      submenuContent: (
        <>
          <div className="mb-1"><a rel="noopener" href="https://docs.google.com/document/edit?hgd=1&id=17_FWEtnUXyeEMrj8Lu3kmXqopwHGUjKW2t61cek2ax0">Current Issues</a></div>
          <div className="mb-1"><a rel="noopener" href="https://sites.google.com/a/edx.org/edx-support/-recent-updates">Support Site Recent Updates</a></div>
        </>
      ),
    },
    {
      type: 'submenu',
      content: 'Escalations',
      submenuContent: (
        <>
          <div className="mb-1"><a rel="noopener" href="https://edx.lightning.force.com/lightning/o/Case/list?filterName=00B0L000005D8BgUAK">Salesforce</a></div>
          <div className="mb-1"><a rel="noopener" href="https://openedx.atlassian.net/servicedesk/customer/user/requests?page=1&status=open">CR Requests</a></div>
        </>
      ),
    },
    {
      type: 'submenu',
      content: 'Payment',
      submenuContent: (
        <>
          <div className="mb-1"><a rel="noopener" href={`${config.ECOMMERCE_BASE_URL}/dashboard/users/`}>Otto</a></div>
          <div className="mb-1"><a rel="noopener" href="https://ebc2.cybersource.com/ebc2/app/Home">Cybersource</a></div>
          <div className="mb-1"><a rel="noopener" href="https://www.paypal.com/mep/dashboard">Paypal</a></div>
          <div className="mb-1"><a rel="noopener" href={`${config.ECOMMERCE_BASE_URL}/enterprise/coupons/`}>Enterprise Coupons</a></div>
        </>
      ),
    },
    {
      type: 'submenu',
      content: 'Courses',
      submenuContent: (
        <>
          <div className="mb-1"><a rel="noopener" href={`${config.PUBLISHER_BASE_URL}`}>Publisher</a></div>
          <div className="mb-1"><a rel="noopener" href={`${config.DISCOVERY_API_BASE_URL}`}>Discovery</a></div>
          <div className="mb-1"><a rel="noopener" href="https://www.edx.org/course">Course Catalogue</a></div>
        </>
      ),
    },
    {
      type: 'item',
      content: 'Proctoring',
      href: 'https://courses-internal.edx.org/admin/edx_proctoring/proctoredexamsoftwaresecurereview/',
    },
    {
      type: 'submenu',
      content: 'Programs',
      submenuContent: (
        <>
          <div className="mb-1"><a rel="noopener" href={`${config.CREDENTIALS_BASE_URL}/records/`}>Learner Record</a></div>
          <div className="mb-1"><a rel="noopener" href={`${config.CREDENTIALS_BASE_URL}/admin/credentials/usercredential/`}>Credentials Search</a></div>
          <div className="mb-1"><a rel="noopener" href={`${config.DISCOVERY_API_BASE_URL}/admin/course_metadata/program/`}>Programs Discovery</a></div>
        </>
      ),
    },
  ];

  const dashboardMenuItem = {
    type: 'item',
    href: `${config.LMS_BASE_URL}/dashboard`,
    content: 'Dashboard',
  };

  const logoutMenuItem = {
    type: 'item',
    href: config.LOGOUT_URL,
    content: 'Logout',
  };

  let userMenu = authenticatedUser === null ? [] : [
    dashboardMenuItem,
    {
      type: 'item',
      href: `${config.LMS_BASE_URL}/u/${authenticatedUser.username}`,
      content: 'Profile',
    },
    {
      type: 'item',
      href: `${config.LMS_BASE_URL}/account/settings`,
      content: 'Account',
    },
    logoutMenuItem,
  ];

  if (getConfig().MINIMAL_HEADER && authenticatedUser !== null) {
    userMenu = [
      dashboardMenuItem,
      logoutMenuItem,
    ];
  }

  const loggedOutItems = [
    {
      type: 'item',
      href: config.LOGIN_URL,
      content: 'Login',
    },
  ];

  const props = {
    logo: LogoSVG,
    logoAltText: 'edX',
    siteName: 'edX',
    logoDestination: getConfig().MINIMAL_HEADER ? null : `${config.LMS_BASE_URL}/dashboard`,
    loggedIn: authenticatedUser !== null,
    username: authenticatedUser !== null ? authenticatedUser.username : null,
    avatar: authenticatedUser !== null ? authenticatedUser.avatar : null,
    mainMenu: getConfig().MINIMAL_HEADER ? [] : mainMenu,
    userMenu,
    loggedOutItems,
  };

  return (
    <>
      <Responsive maxWidth={768}>
        <MobileHeader {...props} />
      </Responsive>
      <Responsive minWidth={769}>
        <DesktopHeader {...props} />
      </Responsive>
    </>
  );
}
