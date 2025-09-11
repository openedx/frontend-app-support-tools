import React from 'react';
import {
  render,
  screen,
  waitFor,
  within,
  fireEvent,
  cleanup,
  act,
} from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import UserMessagesProvider from '../../userMessages/UserMessagesProvider';
import * as api from '../data/api';
import Certificates from './Certificates';
import {
  downloadableCertificate,
  pdfCertificate,
  regeneratableCertificate,
} from '../data/test/certificates';

const CertificateWrapper = (props) => (
  <IntlProvider locale="en">
    <UserMessagesProvider>
      <Certificates {...props} />
    </UserMessagesProvider>
  </IntlProvider>
);

describe('Certificate component', () => {
  let apiMock;
  const testUser = 'testUser';
  const testCourseId = 'course-v1:testX+test123+2030';

  const props = {
    username: testUser,
    courseId: testCourseId,
    closeHandler: jest.fn(),
  };

  afterEach(() => {
    if (apiMock) {
      apiMock.mockRestore();
    }
    cleanup();
  });

  it('Default component render with Modal', async () => {
    apiMock = jest.spyOn(api, 'getCertificate').mockResolvedValueOnce(
      downloadableCertificate,
    );

    await act(async () => {
      render(<CertificateWrapper {...props} />);
    });

    const rows = await screen.findAllByRole('row');
    expect(rows.length).toBe(7);

    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();

    const closeButtons = within(modal).getAllByRole('button', { name: /Close/i });
    const closeBtn = closeButtons[closeButtons.length - 1];
    fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('Downloadable Certificate', async () => {
    apiMock = jest.spyOn(api, 'getCertificate').mockResolvedValueOnce(
      downloadableCertificate,
    );

    await act(async () => {
      render(<CertificateWrapper {...props} />);
    });

    const rows = await screen.findAllByRole('row');
    expect(rows.length).toBe(7);

    expect(within(rows[0]).getByText('Course ID')).toBeInTheDocument();
    expect(within(rows[0]).getByText(testCourseId)).toBeInTheDocument();

    expect(within(rows[1]).getByText('Certificate Type')).toBeInTheDocument();
    expect(within(rows[1]).getByText('verified')).toBeInTheDocument();

    expect(within(rows[2]).getByText('Status')).toBeInTheDocument();
    expect(within(rows[2]).getByText('passing')).toBeInTheDocument();

    expect(within(rows[3]).getByText('Grade')).toBeInTheDocument();
    expect(within(rows[3]).getByText('60')).toBeInTheDocument();

    expect(within(rows[4]).getByText('Last Updated')).toBeInTheDocument();
    expect(within(rows[4]).getByText('Jan 1, 2020 12:00 AM')).toBeInTheDocument();

    const downloadLink = within(rows[5]).getByRole('link', { name: /Download/i });
    expect(downloadLink).toHaveAttribute(
      'href',
      'http://localhost:18000/certificates/1234-abcd',
    );

    const actionBtn = within(rows[6]).getByRole('button', { name: /Generate/i });
    expect(actionBtn).toBeInTheDocument();
  });

  it('Regeneratable Certificate', async () => {
    apiMock = jest.spyOn(api, 'getCertificate').mockResolvedValueOnce(
      regeneratableCertificate,
    );

    await act(async () => {
      render(<CertificateWrapper {...props} />);
    });

    const rows = await screen.findAllByRole('row');
    expect(rows.length).toBe(7);

    expect(rows[0].textContent).toContain(regeneratableCertificate.courseKey);

    const actionBtn = within(rows[6]).getByRole('button', { name: /Regenerate/i });
    expect(actionBtn).toHaveTextContent('Regenerate');
  });

  it('Pdf Certificate', async () => {
    apiMock = jest.spyOn(api, 'getCertificate').mockResolvedValueOnce(pdfCertificate);

    await act(async () => {
      render(<CertificateWrapper {...props} />);
    });

    const rows = await screen.findAllByRole('row');
    expect(rows.length).toBe(7);

    expect(rows[0].textContent).toContain(pdfCertificate.courseKey);

    const downloadLink = within(rows[5]).getByRole('link', { name: /Download/i });
    expect(downloadLink).toHaveAttribute('href', 'https://www.example.com');
  });

  it('Missing Certificate Data', async () => {
    apiMock = jest.spyOn(api, 'getCertificate').mockResolvedValueOnce({
      courseKey: testCourseId,
    });

    await act(async () => {
      render(<CertificateWrapper {...props} />);
    });

    const rows = await screen.findAllByRole('row');
    expect(rows.length).toBe(7);

    expect(within(rows[1]).getByText('Not Available')).toBeInTheDocument();
    expect(within(rows[2]).getByText('Not Available')).toBeInTheDocument();
    expect(within(rows[3]).getByText('Not Available')).toBeInTheDocument();
    expect(within(rows[4]).getByText('N/A')).toBeInTheDocument();
    expect(within(rows[5]).getByText('Not Available')).toBeInTheDocument();
  });

  it('Certificate Fetch Errors', async () => {
    apiMock = jest.spyOn(api, 'getCertificate').mockResolvedValueOnce({
      errors: [
        {
          code: null,
          dismissible: true,
          text: 'No certificate found',
          type: 'danger',
          topic: 'certificates',
        },
      ],
    });

    await act(async () => {
      render(<CertificateWrapper {...props} />);
    });

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('No certificate found');
  });

  describe('Generate Certificates flow', () => {
    let generateApiMock;

    afterEach(() => {
      if (generateApiMock) {
        generateApiMock.mockRestore();
      }
    });

    it('Successful certificate generation flow', async () => {
      generateApiMock = jest.spyOn(api, 'generateCertificate').mockResolvedValueOnce({});
      apiMock = jest.spyOn(api, 'getCertificate').mockResolvedValueOnce(
        downloadableCertificate,
      );

      await act(async () => {
        render(<CertificateWrapper {...props} />);
      });

      const generateButton = await screen.findByRole('button', { name: /Generate/i });
      expect(generateButton).toBeInTheDocument();
      fireEvent.click(generateButton);

      await waitFor(() => {
        expect(generateApiMock).toHaveBeenCalledTimes(1);
      });
    });

    it('Unsuccessful certificate generation flow', async () => {
      generateApiMock = jest.spyOn(api, 'generateCertificate').mockResolvedValueOnce({
        errors: [
          {
            code: null,
            dismissible: true,
            text: 'Error generating certificate',
            type: 'danger',
            topic: 'certificates',
          },
        ],
      });

      apiMock = jest.spyOn(api, 'getCertificate').mockResolvedValueOnce(
        downloadableCertificate,
      );

      await act(async () => {
        render(<CertificateWrapper {...props} />);
      });

      const generateButton = await screen.findByRole('button', { name: /Generate/i });
      fireEvent.click(generateButton);

      await waitFor(async () => {
        const alert = await screen.findByRole('alert');
        expect(alert).toHaveTextContent('Error generating certificate');
      });
    });
  });

  describe('Regenerate Certificates flow', () => {
    let regenerateApiMock;

    afterEach(() => {
      if (regenerateApiMock) {
        regenerateApiMock.mockRestore();
      }
    });

    it('Successful certificate regeneration flow', async () => {
      regenerateApiMock = jest.spyOn(api, 'regenerateCertificate').mockResolvedValueOnce({});
      apiMock = jest.spyOn(api, 'getCertificate').mockResolvedValueOnce(
        regeneratableCertificate,
      );

      await act(async () => {
        render(<CertificateWrapper {...props} />);
      });

      const modal = await screen.findByRole('dialog');
      const regenerateButton = within(modal).getByRole('button', { name: 'Regenerate' });

      expect(regenerateButton).toHaveTextContent('Regenerate');
      fireEvent.click(regenerateButton);

      await waitFor(() => {
        expect(regenerateApiMock).toHaveBeenCalledTimes(1);
      });
    });

    it('Unsuccessful certificate regeneration flow', async () => {
      regenerateApiMock = jest.spyOn(api, 'regenerateCertificate').mockResolvedValueOnce({
        errors: [
          {
            code: null,
            dismissible: true,
            text: 'Error regenerating certificate',
            type: 'danger',
            topic: 'certificates',
          },
        ],
      });

      apiMock = jest.spyOn(api, 'getCertificate').mockResolvedValueOnce(
        regeneratableCertificate,
      );

      await act(async () => {
        render(<CertificateWrapper {...props} />);
      });

      const modal = await screen.findByRole('dialog');
      const regenerateButton = within(modal).getByRole('button', { name: 'Regenerate' });
      fireEvent.click(regenerateButton);

      await waitFor(() => {
        const alert = screen.getByRole('alert');
        expect(alert).toHaveTextContent('Error regenerating certificate');
      });
    });
  });
});
