import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import UserMessagesContext from './UserMessagesContext';

export default function UserMessagesProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [nextId, setNextId] = useState(1);

  const add = useCallback(({
    code, dismissible, text, type, topic, ...others
  }) => {
    const id = nextId;
    setMessages([...messages, {
      code, dismissible, text, type, topic, ...others, id,
    }]);
    setNextId(nextId + 1);
    return id;
  }, [messages, nextId]);

  const remove = useCallback(
    id => setMessages(messages.filter(message => message.id !== id)),
    [messages, nextId],
  );

  const value = {
    add,
    remove,
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
