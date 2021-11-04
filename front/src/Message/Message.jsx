import React from 'react';

const Message = ({ senderName, text, userName }) => {
  let style = userName === senderName ? '' : 'another-message';
  return (
    <div className={style}>
      <div>
        <b>{senderName}</b>
      </div>
      <span>{text}</span>
    </div>
  );
};
export default Message;
