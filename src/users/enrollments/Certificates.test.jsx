import { mount } from 'enzyme';
import React from 'react';
import { waitFor } from '@testing-library/react';
import { getConfig } from '@edx/frontend-platform';

import Certificates from './Certificates';
import { downloadableCertificate, pdfCertificate, regeneratableCertificate } from '../data/test/certificates';
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
    closeHandler: jest.fn(() => { }),
  };

  afterEach(() => {
    apiMock.mockRestore();
  });

  it('Default component render with Modal', async () => {
    apiMock = jest.spyOn(api, 'getCertificate').mockImplementationOnce(() => Promise.resolve(downloadableCertificate));
    wrapper = mount(<CertificateWrapper {...props} />);

    const dataRows = wrapper.find('table.certificate-info-table tbody tr');
    waitFor(() => expect(dataRows.length).toEqual(7));

    let certificateModal = wrapper.find('ModalDialog#certificate');
    expect(certificateModal.prop('isOpen')).toEqual(true);
    wrapper.find('button.btn-link').simulate('click');
    certificateModal = wrapper.find('ModalDialog#certificate');
    expect(certificateModal.prop('isOpen')).toEqual(false);
  });

  it('Downloadable Certificate', async () => {
    apiMock = jest.spyOn(api, 'getCertificate').mockImplementationOnce(() => Promise.resolve(downloadableCertificate));
    wrapper = mount(<CertificateWrapper {...props} />);

    const dataRows = wrapper.find('table.certificate-info-table tbody tr');
    waitFor(() => {
      expect(dataRows.length).toEqual(7);

      // Explictly check each row and verify individual piece of data
      const courseId = dataRows.at(0);
      expect(courseId.find('th').text()).toEqual('Course ID');
      expect(courseId.find('td').text()).toEqual(testCourseId);

      // Explictly check each row and verify individual piece of data
      const certType = dataRows.at(1);
      expect(certType.find('th').text()).toEqual('Certificate Type');
      expect(certType.find('td').text()).toEqual('verified');

      const status = dataRows.at(2);
      expect(status.find('th').text()).toEqual('Status');
      expect(status.find('td').text()).toEqual('passing');

      const grade = dataRows.at(3);
      expect(grade.find('th').text()).toEqual('Grade');
      expect(grade.find('td').text()).toEqual('60');

      const lastUpdated = dataRows.at(4);
      expect(lastUpdated.find('th').text()).toEqual('Last Updated');
      expect(lastUpdated.find('td').text()).toEqual('Jan 1, 2020 12:00 AM');

      const downloadUrl = dataRows.at(5);
      expect(downloadUrl.find('th').text()).toEqual('Download URL');
      expect(downloadUrl.find('td').text()).toEqual('Download');
      expect(downloadUrl.find('td').find('a').prop('href')).toEqual('http://localhost:18000/certificates/1234-abcd');

      const action = dataRows.at(6);
      expect(action.find('th').text()).toEqual('Actions');
      expect(action.find('button#generate-certificate').length).toEqual(1);
    });
  });

  it('Regeneratable Certificate', async () => {
    apiMock = jest.spyOn(api, 'getCertificate').mockImplementationOnce(() => Promise.resolve(regeneratableCertificate));
    wrapper = mount(<CertificateWrapper {...props} />);

    const dataRows = wrapper.find('table.certificate-info-table tbody tr');
    waitFor(() => {
      expect(dataRows.length).toEqual(7);

      expect(dataRows.at(0).html()).toEqual(expect.stringContaining(regeneratableCertificate.courseKey));

      const action = dataRows.at(6);
      const actionButton = action.find('button#regenerate-certificate');
      expect(action.find('th').text()).toEqual('Actions');
      expect(actionButton.text()).toEqual('Regenerate');
    });
  });

  it('Pdf Certificate', async () => {
    apiMock = jest.spyOn(api, 'getCertificate').mockImplementationOnce(() => Promise.resolve(pdfCertificate));
    wrapper = mount(<CertificateWrapper {...props} />);

    const dataRows = wrapper.find('table.certificate-info-table tbody tr');
    waitFor(() => {
      expect(dataRows.length).toEqual(7);

      expect(dataRows.at(0).html()).toEqual(expect.stringContaining(pdfCertificate.courseKey));

      const downloadUrl = dataRows.at(5);
      expect(downloadUrl.find('th').text()).toEqual('Download URL');
      expect(downloadUrl.find('td').text()).toEqual('Download');

      // Pdf certificate's download link does not have LMS base url
      const downloadLink = downloadUrl.find('td').find('a').prop('href');
      expect(downloadLink).not.toEqual(expect.stringContaining(`${getConfig().LMS_BASE_URL}`));
      expect(downloadLink).toEqual('https://www.example.com');
    });
  });

  it('Missing Certificate Data', async () => {
    apiMock = jest.spyOn(api, 'getCertificate').mockImplementationOnce(() => Promise.resolve({ courseKey: testCourseId }));
    wrapper = mount(<CertificateWrapper {...props} />);

    const dataRows = wrapper.find('table.certificate-info-table tbody tr');

    waitFor(() => {
      expect(dataRows.length).toEqual(7);
      expect(dataRows.at(0).html()).toEqual(expect.stringContaining(regeneratableCertificate.courseKey));
      expect(dataRows.at(1).find('td').text()).toEqual('Not Available');
      expect(dataRows.at(2).find('td').text()).toEqual('Not Available');
      expect(dataRows.at(3).find('td').text()).toEqual('Not Available');
      expect(dataRows.at(4).find('td').text()).toEqual('N/A');
      expect(dataRows.at(5).find('td').text()).toEqual('Not Available');
    });
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
    const alert = wrapper.find('.alert');
    waitFor(() => expect(alert.text()).toEqual('No certificate found'));
  });

  describe('Generate Certificates flow', () => {
    let generateApiMock;

    afterEach(() => {
      generateApiMock.mockRestore();
    });

    it('Successful certificate generation flow', async () => {
      generateApiMock = jest.spyOn(api, 'generateCertificate').mockImplementationOnce(() => Promise.resolve({}));
      apiMock = jest.spyOn(api, 'getCertificate').mockImplementationOnce(() => Promise.resolve(downloadableCertificate));
      // 2nd call to get certificate after generation would yield regenerate certificate data.
      jest.spyOn(api, 'getCertificate').mockImplementationOnce(() => Promise.resolve(regeneratableCertificate));

      wrapper = mount(<CertificateWrapper {...props} />);

      let generateButton = wrapper.find('button#generate-certificate');
      waitFor(() => {
        expect(generateButton.text()).toEqual('Generate');
        expect(generateButton.prop('disabled')).toBeFalsy();

        generateButton.simulate('click');
        generateButton = wrapper.find('button#generate-certificate');

        expect(generateButton.prop('disabled')).toBeTruthy();
        expect(generateApiMock).toHaveBeenCalledTimes(1);
        expect(wrapper.find('div.alert-info').text()).toEqual('Generating New Certificate');

        // Once the generation api call is successful, the status text will revert
        // and button will change into regenerate button.
        const regenerateButton = wrapper.find('button#regenerate-certificate');
        expect(wrapper.find('h3').length).toEqual(0);
        expect(regenerateButton.text()).toEqual('Regenerate');
        expect(regenerateButton.prop('disabled')).toBeFalsy();
        expect(apiMock).toHaveBeenCalledTimes(2);
      });
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

      const generateButton = wrapper.find('button#generate-certificate');
      waitFor(() => {
        expect(generateButton.text()).toEqual('Generate');
        expect(generateButton.prop('disabled')).toBeFalsy();
        generateButton.simulate('click');
        expect(generateApiMock).toHaveBeenCalledTimes(1);

        const alert = wrapper.find('.alert');
        expect(alert.text()).toEqual('Error generating certificate');
      });
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

      let regenerateButton = wrapper.find('button#regenerate-certificate');
      waitFor(() => {
        expect(regenerateButton.text()).toEqual('Regenerate');
        expect(regenerateButton.prop('disabled')).toBeFalsy();

        regenerateButton.simulate('click');
        regenerateButton = wrapper.find('button#regenerate-certificate');

        expect(regenerateButton.prop('disabled')).toBeTruthy();
        expect(regenerateApiMock).toHaveBeenCalledTimes(1);
        expect(wrapper.find('div.alert-info').text()).toEqual('Regenerating Certificate');

        regenerateButton = wrapper.find('button#regenerate-certificate');
        expect(wrapper.find('h3').length).toEqual(0);
        expect(regenerateButton.prop('disabled')).toBeFalsy();
      });
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

      const regenerateButton = wrapper.find('button#regenerate-certificate');
      waitFor(() => {
        expect(regenerateButton.text()).toEqual('Regenerate');
        expect(regenerateButton.prop('disabled')).toBeFalsy();

        regenerateButton.simulate('click');
        expect(regenerateApiMock).toHaveBeenCalledTimes(1);

        const alert = wrapper.find('.alert');
        expect(alert.text()).toEqual('Error regenerating certificate');
      });
    });
  });
});
