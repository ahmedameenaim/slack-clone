import React from 'react';
import { Segment, Button, Input } from 'semantic-ui-react'
import firebase from '../../firebase';
import FileModal from './filemodal';
import uuidv4 from 'uuid/v4';


class MessageForm extends React.Component {

    state = {
        storageRef: firebase.storage().ref(),
        message: '',
        loading: false,
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        errors: [],
        modal: false,
        uploadState: '',
        uploadTask: null,
        precentUploaded: 0
    }

    sendFileMessage = (fileUrl , ref , pathToUpload) => {
        ref.child(pathToUpload)
         .push()
         .set(this.createMessage(fileUrl))
         .then(() => {
            this.setState({uploadState: 'done~!'})
         }).catch(err => {
             console.error(err)
             this.setState({errors: this.state.errors.concat(err)})
         })
    }

    fileUpload = (file , metadata) => {
     const pathToUpload = this.state.channel.id;
     const ref = this.props.messagesRef;
     const filePath = `chat/public/${uuidv4()}.jpg`;

     this.setState({
         uploadState: 'uploading',
         uploadTask: this.state.storageRef.child(filePath).put(file,metadata)
     } , () => {
         this.state.uploadTask.on('state_changed' , (snap) => {
             const precentUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
             this.setState({precentUploaded} , err => {
                 console.log(err)
                 this.setState({errors: this.state.errors.concat(err) , uploadState: 'error' , uploadTask: null} , () => {
                     this.state.uploadTask.snapshot.ref.getDownloadURL().then(downloadUrl => {
                         this.sendFileMessage(downloadUrl , ref , pathToUpload);
                     }).catch(err => {
                        console.log(err)
                        this.setState({errors: this.state.errors.concat(err) , uploadState: 'error' , uploadTask: null})
                     })
                 })

             }) 
         })
     })
    }

    openModal = () => this.setState({modal: true});
    closeModal = () => this.setState({modal: false});

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    createMessage = ( fileUrl = null) => {
        const { user } = this.state;
        const payload = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: user.uid,
                name: user.displayName,
                avatar: user.photoURL
            }
        }

        if(fileUrl !== null) {
            payload['image'] = fileUrl;
        } else {
            payload.content = this.state.message
        }
        return payload

    }

    sendMessage = () => {

        const { messagesRef } = this.props;
        const { message, channel } = this.state;

        if (message) {
            this.setState({ loading: true })
            messagesRef.child(channel.id).push().set(this.createMessage())
                .then(() => {
                    console.log('Message was Sent!...')
                    this.setState({ loading: false, message: '', errors: [] })
                }).catch(err => {
                    console.error(err)
                    this.setState({ loading: false, errors: this.state.errors.concat(err) })
                })
        } else {
            this.setState({ errors: this.state.errors.concat({ message: ' Add an message!..' }) })
        }
    }

    render() {
        const { errors ,message , loading , modal} = this.state;
        return (
            <Segment className="message__form">
                <Input
                    fluid
                    value = {message}
                    name="message"
                    style={{ marginBottom: '0.7em' }}
                    label={<Button icon={"add"} />}
                    labelPosition="left"
                    placeholder="Write Your Message.."
                    onChange={this.handleChange}
                    className={
                        errors.some(error => error.message.includes('message')) ? 'error' : ''
                    }
                />
                <Button.Group icon widths="2">
                    <Button
                        color="orange"
                        content="Add your Replay"
                        labelPosition="left"
                        icon="edit"
                        onClick={this.sendMessage}
                        disabled = {loading}
                    />

                    <Button
                        color="teal"
                        content="Upload your Media"
                        labelPosition="right"
                        icon="cloud upload"
                        onClick = {this.openModal}
                    />
                    <FileModal 
                        modal = {modal}
                        closeModal = {this.closeModal}
                        fileUpload = {this.fileUpload}
                    />

                </Button.Group>
            </Segment>
        );
    }
}


export default MessageForm;