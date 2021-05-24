import { mount } from 'enzyme';
import React from 'react';

import { waitForComponentToPaint } from '../../setupTest';
import Certificates from './Certificates';
import { downloadableCertificate, regeneratableCertificate } from '../data/test/certificates';
import UserMessagesProvider from '../../userMessages/UserMessagesProvider';
import * as api from '../data/api';

const CertificateWrapper = (props) => (
  <UserMessagesProvider>
    <Certificates {...props} />;
  </UserMessagesProvider>
);

describe('Certificate component', () => {
  let apiMock; let wrapper;
  const testUser = 'testUser';
  const testCourseId = 'course-v1:testX+test123+2030';

  const props = {
    username: testUser,
    courseId: testCourseId,
    closeHandler: jest.fn(() => {}),
  };

  afterEach(() => {
    apiMock.mockRestore();
  });

  it('Downloadable Certificate', async () => {
    apiMock = jest.spyOn(api, 'getCertificate').mockImplementationOnce(() => Promise.resolve(downloadableCertificate));
    wrapper = mount(<CertificateWrapper {...props} />);
    await waitForComponentToPaint(wrapper);

    expect(wrapper.find('h2').html()).toEqual(expect.stringContaining(downloadableCertificate.courseKey));
    const dataRows = wrapper.find('table.table tbody tr');
    expect(dataRows.length).toEqual(6);

    // Explictly check each row and verify individual piece of data
    const certType = dataRows.at(0).find('td');
    expect(certType.at(0).text()).toEqual('Certificate Type');
    expect(certType.at(1).text()).toEqual('verified');

    const status = dataRows.at(1).find('td');
    expect(status.at(0).text()).toEqual('Status');
    expect(status.at(1).text()).toEqual('passing');

    const grade = dataRows.at(2).find('td');
    expect(grade.at(0).text()).toEqual('Grade');
    expect(grade.at(1).text()).toEqual('60');

    const lastUpdated = dataRows.at(3).find('td');
    expect(lastUpdated.at(0).text()).toEqual('Last Updated');
    expect(lastUpdated.at(1).text()).toEqual('Jan 1, 2020 12:00 AM');

    const downloadUrl = dataRows.at(4).find('td');
    expect(downloadUrl.at(0).text()).toEqual('Download URL');
    expect(downloadUrl.at(1).text()).toEqual('Download');
    expect(downloadUrl.at(1).find('a').prop('href')).toEqual('http://localhost:18000/certificates/1234-abcd');

    const action = dataRows.at(5).find('td');
    expect(action.at(0).text()).toEqual('Actions');
    expect(action.find('button#generate-certificate').length).toEqual(1);
  });

  it('Regeneratable Certificate', async () => {
    apiMock = jest.spyOn(api, 'getCertificate').mockImplementationOnce(() => Promise.resolve(regeneratableCertificate));
    wrapper = mount(<CertificateWrapper {...props} />);
    await waitForComponentToPaint(wrapper);

    expect(wrapper.find('h2').html()).toEqual(expect.stringContaining(regeneratableCertificate.courseKey));
    const dataRows = wrapper.find('table.table tbody tr');
    expect(dataRows.length).toEqual(6);

    const action = dataRows.at(5).find('td');
    const actionButton = action.find('button#regenerate-certificate');
    expect(action.at(0).text()).toEqual('Actions');
    expect(actionButton.text()).toEqual('Regenerate');
  });

  it('Missing Certificate Data', async () => {
    apiMock = jest.spyOn(api, 'getCertificate').mockImplementationOnce(() => Promise.resolve({ courseKey: testCourseId }));
    wrapper = mount(<CertificateWrapper {...props} />);
    await waitForComponentToPaint(wrapper);

    expect(wrapper.find('h2').html()).toEqual(expect.stringContaining(testCourseId));
    const dataRows = wrapper.find('table.table tbody tr');
    expect(dataRows.length).toEqual(6);

    expect(dataRows.at(0).find('td').at(1).text()).toEqual('Not Available');
    expect(dataRows.at(1).find('td').at(1).text()).toEqual('Not Available');
    expect(dataRows.at(2).find('td').at(1).text()).toEqual('Not Available');
    expect(dataRows.at(3).find('td').at(1).text()).toEqual('N/A');
    expect(dataRows.at(4).find('td').at(1).text()).toEqual('Not Available');
  });

  it('Certificate Fetch Errors', async () => {
    apiMock = jest.spyOn(api, 'getCertificate').mockImplementationOnce(() => Promise.resolve({
      errors: [
        {
          code: null,
          dismissible: true,
          text: 'No certificate found',
          type: 'danger',
          topic: 'certificates',
        },
      ],
    }));
    wrapper = mount(<CertificateWrapper {...props} />);
    await waitForComponentToPaint(wrapper);
    const alert = wrapper.find('.alert');
    expect(alert.text()).toEqual('No certificate found');
  });

  describe('Generate Certificates flow', () => {
    let generateApiMock;

    afterEach(() => {
      generateApiMock.mockRestore();
    });

    it('Successful certificate generation flow', async () => {
      generateApiMock = jest.spyOn(api, 'generateCertificate').mockImplementationOnce(() => Promise.resolve({}));
      apiMock = jest.spyOn(api, 'getCertificate').mockImplementation(() => Promise.resolve(downloadableCertificate));

      wrapper = mount(<CertificateWrapper {...props} />);
      await waitForComponentToPaint(wrapper);

      let generateButton = wrapper.find('button#generate-certificate');
      expect(generateButton.text()).toEqual('Generate');
      expect(generateButton.prop('disabled')).toBeFalsy();

      generateButton.simulate('click');
      generateButton = wrapper.find('button#generate-certificate');

      expect(generateButton.prop('disabled')).toBeTruthy();
      expect(generateApiMock).toHaveBeenCalledTimes(1);
      expect(wrapper.find('h3').text()).toEqual('Status: Generating New Certificate ');

      // Once the generation api call is successful, the status text and button will revert.
      await waitForComponentToPaint(wrapper);
      generateButton = wrapper.find('button#generate-certificate');
      expect(wrapper.find('h3').length).toEqual(0);
      expect(generateButton.prop('disabled')).toBeFalsy();
    });

    it('Unsuccessful certificate generation flow', async () => {
      generateApiMock = jest.spyOn(api, 'generateCertificate').mockImplementationOnce(() => Promise.resolve({
        errors: [
          {
            code: null,
            dismissible: true,
            text: 'Error generating certificate',
            type: 'danger',
            topic: 'certificates',
          },
        ],
      }));
      apiMock = jest.spyOn(api, 'getCertificate').mockImplementation(() => Promise.resolve(downloadableCertificate));

      wrapper = mount(<CertificateWrapper {...props} />);
      await waitForComponentToPaint(wrapper);

      const generateButton = wrapper.find('button#generate-certificate');
      expect(generateButton.text()).toEqual('Generate');
      expect(generateButton.prop('disabled')).toBeFalsy();
      generateButton.simulate('click');
      expect(generateApiMock).toHaveBeenCalledTimes(1);

      await waitForComponentToPaint(wrapper);
      const alert = wrapper.find('.alert');
      expect(alert.text()).toEqual('Error generating certificate');
    });
  });

  describe('Regenerate Certificates flow', () => {
    let regenerateApiMock;

    afterEach(() => {
      regenerateApiMock.mockRestore();
    });

    it('Successful certificate regeneration flow', async () => {
      regenerateApiMock = jest.spyOn(api, 'regenerateCertificate').mockImplementationOnce(() => Promise.resolve({}));
      apiMock = jest.spyOn(api, 'getCertificate').mockImplementation(() => Promise.resolve(regeneratableCertificate));

      wrapper = mount(<CertificateWrapper {...props} />);
      await waitForComponentToPaint(wrapper);

      let regenerateButton = wrapper.find('button#regenerate-certificate');
      expect(regenerateButton.text()).toEqual('Regenerate');
      expect(regenerateButton.prop('disabled')).toBeFalsy();

      regenerateButton.simulate('click');
      regenerateButton = wrapper.find('button#regenerate-certificate');

      expect(regenerateButton.prop('disabled')).toBeTruthy();
      expect(regenerateApiMock).toHaveBeenCalledTimes(1);
      expect(wrapper.find('h3').text()).toEqual('Status: Regenerating Certificate ');

      await waitForComponentToPaint(wrapper);
      regenerateButton = wrapper.find('button#regenerate-certificate');
      expect(wrapper.find('h3').length).toEqual(0);
      expect(regenerateButton.prop('disabled')).toBeFalsy();
    });

    it('Unsuccessful certificate regeneration flow', async () => {
      regenerateApiMock = jest.spyOn(api, 'regenerateCertificate').mockImplementationOnce(() => Promise.resolve({
        errors: [
          {
            code: null,
            dismissible: true,
            text: 'Error regenerating certificate',
            type: 'danger',
            topic: 'certificates',
          },
        ],
      }));
      apiMock = jest.spyOn(api, 'getCertificate').mockImplementation(() => Promise.resolve(regeneratableCertificate));

      wrapper = mount(<CertificateWrapper {...props} />);
      await waitForComponentToPaint(wrapper);

      const regenerateButton = wrapper.find('button#regenerate-certificate');
      expect(regenerateButton.text()).toEqual('Regenerate');
      expect(regenerateButton.prop('disabled')).toBeFalsy();

      regenerateButton.simulate('click');
      expect(regenerateApiMock).toHaveBeenCalledTimes(1);

      await waitForComponentToPaint(wrapper);
      const alert = wrapper.find('.alert');
      expect(alert.text()).toEqual('Error regenerating certificate');
    });
  });
});
