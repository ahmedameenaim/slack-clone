import React from 'react';
import { Segment, Comment } from 'semantic-ui-react'
import firebase from '../../firebase';
import MessagsHeader from './messageheader';
import MessageForm from './messageform';
import Message from './message';

class Messages extends React.Component {

    state = {
        privateMessagesRef: firebase.database().ref('privateMessages'),
        privateChannel: this.props.isPrivateChannel,
        messagesRef: firebase.database().ref('messages'),
        usersRef: firebase.database().ref('users'),
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        loadingMessages: true,
        messages: [],
        numUniqueUsers: '',
        searchTerm: '',
        searchLoading: false,
        searchResults: [],
        isChannelStarred: false
    }

    componentDidMount() {
        const { user, channel } = this.state;
        user && channel ? this.addListeners(channel.id) : console.log('================ Not working')
    }

    handleStar = () => {
        this.setState({ isChannelStarred: !this.state.isChannelStarred }, this.startChannel())
    }


    startChannel = () => {
        if (this.state.isChannelStarred) {
            this.state.usersRef
            .child(`${this.state.user.uid}/starred`)
            .update({
                [this.state.channel.id]: {
                    name: this.state.channel.name,
                    details: this.state.channel.details,
                    createdBy: {
                        name: this.state.channel.createdBy.name,
                        avatar: this.state.channel.createdBy.avatar
                    }
                }
            })
        } else {
            this.state.usersRef.child(`${this.state.user.uid}/starred`)
            .child(this.state.channel.id)
            .remove(err => {
                if(err !== null) {
                    console.error(err)
                }
            })
        }
    }



    displayChannelName = channel => {
        return channel ? `${this.state.privateChannel ? '@' : '#'}${channel.name}` : ''
    }

    getMessagesRef = () => {
        const { messagesRef, privateMessagesRef, privateChannel } = this.state;
        return privateChannel ? privateMessagesRef : messagesRef
    }


    handelSearchChange = event => {
        this.setState({
            searchTerm: event.target.value,
            searchLoading: true
        }, this.handleSearchMessages());
    }

    handleSearchMessages = () => {
        const channelMessages = [...this.state.messages];
        const regex = new RegExp(this.state.searchTerm, 'gi');
        const searchResults = channelMessages.reduce((acc, message) => {
            if (message.content) {
                if (message.content.match(regex) || message.user.name.match(regex)) {
                    acc.push(message)
                }
            }
            return acc
        }, [])
        this.setState({ searchResults })
        setTimeout(() => this.setState({ searchLoading: false }), 1000)
    }

    addListeners = (channelId) => {
        this.addMessageListener(channelId);
    }

    displayMessages = (messages) => (
        messages.length > 0 && messages.map(message => (
            <Message
                key={message.timestamp}
                message={message}
                user={this.state.user}
            />
        ))
    )

    addMessageListener = (channelId) => {
        let loadedMessages = [];
        const ref = this.getMessagesRef()
        ref.child(channelId).on('child_added', channel => {
            loadedMessages.push(channel.val());
            this.setState({
                messages: loadedMessages,
                loadingMessages: false
            });
            this.countUniqueUsers(loadedMessages);
        })
    }

    countUniqueUsers = (messages) => {
        const uniqueUsers = messages.reduce((acc, message) => {
            if (!acc.includes(message.user.name)) {
                acc.push(message.user.name)
            }
            return acc;
        }, [])
        const pluerl = uniqueUsers.length > 1 || uniqueUsers.length === 0;
        const numUniqueUsers = `${uniqueUsers.length} user${pluerl ? 's' : ''}`
        this.setState({ numUniqueUsers })
    }

    displayChannelName = channel => channel ? `${channel.name}` : ''

    render() {
        const { messagesRef, channel, user, messages, numUniqueUsers, searchTerm, searchResults, searchLoading, privateChannel, isChannelStarred } = this.state;
        return (
            <React.Fragment>
                <MessagsHeader
                    channelName={this.displayChannelName(channel)}
                    numUniqueUsers={numUniqueUsers}
                    handelSearchChange={this.handelSearchChange}
                    searchLoading={searchLoading}
                    privateChannel={privateChannel}
                    handleStar={this.handleStar}
                    isChannelStarred={isChannelStarred}
                />
                <Segment>
                    <Comment.Group className="messages">
                        {searchTerm ? this.displayMessages(searchResults) : this.displayMessages(messages)}
                    </Comment.Group>
                </Segment>
                <MessageForm
                    messagesRef={messagesRef}
                    currentChannel={channel}
                    currentUser={user}
                    isPrivateChannel={privateChannel}
                    getMessagesRef={this.getMessagesRef}
                />
            </React.Fragment>
        );
    }
}


export default Messages;