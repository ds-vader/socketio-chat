import React, { Component } from 'react';
import socketClient from 'socket.io-client';

import MessagesPanel from './Message/MessagesPanel';
import ChannelList from './Channel/ChannelList';
import './chat.scss';

const SERVER = 'http://127.0.0.1:8080';

class Chat extends Component {
  state = {
    channels: null,
    socket: null,
    channel: null,
    userName: 'defaultName',
  };
  socket;
  componentDidMount() {
    this.loadChannels();
    this.configureSocket();
  }

  configureSocket = () => {
    let socket = socketClient(SERVER);
    socket.on('connection', () => {
      if (this.state.channel) {
        this.handleChannelSelect(this.state.channel.id);
      }
    });
    socket.on('channel', (channel) => {
      let channels = this.state.channels;
      channels.forEach((c) => {
        if (c.id === channel.id) {
          c.participants = channel.participants;
        }
      });
      this.setState({ channels });
    });
    socket.on('message', (message) => {
      let channels = this.state.channels;
      channels.forEach((c) => {
        if (c.id === message.channel_id) {
          if (!c.messages) {
            c.messages = [message];
          } else {
            c.messages.push(message);
          }
        }
      });
      this.setState({ channels });
    });
    this.socket = socket;
  };

  loadChannels = async () => {
    fetch('http://localhost:8080/getChannels').then(async (response) => {
      let data = await response.json();
      this.setState({ channels: data.channels });
    });
  };

  handleChangeName = (name) => {
    this.setState({
      userName: name,
    });
  };

  handleChannelSelect = (id) => {
    let channel = this.state.channels.find((c) => {
      return c.id === id;
    });
    this.setState({ channel });
    this.socket.emit('channel-join', id, (ack) => {});
  };

  handleSendMessage = (channel_id, text) => {
    this.socket.emit('send-message', {
      channel_id,
      text,
      senderName: this.state.userName,
      id: Date.now(),
    });
  };

  render() {
    return (
      <div className="chat-app">
        <ChannelList
          channels={this.state.channels}
          onSelectChannel={this.handleChannelSelect}
          handleChangeName={this.handleChangeName}
        />
        <MessagesPanel
          userName={this.state.userName}
          onSendMessage={this.handleSendMessage}
          channel={this.state.channel}
        />
      </div>
    );
  }
}
export default Chat;
