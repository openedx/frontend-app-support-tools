import React from 'react';
import PropTypes from 'prop-types';

export default function UserSummary({ data }) {
  return (
    <section className="mb-3">
      <h3>User Summary</h3>

      {data === null ?
        (<div>
          Sorry, user not found!
        </div>)
        :
        (<div>
          <p><b>Full name:</b> {data.name === '' ? <span>not set</span> : <span>{data.name}</span>}</p>
          <p><b>Is active:</b> {data.isActive ? <span>yes</span> : <span>no</span> }</p>
          <p><b>Email:</b> {data.email}</p>
          <p><b>Country:</b> {data.country ? <span>{data.country}</span> : <span>not set</span>}</p>
        </div>)
      }
    </section>
  );
}

UserSummary.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object,
};

UserSummary.defaultProps = {
  data: null,
};
