import { Form, Button } from '@openedx/paragon';
import React, { useState, useCallback } from 'react';
import getLinkProgramEnrollmentDetails from './data/api';
import LinkProgramEnrollmentsTable from './LinkProgramEnrollmentsTable';

export default function LinkProgramEnrollments() {
  const [programID, setProgramID] = useState('');
  const [usernamePairText, setUsernamePairText] = useState('');
  const [successMessage, setSuccessMessage] = useState([]);
  const [errorMessage, setErrorMessage] = useState([]);
  const [isFetchingData, setIsFetchingData] = useState(false);

  const onProgramChange = (e) => {
    setProgramID(e.currentTarget.value || '');
  };

  const onUserTextChange = (e) => {
    setUsernamePairText(e.currentTarget.value || '');
  };

  const handleSubmit = () => {
    setIsFetchingData(true);
    getLinkProgramEnrollmentDetails({ programID, usernamePairText }).then((response) => {
      setSuccessMessage(response.successes || []);
      setErrorMessage(response.errors || []);
      setIsFetchingData(false);
    });
  };

  const submit = useCallback((event) => {
    event.preventDefault();
    handleSubmit();
    return false;
  }, [programID, usernamePairText]);

  return (
    <>
      <h3>Link Program Enrollments</h3>
      <section className="my-3">
        <Form>
          <Form.Group className="my-2">
            <Form.Label htmlFor="programUUID">Program UUID</Form.Label>
            <Form.Control
              name="programUUID"
              value={programID}
              onChange={onProgramChange}
            />
          </Form.Group>
          <Form.Group className="my-4">
            <Form.Label htmlFor="usernamePairText">
              List of External key and username pairings (one per line)
            </Form.Label>
            <Form.Control
              name="usernamePairText"
              as="textarea"
              rows="10"
              value={usernamePairText}
              onChange={onUserTextChange}
              placeholder="external_user_key,lms_username"
            />
          </Form.Group>
          <Button
            type="submit"
            onClick={submit}
            disabled={isFetchingData}
          >
            Submit
          </Button>
        </Form>
      </section>

      {/*  Error Message */}
      {errorMessage && errorMessage.length > 0 && (
        <div data-testid="error-message" className="text-danger my-3">
          {errorMessage.join(', ')}
        </div>
      )}

      {/*  Success Message */}
      {successMessage && successMessage.length > 0 && (
        <div data-testid="success" className="text-success my-3">
          {successMessage.join(', ')}
        </div>
      )}

      {/* Table Rendering */}
      {(errorMessage.length > 0 || successMessage.length > 0) && (
        <LinkProgramEnrollmentsTable
          successMessage={successMessage}
          errorMessage={errorMessage}
          usernamePairText={usernamePairText}
        />
      )}
    </>
  );
}
