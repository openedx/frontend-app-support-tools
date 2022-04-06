import { mount } from 'enzyme';
import React from 'react';
import { camelCaseObject } from '@edx/frontend-platform';
import { waitForComponentToPaint } from '../../setupTest';
import Licenses from './Licenses';
import licensesData from '../data/test/licenses';
import * as api from '../data/api';

describe('Single Sign On Records', () => {
  let wrapper;
  const props = {
    userEmail: 'user@example.com',
  };

  beforeEach(async () => {
    jest.spyOn(api, 'getLicense').mockImplementationOnce(() => Promise.resolve(camelCaseObject(licensesData)));
    wrapper = mount(<Licenses {...props} />);
    await waitForComponentToPaint(wrapper);
  });

  it('Licenses props', () => {
    const userEmail = wrapper.prop('userEmail');
    expect(userEmail).toEqual(props.userEmail);
  });

  it('Licenses Data', () => {
    const cardList = wrapper.find('Card');
    expect(cardList).toHaveLength(licensesData.results.length);
    expect(wrapper.find('h3#licenses-title-header').text()).toEqual('Licenses Subscription');
  });

  it('No Licenses Data', async () => {
    jest.spyOn(api, 'getLicense').mockImplementationOnce(() => Promise.resolve({ ...licensesData, results: [], status: 'No records found.' }));
    wrapper = mount(<Licenses {...props} />);
    await waitForComponentToPaint(wrapper);

    expect(wrapper.find('h3#licenses-title-header').text()).toEqual('Licenses Subscription');
    const cardList = wrapper.find('Card');
    expect(cardList).toHaveLength(0);

    const noRecordMessage = wrapper.find('p');
    expect(noRecordMessage.text()).toEqual('No records found.');
  });
});
