import React from 'react';
import Channel from './Channel';

const ChannelList = ({ channels, onSelectChannel, handleChangeName }) => {
  let list = (
    <div className="no-content-message">There is no channels to show</div>
  );

  if (channels && channels.map) {
    list = channels.map((channel) => (
      <Channel
        key={channel.id}
        id={channel.id}
        name={channel.name}
        participants={channel.participants}
        onClick={onSelectChannel}
      />
    ));
  }

  return (
    <div className="channel-list">
      <input
        className="name-input"
        type="text"
        onChange={(e) => handleChangeName(e.target.value)}
      ></input>
      {list}
    </div>
  );
};

export default ChannelList;
