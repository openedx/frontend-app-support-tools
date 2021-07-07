import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

import UserMessagesContext from './UserMessagesContext';

export default function UserMessagesProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [nextId, setNextId] = useState(1);

  const refId = useRef(nextId);

  const add = ({
    code, dismissible, text, type, topic, ...others
  }) => {
    const id = refId.current;
    setMessages(currentMessages => [...currentMessages, {
      code, dismissible, text, type, topic, ...others, id,
    }]);
    refId.current += 1;
    setNextId(refId.current);
    return refId.current;
  };

  const remove = id => {
    setMessages(currentMessages => currentMessages.filter(message => message.id !== id));
  };

  const clear = (topic = null) => {
    setMessages(currentMessages => (topic === null ? [] : currentMessages.filter(message => message.topic !== topic)));
  };

  const value = {
    add,
    remove,
    clear,
    messages,
  };

  return (
    <UserMessagesContext.Provider value={value}>
      {children}
    </UserMessagesContext.Provider>
  );
}

UserMessagesProvider.propTypes = {
  children: PropTypes.node,
};

UserMessagesProvider.defaultProps = {
  children: null,
};
