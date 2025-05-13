import React, {
  useRef,
  useEffect,
  useCallback,
  useContext,
  useState,
  useLayoutEffect,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Button } from '@openedx/paragon';

import UserMessagesContext from '../userMessages/UserMessagesContext';
import AlertList from '../userMessages/AlertList';
import { extractParams, isValidCourseID } from '../utils';
import FeatureBasedEnrollment from './FeatureBasedEnrollment';
import { FEATURE_BASED_ENROLLMENT_TAB, TAB_PATH_MAP } from '../SupportToolsTab/constants';

export default function FeatureBasedEnrollmentIndexPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = extractParams(location.search);

  const searchRef = useRef();
  const { add, clear } = useContext(UserMessagesContext);
  const [searchValue, setSearchValue] = useState(params.get('course_id') || undefined);
  const [apiFetchSignal, setApiFetchSignal] = useState(false);

  if (params.has('course_id')) {
    const courseId = params.get('course_id');
    params.set('course_id', decodeURIComponent(courseId));
  }

  function pushHistoryIfChanged(nextUrl) {
    if (nextUrl !== location.pathname + location.search) {
      navigate(nextUrl);
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
      navigate('/feature_based_enrollments', { replace: true });
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
      setApiFetchSignal(!apiFetchSignal);
      pushHistoryIfChanged(`/feature_based_enrollments/?course_id=${inputValue}`);
    } else if (inputValue === '') {
      navigate('/feature_based_enrollments', { replace: true });
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

  // To change the url with appropriate query param if query param info is not present in URL
  useLayoutEffect(() => {
    if (searchValue
        && location.pathname.indexOf(TAB_PATH_MAP[FEATURE_BASED_ENROLLMENT_TAB]) !== -1
        && !params.get('course_id')) {
      pushHistoryIfChanged(`${TAB_PATH_MAP[FEATURE_BASED_ENROLLMENT_TAB]}/?course_id=${searchValue}`);
    }
  });

  return (
    <main className="mt-3 mb-5">

      <AlertList topic="featureBasedEnrollmentGeneral" className="mb-3" />

      <section className="mb-3 px-2">
        <Form>
          <Form.Row>
            <Form.Label htmlFor="courseId" className="my-auto">Course ID</Form.Label>
            <Form.Control ref={searchRef} name="courseId" className="mr-1 ml-1 col-sm-4" defaultValue={searchValue} />
            <Button type="submit" onClick={submit} className="ml-1 col-sm-1" variant="primary">Search</Button>
          </Form.Row>
        </Form>
      </section>

      {searchValue && <FeatureBasedEnrollment courseId={searchValue} apiFetchSignal={apiFetchSignal} />}
    </main>
  );
}
