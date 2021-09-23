import { history } from '@edx/frontend-platform';
import React, {
  useRef,
  useEffect,
  useCallback,
  useContext,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Input, Button } from '@edx/paragon';

import UserMessagesContext from '../userMessages/UserMessagesContext';
import AlertList from '../userMessages/AlertList';
import { isValidCourseID } from '../utils';
import FeatureBasedEnrollment from './FeatureBasedEnrollment';

export default function FeatureBasedEnrollmentIndexPage({ location }) {
  const params = new Map(
    location.search
      .slice(1) // removes '?' mark from start
      .split('&')
      .map(queryParams => queryParams.split('=')),
  );

  const searchRef = useRef();
  const { add, clear } = useContext(UserMessagesContext);
  const [searchValue, setSearchValue] = useState(params.get('course_id') || undefined);

  if (params.has('course_id')) {
    const courseId = params.get('course_id');
    params.set('course_id', decodeURIComponent(courseId));
  }

  function pushHistoryIfChanged(nextUrl) {
    if (nextUrl !== location.pathname + location.search) {
      history.push(nextUrl);
    }
  }

  function validateInput(inputValue) {
    if (!isValidCourseID(inputValue)) {
      add({
        code: null,
        dismissible: false,
        text: `Supplied course ID "${inputValue}" is either invalid or incorrect.`,
        type: 'error',
        topic: 'featureBasedEnrollmentGeneral',
      });
      history.replace('/feature_based_enrollments');
      return false;
    }
    return true;
  }

  const handleSearchInput = useCallback((inputValue) => {
    clear('featureBasedEnrollmentGeneral');
    if (inputValue !== undefined && inputValue !== '') {
      if (!validateInput(inputValue)) {
        return;
      }
      setSearchValue(inputValue);
      pushHistoryIfChanged(`/feature_based_enrollments/?course_id=${inputValue}`);
    } else if (inputValue === '') {
      history.replace('/feature_based_enrollments');
    }
  });

  const submit = useCallback((event) => {
    const inputValue = searchRef.current.value;
    setSearchValue(undefined);
    event.preventDefault();
    handleSearchInput(inputValue);
    return false;
  });

  // Run this once when the user re-loads the page with course_id query param present in url
  useEffect(() => {
    if (params.get('course_id')) {
      handleSearchInput(params.get('course_id'));
    }
  }, []);

  return (
    <main className="ml-5 mr-5 mt-3 mb-5">

      <section className="mb-3">
        <Link to="/">&lt; Back to Tools</Link>
      </section>

      <AlertList topic="featureBasedEnrollmentGeneral" className="mb-3" />

      <section className="mb-3">
        <form className="form-inline">
          <label htmlFor="courseId">Course ID</label>
          <Input ref={searchRef} className="flex-grow-1 mr-1" name="courseId" type="text" defaultValue={searchValue} />
          <Button type="submit" onClick={submit} variant="primary">Search</Button>
        </form>
      </section>

      {searchValue && <FeatureBasedEnrollment courseId={searchValue} />}
    </main>
  );
}

FeatureBasedEnrollmentIndexPage.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
  }).isRequired,
};
