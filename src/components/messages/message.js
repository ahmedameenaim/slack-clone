import React from 'react';
import { Comment, Image } from 'semantic-ui-react';
import moment from 'moment';


const isOwnMessage = (message, user) => {
    return message.user.id === user.uid ? 'Message__self' : ''
}

const timeFromNow = (timestamp) => {
    return moment(timestamp).fromNow();
}

const isImage = (message) => {
    return message.hasOwnProperty('image') && !message.hasOwnProperty('content');
};

const Message = ({ message , user }) => {
    return (
        <Comment>
            <Comment.Avatar src={message.user.avatar} />
            <Comment.Content className={isOwnMessage(message, user)}>
                <Comment.Author as="a">{message.user.name}</Comment.Author>
                <Comment.Metadata>{timeFromNow(message.timestamp)}</Comment.Metadata>
                <Comment.Text>{message.content}</Comment.Text>
                {isImage(message) ? <Image src={message.image} className="message__image" /> : '' }
            </Comment.Content>
        </Comment>
    );
}








export default Message;