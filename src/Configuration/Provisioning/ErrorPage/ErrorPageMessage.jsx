import PropTypes from 'prop-types';
import { ERROR_PAGE_TEXT } from '../data/constants';

const ErrorPageMessage = ({ message }) => (
  <section className="mt-4">
    <div>
      <h1
        className="text-danger"
        style={{
          fontSize: '3.75rem',
          lineHeight: '4rem',
        }}
      >
        {ERROR_PAGE_TEXT.TITLE}&nbsp;
        <span className="text-primary">
          {ERROR_PAGE_TEXT.SPANNED_TITLE}
        </span>
      </h1>
    </div>
    <div className="mt-4">
      <p>
        {message}
        <br />
        {ERROR_PAGE_TEXT.SUB_TITLE}
      </p>
    </div>
  </section>
);

ErrorPageMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

export default ErrorPageMessage;
