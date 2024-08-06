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
import ROUTES from '../data/constants/routes';

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
    SUPPORT_CONFLUENCE: process.env.SUPPORT_CONFLUENCE,
    SUPPORT_CUSTOMER_REQUEST: process.env.SUPPORT_CUSTOMER_REQUEST,
  }, 'Header additional config');
});

export default function Header() {
  const { authenticatedUser, config } = useContext(AppContext);
  let COURSES_INTERNAL = config.LMS_BASE_URL;
  let DISCOVERY_INTERNAL = config.DISCOVERY_API_BASE_URL;
  let CREDENTIALS_INTERNAL = config.CREDENTIALS_BASE_URL;
  const { SUPPORT_CONFLUENCE, SUPPORT_CUSTOMER_REQUEST } = config;
  const { CONFIGURATION } = ROUTES;

  if (config.LMS_BASE_URL.indexOf('.stage.') !== -1) {
    COURSES_INTERNAL = COURSES_INTERNAL.replace('.stage.', '-internal.stage.');
    DISCOVERY_INTERNAL = DISCOVERY_INTERNAL.replace('.stage.', '-internal.stage.');
    CREDENTIALS_INTERNAL = CREDENTIALS_INTERNAL.replace('.stage.', '-internal.stage.');
  } else if (config.LMS_BASE_URL.indexOf('.edx.') !== -1) {
    COURSES_INTERNAL = COURSES_INTERNAL.replace('.edx.', '-internal.edx.');
    DISCOVERY_INTERNAL = DISCOVERY_INTERNAL.replace('.edx.', '-internal.edx.');
    CREDENTIALS_INTERNAL = CREDENTIALS_INTERNAL.replace('.edx.', '-internal.edx.');
  }
  const mainMenu = [
    {
      type: 'item',
      content: 'Confluence',
      href: SUPPORT_CONFLUENCE,
    },
    {
      type: 'item',
      content: 'Support Tools',
      href: `${config.BASE_URL}`,
    },
    {
      type: 'submenu',
      content: 'Escalations',
      submenuContent: (
        <>
          <div className="mb-1"><a rel="noopener" href="https://edx.lightning.force.com/lightning/o/Case/list?filterName=00B0L000005D8BgUAK">Salesforce</a></div>
          <div className="mb-1"><a rel="noopener" href={SUPPORT_CUSTOMER_REQUEST}>CR Requests</a></div>
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
          <div className="mb-1"><a rel="noopener" href={`${config.LMS_BASE_URL}/courses`}>Course Catalogue</a></div>
        </>
      ),
    },
    {
      type: 'item',
      content: 'Proctoring',
      href: `${COURSES_INTERNAL}/admin/edx_proctoring/proctoredexamsoftwaresecurereview/`,
    },
    {
      type: 'submenu',
      content: 'Programs',
      submenuContent: (
        <>
          <div className="mb-1"><a rel="noopener" href={`${config.CREDENTIALS_BASE_URL}/records/`}>Learner Record</a></div>
          <div className="mb-1"><a rel="noopener" href={`${CREDENTIALS_INTERNAL}/admin/credentials/usercredential/`}>Credentials Search</a></div>
          <div className="mb-1"><a rel="noopener" href={`${DISCOVERY_INTERNAL}/admin/course_metadata/program/`}>Programs Discovery</a></div>
        </>
      ),
    },
  ];
  /* Start Configuration Management */
  // Add configuration dropdown if FEATURE_CONFIGURATION_MANAGEMENT is set
  const configurationDropdown = {
    type: 'submenu',
    content: 'Enterprise Setup',
    submenuContent: (
      <>
        {getConfig().FEATURE_CUSTOMER_SUPPORT_VIEW === 'true' ? (
          <div className="mb-1"><a rel="noopener" href={`${config.BASE_URL}${CONFIGURATION.SUB_DIRECTORY.CUSTOMERS.HOME}`}>Customers</a></div>) : null}
        {getConfig().FEATURE_CONFIGURATION_ENTERPRISE_PROVISION === 'true' ? (
          <div className="mb-1"><a rel="noopener" href={`${config.BASE_URL}${CONFIGURATION.SUB_DIRECTORY.PROVISIONING.HOME}`}>Learner Credit Plans</a></div>) : null}
      </>
    ),
  };
  if (getConfig().FEATURE_CONFIGURATION_MANAGEMENT) {
    mainMenu.push(configurationDropdown);
  }
  /* End Configuration Management */

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
    logo: config.LOGO_URL,
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
