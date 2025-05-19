import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class PageLoading extends Component {
  renderSrMessage() {
    if (!this.props.srMessage) {
      return null;
    }

    return <span className="sr-only">{this.props.srMessage}</span>;
  }

  render() {
    return (
      <div>
        <div
          data-testid="page-loading"
          className="d-flex justify-content-center align-items-center flex-column"
          style={{
            height: '20vh',
          }}
        >
          <div className="spinner-border text-primary" role="status">
            {this.renderSrMessage()}
          </div>
        </div>
      </div>
    );
  }
}

PageLoading.propTypes = {
  srMessage: PropTypes.string.isRequired,
};
