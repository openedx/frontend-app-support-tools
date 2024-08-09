import { Input, Button } from '@openedx/paragon';
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
            <label htmlFor="programUUID">Program UUID</label>
            <Input
              className="mr-1 col-sm-12"
              name="programUUID"
              type="text"
              defaultValue={programID}
              onChange={onProgramChange}
            />
          </div>
          <div className="my-4">
            <label
              className="d-flex align-items-start"
              htmlFor="usernamePairText"
            >
              List of External key and username pairings (one per line)
            </label>
            <Input
              className="mr-1 col-sm-12"
              name="usernamePairText"
              type="textarea"
              rows="10"
              onChange={onUserTextChange}
              defaultValue={usernamePairText}
              placeholder="external_user_key,lms_username"
            />
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
