import React, { useState } from 'react';
import Message from './Message';

const MessagesPanel = ({ onSendMessage, channel, userName }) => {
  const [message, setMessage] = useState('');

  const send = () => {
    if (message && message !== '') {
      onSendMessage(channel.id, message);
      setMessage('');
    }
  };

  const handleInput = (e) => {
    setMessage(e.target.value);
  };

  let list = (
    <div className="no-content-message">There is no messages to show</div>
  );

  if (channel && channel.messages) {
    list = channel.messages.map((m) => (
      <Message
        key={m.id}
        id={m.id}
        senderName={m.senderName}
        text={m.text}
        userName={userName}
      />
    ));
  }
  return (
    <div className="messages-panel">
      <div className="messages-list">{list}</div>
      {channel && (
        <div className="messages-input">
          <input type="text" onChange={handleInput} value={message} />
          <button onClick={send}>Send</button>
        </div>
      )}
    </div>
  );
};

export default MessagesPanel;
