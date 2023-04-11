import { configuration } from './config';

/* eslint-disable import/prefer-default-export */
export const FOOTER_TEXT_BY_CONTENT_TYPE = {
  course: 'Course',
  program: 'Program',
  learnerpathway: 'Pathway',
};

// Highlight Card logic for footer text
export const getContentHighlightCardFooter = ({ price, contentType }) => {
  const formattedContentType = FOOTER_TEXT_BY_CONTENT_TYPE[contentType?.toLowerCase()];
  if (!price) {
    return formattedContentType;
  }
  return `$${price} · ${formattedContentType}`;
};

// Generate URLs for about pages from the enterprise learner portal
export function generateAboutPageUrl({ enterpriseSlug, contentType, contentKey }) {
  if (!contentType || !contentKey) {
    return undefined;
  }
  const { ENTERPRISE_LEARNER_PORTAL_URL } = configuration;
  const aboutPageBase = `${ENTERPRISE_LEARNER_PORTAL_URL}/${enterpriseSlug}`;
  if (contentType === 'learnerpathway') {
    return `${aboutPageBase}/search/${contentKey}`;
  }
  return `${aboutPageBase}/${contentType}/${contentKey}`;
}
