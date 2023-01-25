import { Button, Form } from '@edx/paragon';
import React, { useState, useCallback } from 'react';
import getLinkProgramEnrollmentDetails from './data/api';
import LinkProgramEnrollmentsTable from './LinkProgramEnrollmentsTable';

export default function LinkProgramEnrollments() {
  const [programID, setProgramID] = useState(undefined);
  const [usernamePairText, setUsernamePairText] = useState(undefined);
  const [successMessage, setSuccessMessage] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [isFetchingData, setIsFetchingData] = useState(false);

  const onProgramChange = (e) => {
    if (e.currentTarget.value) {
      setProgramID(e.currentTarget.value);
    } else {
      setProgramID(undefined);
    }
  };

  const onUserTextChange = (e) => {
    if (e.currentTarget.value) {
      setUsernamePairText(e.currentTarget.value);
    } else {
      setUsernamePairText(undefined);
    }
  };

  const handleSubmit = () => {
    setIsFetchingData(true);
    getLinkProgramEnrollmentDetails({ programID, usernamePairText }).then((response) => {
      setSuccessMessage(response.successes);
      setErrorMessage(response.errors);
      setIsFetchingData(false);
    });
  };

  const submit = useCallback((event) => {
    event.preventDefault();
    handleSubmit();
    return false;
  });

  return (
    <>
      <h3>Link Program Enrollments</h3>
      <section className="my-3">
        <form>
          <div className="my-2">
            <Form.Group>
              <Form.Label htmlFor="programUUID">Program UUID</Form.Label>

              <Form.Control
                name="programUUID"
                defaultValue={programID}
                type="text"
                onChange={onProgramChange}
              />
            </Form.Group>
          </div>
          <div className="my-4">

            <Form.Group>
              <Form.Label
                className="d-flex align-items-start"
                htmlFor="usernamePairText"
              >
                List of External key and username pairings (one per line)
              </Form.Label>
              <Form.Control
                name="usernamePairText"
                as="textarea"
                autoResize
                rows="10"
                onChange={onUserTextChange}
                defaultValue={usernamePairText}
                placeholder="external_user_key,lms_username"
              />
            </Form.Group>
          </div>
          <Button
            type="submit"
            onClick={submit}
            disabled={isFetchingData}
          >
            Submit
          </Button>
        </form>
      </section>
      {((errorMessage && errorMessage.length > 0)
        || (successMessage && successMessage.length > 0)) && (
          <LinkProgramEnrollmentsTable
            successMessage={successMessage}
            errorMessage={errorMessage}
            usernamePairText={usernamePairText}
          />
      )}
    </>
  );
}
