import React from 'react';

const Channel = ({ id, name, participants, onClick }) => {
  return (
    <div className="channel-item" onClick={() => onClick(id)}>
      <div>{name}</div>
      <span>{participants}</span>
    </div>
  );
};

export default Channel;
