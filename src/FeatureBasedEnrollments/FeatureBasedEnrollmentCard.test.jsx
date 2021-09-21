import { mount } from 'enzyme';
import React from 'react';
import FeatureBasedEnrollmentCard from './FeatureBasedEnrollmentCard';
import {
  fbeDurationConfigEnabled,
  fbeDurationConfigDisabled,
  fbeGatingConfigEnabled,
  fbeGatingConfigDisabled,
} from './data/test/featureBasedEnrollment';

describe('Feature Based Enrollment Card Component', () => {
  let wrapper;

  afterEach(() => {
    wrapper.unmount();
  });

  describe('Gating config', () => {
    const title = 'Gating Config';

    it('Gating config enabled', () => {
      wrapper = mount(<FeatureBasedEnrollmentCard title={title} fbeData={fbeGatingConfigEnabled} />);
      const header = wrapper.find('h3.card-title');
      const dataTable = wrapper.find('table.fbe-table tr');
      const dateRow = dataTable.at(0);
      const reasonRow = dataTable.at(1);

      expect(header.text()).toEqual('Gating Config Enabled');
      expect(dateRow.find('th').at(0).text()).toEqual('Enabled As Of');
      expect(dateRow.find('td').at(0).text()).toEqual('Jan 1, 2020 12:00 AM');

      expect(reasonRow.find('th').at(0).text()).toEqual('Reason');
      expect(reasonRow.find('td').at(0).text()).toEqual('Site');
    });

    it('Gating config disabled', () => {
      wrapper = mount(<FeatureBasedEnrollmentCard title={title} fbeData={fbeGatingConfigDisabled} />);
      const header = wrapper.find('h3.card-title');
      const dataTable = wrapper.find('table.fbe-table tr');
      const dateRow = dataTable.at(0);
      const reasonRow = dataTable.at(1);

      expect(header.text()).toEqual('Gating Config Disabled');
      expect(dateRow.find('th').at(0).text()).toEqual('Enabled As Of');
      expect(dateRow.find('td').at(0).text()).toEqual('N/A');

      expect(reasonRow.find('th').at(0).text()).toEqual('Reason');
      expect(reasonRow.find('td').at(0).text()).toEqual('');
    });
  });

  describe('Duration config', () => {
    const title = 'Duration Config';

    it('Duration config enabled', () => {
      wrapper = mount(<FeatureBasedEnrollmentCard title={title} fbeData={fbeDurationConfigEnabled} />);
      const header = wrapper.find('h3.card-title');
      const dataTable = wrapper.find('table.fbe-table tr');
      const dateRow = dataTable.at(0);
      const reasonRow = dataTable.at(1);

      expect(header.text()).toEqual('Duration Config Enabled');
      expect(dateRow.find('th').at(0).text()).toEqual('Enabled As Of');
      expect(dateRow.find('td').at(0).text()).toEqual('Feb 1, 2020 12:00 AM');

      expect(reasonRow.find('th').at(0).text()).toEqual('Reason');
      expect(reasonRow.find('td').at(0).text()).toEqual('Site Config');
    });

    it('Duration config disabled', () => {
      wrapper = mount(<FeatureBasedEnrollmentCard title={title} fbeData={fbeDurationConfigDisabled} />);
      const header = wrapper.find('h3.card-title');
      const dataTable = wrapper.find('table.fbe-table tr');
      const dateRow = dataTable.at(0);
      const reasonRow = dataTable.at(1);

      expect(header.text()).toEqual('Duration Config Disabled');
      expect(dateRow.find('th').at(0).text()).toEqual('Enabled As Of');
      expect(dateRow.find('td').at(0).text()).toEqual('N/A');

      expect(reasonRow.find('th').at(0).text()).toEqual('Reason');
      expect(reasonRow.find('td').at(0).text()).toEqual('');
    });
  });
});
