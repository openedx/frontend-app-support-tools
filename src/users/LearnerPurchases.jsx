import React from 'react';
import PropTypes from 'prop-types';
import OrderHistory from './orderHistory/OrderHistory';

export default function LearnerPurchases({
  user,
}) {
  return (
    <div id="learnerPurchasesContainer">
      <OrderHistory
        username={user}
      />
    </div>
  );
}

LearnerPurchases.propTypes = {
  user: PropTypes.string.isRequired,
};
