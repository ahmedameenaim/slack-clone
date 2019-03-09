import React from 'react';
import {Segment , Comment} from 'semantic-ui-react'
import firebase from '../../firebase';
import MessagsHeader from './messageheader';
import MessageForm from './messageform';
import Message from './message';

class Messages extends React.Component {
 
    state = {
        messagesRef: firebase.database().ref('messages'),
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        loadingMessages: true,
        messages: []
    }

    componentDidMount() {
        
        const {user , channel} = this.state;
        
        user && channel ? this.addListeners(channel.id) : console.log('================ No working')
    }

    addListeners = (channelId) => {
        this.addMessageListener(channelId);
    }

    displayMessages = (messages) => (
        messages.length > 0 && messages.map(message => (
            <Message 
                key = {message.timestamp}
                message = {message}
                user = {this.state.user}
            />
        ))
    )

    addMessageListener = (channelId) => {
        let loadedMessages = [];
        this.state.messagesRef.child(channelId).on('child_added' , channel => {
            loadedMessages.push(channel.val());
            this.setState({
                messages: loadedMessages,
                loadingMessages: false
            });
        })
    }

    render() {
        const {messagesRef , channel , user , messages} = this.state;
        return(
           <React.Fragment>
               <MessagsHeader />
               <Segment>
                   <Comment.Group className = "messages">
                           {this.displayMessages(messages)}
                   </Comment.Group>
               </Segment>
               <MessageForm 
                   messagesRef = {messagesRef}
                   currentChannel = {channel}
                   currentUser = {user}
               />
           </React.Fragment>
        );
    }
}


export default Messages;