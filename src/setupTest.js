import 'babel-polyfill';
import { initialize, mergeConfig } from '@edx/frontend-platform';
import { MockAuthService } from '@edx/frontend-platform/auth';

mergeConfig({
  COMMERCE_COORDINATOR_ORDER_DETAILS_URL: process.env.COMMERCE_COORDINATOR_ORDER_DETAILS_URL || null,
  LICENSE_MANAGER_URL: process.env.LICENSE_MANAGER_URL,
  PREDEFINED_CATALOG_QUERIES: {
    everything: 1,
    open_courses: 2,
    executive_education: 3,
  },
});

initialize({
  handlers: {
    config: () => {
      mergeConfig({
        authenticatedUser: {
          userId: 'abc123',
          username: 'Mock User',
          roles: [],
          administrator: false,
        },
      });
    },
  },
  messages: [],
  authService: MockAuthService,
});

process.on('unhandledRejection', (reason, p) => {
  // eslint-disable-next-line no-console
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason.stack);
});

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
