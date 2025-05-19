import {
  fireEvent, render, screen,
} from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
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
  let apiMock;
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
    render(<CertificateWrapper {...props} />);

    const dataRows = await screen.findAllByTestId('certificate-info-table-row');
    expect(dataRows.length).toEqual(7);

    let certificateModal = document.querySelector('.pgn__modal-layer');
    expect(certificateModal).toBeInTheDocument();

    const btnLink = await screen.findByTestId('certificates-btn-link');
    fireEvent.click(btnLink);
    certificateModal = document.querySelector('.pgn__modal-layer');
    expect(certificateModal).not.toBeInTheDocument();
  });

  it('Downloadable Certificate', async () => {
    apiMock = jest.spyOn(api, 'getCertificate').mockImplementationOnce(() => Promise.resolve(downloadableCertificate));
    render(<CertificateWrapper {...props} />);

    const dataRows = await screen.findAllByTestId('certificate-info-table-row');
    expect(dataRows.length).toEqual(7);

    // Explicitly check each row and verify individual piece of data
    const courseId = dataRows[0];
    expect(courseId.querySelector('th').textContent).toEqual('Course ID');
    expect(courseId.querySelector('td').textContent).toEqual(testCourseId);

    // Explicitly check each row and verify individual piece of data
    const certType = dataRows[1];
    expect(certType.querySelector('th').textContent).toEqual('Certificate Type');
    expect(certType.querySelector('td').textContent).toEqual('verified');

    const status = dataRows[2];
    expect(status.querySelector('th').textContent).toEqual('Status');
    expect(status.querySelector('td').textContent).toEqual('passing');

    const grade = dataRows[3];
    expect(grade.querySelector('th').textContent).toEqual('Grade');
    expect(grade.querySelector('td').textContent).toEqual('60');

    const lastUpdated = dataRows[4];
    expect(lastUpdated.querySelector('th').textContent).toEqual('Last Updated');
    expect(lastUpdated.querySelector('td').textContent).toEqual('Jan 1, 2020 12:00 AM');

    const downloadUrl = dataRows[5];
    expect(downloadUrl.querySelector('th').textContent).toEqual('Download URL');
    expect(downloadUrl.querySelector('td').textContent).toEqual('Download');
    expect(downloadUrl.querySelector('td').querySelector('a').href).toEqual('http://localhost:18000/certificates/1234-abcd');

    const action = dataRows[6];
    expect(action.querySelector('th').textContent).toEqual('Actions');
    expect(action.querySelector('button#generate-certificate')).toBeInTheDocument();
  });

  it('Regeneratable Certificate', async () => {
    apiMock = jest.spyOn(api, 'getCertificate').mockImplementationOnce(() => Promise.resolve(regeneratableCertificate));
    render(<CertificateWrapper {...props} />);

    const dataRows = await screen.findAllByTestId('certificate-info-table-row');
    expect(dataRows.length).toEqual(7);

    expect(dataRows[0].textContent).toContain(regeneratableCertificate.courseKey);

    const action = dataRows[6];
    const actionButton = action.querySelector('button#regenerate-certificate');
    expect(action.querySelector('th').textContent).toEqual('Actions');
    expect(actionButton.textContent).toEqual('Regenerate');
  });

  it('Pdf Certificate', async () => {
    apiMock = jest.spyOn(api, 'getCertificate').mockImplementationOnce(() => Promise.resolve(pdfCertificate));
    render(<CertificateWrapper {...props} />);

    const dataRows = await screen.findAllByTestId('certificate-info-table-row');
    expect(dataRows.length).toEqual(7);

    expect(dataRows[0].textContent).toContain(pdfCertificate.courseKey);

    const downloadUrl = dataRows[5];
    expect(downloadUrl.querySelector('th').textContent).toEqual('Download URL');
    expect(downloadUrl.querySelector('td').textContent).toEqual('Download');

    // Pdf certificate's download link does not have LMS base url
    const downloadLink = downloadUrl.querySelector('td').querySelector('a').href;
    expect(downloadLink).not.toEqual(expect.stringContaining(`${getConfig().LMS_BASE_URL}`));
    expect(downloadLink).toEqual('https://www.example.com/');
  });

  it('Missing Certificate Data', async () => {
    apiMock = jest.spyOn(api, 'getCertificate').mockImplementationOnce(() => Promise.resolve({ courseKey: testCourseId }));
    render(<CertificateWrapper {...props} />);

    const dataRows = await screen.findAllByTestId('certificate-info-table-row');
    expect(dataRows.length).toEqual(7);
    expect(dataRows[0].textContent).toContain(regeneratableCertificate.courseKey);
    expect(dataRows[1].querySelector('td').textContent).toEqual('Not Available');
    expect(dataRows[2].querySelector('td').textContent).toEqual('Not Available');
    expect(dataRows[3].querySelector('td').textContent).toEqual('Not Available');
    expect(dataRows[4].querySelector('td').textContent).toEqual('N/A');
    expect(dataRows[5].querySelector('td').textContent).toEqual('Not Available');
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
    render(<CertificateWrapper {...props} />);
    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toEqual('No certificate found');
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

      render(<CertificateWrapper {...props} />);

      let generateButton = await screen.findByTestId('generate-certificate-button');
      expect(generateButton.textContent).toEqual('Generate');
      expect(generateButton.disabled).toBeFalsy();

      fireEvent.click(generateButton);
      generateButton = await screen.findByTestId('generate-certificate-button');

      expect(generateButton.disabled).toBeTruthy();
      expect(generateApiMock).toHaveBeenCalledTimes(1);
      // TODO: need to figure out why alert is not rendering here
      // const alertInfo = await screen.findByRole('alert');
      // expect(alertInfo.textContent).toEqual('Generating New Certificate');

      // Once the generation api call is successful, the status text will revert
      // and button will change into regenerate button.
      const regenerateButton = await screen.findByTestId('regenerate-certificate-button');
      expect(await screen.queryByRole('h3')).not.toBeInTheDocument();
      expect(regenerateButton.textContent).toEqual('Regenerate');
      expect(regenerateButton.disabled).toBeFalsy();
      expect(apiMock).toHaveBeenCalledTimes(2);
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

      render(<CertificateWrapper {...props} />);

      const generateButton = await screen.findByTestId('generate-certificate-button');
      expect(generateButton.textContent).toEqual('Generate');
      expect(generateButton.disabled).toBeFalsy();
      await fireEvent.click(generateButton);
      expect(generateApiMock).toHaveBeenCalledTimes(1);

      const alert = await screen.findByRole('alert');
      expect(alert.textContent).toEqual('Error generating certificate');
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

      render(<CertificateWrapper {...props} />);

      let regenerateButton = await screen.findByTestId('regenerate-certificate-button');
      expect(regenerateButton.textContent).toEqual('Regenerate');
      expect(regenerateButton.disabled).toBeFalsy();

      fireEvent.click(regenerateButton);
      regenerateButton = await screen.findByTestId('regenerate-certificate-button');

      expect(regenerateButton.disabled).toBeTruthy();
      expect(regenerateApiMock).toHaveBeenCalledTimes(1);
      // TODO: need to figure out why alert is not being rendered
      // const infoAlert = await screen.findByRole('alert');
      // expect(infoAlert.textContent).toEqual('Regenerating Certificate');

      regenerateButton = await screen.findByTestId('regenerate-certificate-button');
      expect(await screen.queryByRole('h3')).not.toBeInTheDocument();
      expect(regenerateButton.disabled).toBeFalsy();
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

      render(<CertificateWrapper {...props} />);

      const regenerateButton = await screen.findByTestId('regenerate-certificate-button');
      expect(regenerateButton.textContent).toEqual('Regenerate');
      expect(regenerateButton.disabled).toBeFalsy();

      await fireEvent.click(regenerateButton);
      expect(regenerateApiMock).toHaveBeenCalledTimes(1);

      const alert = await screen.findByRole('alert');
      expect(alert.textContent).toEqual('Error regenerating certificate');
    });
  });
});
