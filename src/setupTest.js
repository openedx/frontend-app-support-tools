import 'babel-polyfill';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { act } from 'react-dom/test-utils';
import { initialize, mergeConfig } from '@edx/frontend-platform';
import { MockAuthService } from '@edx/frontend-platform/auth';

Enzyme.configure({ adapter: new Adapter() });

mergeConfig({
  LICENSE_MANAGER_URL: process.env.LICENSE_MANAGER_URL,
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

// eslint-disable-next-line import/prefer-default-export
export const waitForComponentToPaint = async (wrapper) => {
  await act(async () => {
    await new Promise((resolve) => { setTimeout(resolve); });
    wrapper.update();
  });
};

process.on('unhandledRejection', (reason, p) => {
  // eslint-disable-next-line no-console
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason.stack);
});
