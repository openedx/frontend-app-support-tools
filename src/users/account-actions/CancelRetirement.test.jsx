import { mount } from 'enzyme';
import React from 'react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import * as api from '../data/api';
import CancelRetirement from './CancelRetirement';
import { waitForComponentToPaint } from '../../setupTest';

const CancelRetirementWrapper = (props) => (
  <IntlProvider locale="en">
    <CancelRetirement {...props} />
  </IntlProvider>
);

describe('Cancel Retirement Component Tests', () => {
  let wrapper;
  const changeHandler = jest.fn(() => { });

  beforeEach(() => {
    const data = {
      retirement_id: 1,
      changeHandler,
    };
    wrapper = mount(<CancelRetirementWrapper {...data} />);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('Cancel Retirement button for a User', () => {
    const cancelRetirementButton = wrapper.find('#cancel-retirement').hostNodes();
    expect(cancelRetirementButton.text()).toEqual('Cancel Retirement');
  });

  it('Cancel Retirement Modal', async () => {
    const mockApiCall = jest.spyOn(api, 'postCancelRetirement').mockImplementationOnce(() => Promise.resolve({}));
    const cancelRetirementButton = wrapper.find('#cancel-retirement').hostNodes();
    let cancelRetirementModal = wrapper.find('ModalDialog#user-account-cancel-retirement');

    expect(cancelRetirementModal.prop('isOpen')).toEqual(false);
    expect(cancelRetirementButton.text()).toEqual('Cancel Retirement');

    cancelRetirementButton.simulate('click');
    cancelRetirementModal = wrapper.find('ModalDialog#user-account-cancel-retirement');

    expect(cancelRetirementModal.prop('isOpen')).toEqual(true);
    expect(cancelRetirementModal.find('h2.pgn__modal-title').text()).toEqual('Cancel Retirement');
    const confirmAlert = cancelRetirementModal.find('.alert-warning');
    expect(confirmAlert.text()).toEqual('This will cancel retirement for the requested user. Do you wish to proceed?');

    cancelRetirementModal.find('button.btn-danger').hostNodes().simulate('click');
    await waitForComponentToPaint(wrapper);
    expect(changeHandler).toHaveBeenCalled();
    cancelRetirementModal.find('button.btn-link').simulate('click');
    cancelRetirementModal = wrapper.find('ModalDialog#user-account-cancel-retirement');
    expect(cancelRetirementModal.prop('isOpen')).toEqual(false);

    mockApiCall.mockRestore();
  });

  it('Display Error on Cancel RetirementModal', async () => {
    const cancelRetirementErrors = {
      errors: [
        {
          code: null,
          dismissible: true,
          text: 'Retirement does not exist!',
          type: 'error',
          topic: 'cancelRetirement',
        },
      ],
    };
    const mockApiCall = jest.spyOn(api, 'postCancelRetirement').mockImplementationOnce(() => Promise.resolve(cancelRetirementErrors));
    const cancelRetirementButton = wrapper.find('#cancel-retirement').hostNodes();
    cancelRetirementButton.simulate('click');
    let cancelRetirementModal = wrapper.find('ModalDialog#user-account-cancel-retirement');
    expect(cancelRetirementModal.prop('isOpen')).toEqual(true);
    const confirmAlert = cancelRetirementModal.find('.alert-warning');
    expect(confirmAlert.text()).toEqual(
      'This will cancel retirement for the requested user. Do you wish to proceed?',
    );

    cancelRetirementModal.find('button.btn-danger').hostNodes().simulate('click');
    await waitForComponentToPaint(wrapper);
    cancelRetirementModal = wrapper.find('ModalDialog#user-account-cancel-retirement');
    const errorAlert = cancelRetirementModal.find('.alert-danger');
    expect(errorAlert.text()).toEqual('Retirement does not exist!');

    cancelRetirementModal.find('button.btn-link').simulate('click');
    cancelRetirementModal = wrapper.find('ModalDialog#user-account-cancel-retirement');
    expect(cancelRetirementModal.prop('isOpen')).toEqual(false);
    mockApiCall.mockRestore();
  });

  it('Display Unknown Error on Cancel Retirement Modal', async () => {
    const cancelRetirementErrors = {
      errors: [
        {
          code: null,
          dismissible: true,
          text: null,
          type: 'error',
          topic: 'cancelRetirement',
        },
      ],
    };
    const mockApiCall = jest.spyOn(api, 'postCancelRetirement').mockImplementationOnce(() => Promise.resolve(cancelRetirementErrors));
    const cancelRetirementButton = wrapper.find('#cancel-retirement').hostNodes();
    cancelRetirementButton.simulate('click');
    let cancelRetirementModal = wrapper.find('ModalDialog#user-account-cancel-retirement');
    cancelRetirementModal.find('button.btn-danger').hostNodes().simulate('click');
    await waitForComponentToPaint(wrapper);
    cancelRetirementModal = wrapper.find('ModalDialog#user-account-cancel-retirement');
    const errorAlert = cancelRetirementModal.find('.alert-danger');
    expect(errorAlert.text()).toEqual(
      'Something went wrong. Please try again later!',
    );
    mockApiCall.mockRestore();
  });
});
