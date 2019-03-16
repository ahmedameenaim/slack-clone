import React, { Fragment } from 'react';
import firebase from '../../firebase';
import {connect} from 'react-redux';
import {setCurrentChannel , setPrivateChannel} from '../../actions';
import { Menu, Icon, Modal, Form, Input, Button , Label } from 'semantic-ui-react';

class Channels extends React.Component {


    state = {
        firstLoad: true,
        activeChannel: '',
        channel: '',
        channels: [],
        modal: false,
        channelName: '',
        channelDetails: '',
        messagesRef: firebase.database().ref('messages'),
        channelsRef: firebase.database().ref('channels'),
        user: this.props.currentUser,
        notifications: []

    }

    componentDidMount() {
        this.addListeners();
    }

    componentWillUnmount() {
        this.removeListeners();
    }

    removeListeners = () => {
        this.state.channelsRef.off()
    }

    addListeners = () => {
        const loadedChannels = [];
        this.state.channelsRef.on('child_added', channel => {
            loadedChannels.push(channel.val())
            this.setState({ channels: loadedChannels } , () => this.setFirstChannel());
            this.addNotificationsListener(channel.key);
        })
    }

    addNotificationsListener = channelId => {
        this.state.messagesRef.child(channelId).on('value' , snap => {
            if(this.state.channel) {
                this.handleNotifications(channelId , this.state.channel.id , this.state.notifications , snap);
            }
        })
    }

    handleNotifications = (channelId , currentChannelId , notifications , snap) => {
        let lastTotal = 0;
        let index = notifications.findIndex(notifications => notifications.id === channelId)

        if(index !== -1) {
            if(channelId !== currentChannelId) {
                lastTotal = notifications[index].total;
                
                if(snap.numChildren() - lastTotal > 0) {
                    notifications[index].count = snap.numChildren() - lastTotal;
                }
            }
            notifications[index].lastKnownTotal = snap.numChildren()

        }else {
            notifications.push({
                id: channelId,
                total: snap.numChildren(),
                lastKnownTotal: snap.numChildren,
                count: 0
            })
        }

        this.setState({notifications})
    }

    setFirstChannel = () => {
        const firstChannel = this.state.channels[0];
        if(this.state.firstLoad && this.state.channels.length > 0) {
            this.props.setCurrentChannel(firstChannel);
            this.setActiveChannel(firstChannel);
            this.setState({channel: firstChannel})
        }
        this.setState({firstLoad: false})
    }

    setActiveChannel = (channel) => {
        this.setState({activeChannel: channel.id})
    }
    
    changeChannel = (channel) => {
        this.setActiveChannel(channel)
        this.clearNotifications()
        this.props.setCurrentChannel(channel)
        this.props.setPrivateChannel(false)
        this.setState({channel})
    }

    clearNotifications = () => {
        let index = this.state.notifications.findIndex(notification => notification.id === this.state.channel.id)

        if(index !== -1) {
            let updatedNotifications = [...this.state.notifications];
            updatedNotifications[index].total = this.state.notifications.lastKnownTotal;
            updatedNotifications[index].count = 0;
            this.setState({notifications: updatedNotifications})

        }
    }

    getNotificationCount = channel => {
      let  count = 0;
        this.state.notifications.forEach(notification => {
            if(notification.id === channel.id) {
               count = notification.count;
            }
    })
    if(count > 0) return count;
    }

    displayChannels = (channels) => (
        channels.length > 0 && channels.map(channel => (
            <Menu.Item
                key={channel.id}
                name={channel.name}
                onClick={this.changeChannel}
                active = {channel.id === this.state.activeChannel}
            >
            {this.getNotificationCount(channel) && (<Label color = "red">{this.getNotificationCount(channel)}</Label>)}
                # {channel.name}
            </Menu.Item>
        ))
    )

    addChannel = async () => {
        const { channelsRef, channelName, channelDetails, user } = this.state;
        const key = channelsRef.push().key;

        const payload = {
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy: {
                name: user.displayName,
                avatar: user.photoURL
            }
        }

        try {
            await channelsRef.child(key).update(payload);
            this.setState({ channelName: '', channelDetails: '' });
            this.onClose();
            console.log('A Channel Add...!');
        } catch (error) {
            console.error(error)
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if (this.isFormValid(this.state)) {
            this.addChannel();
        }
    }

    onChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    isFormValid = ({ channelName, channelDetails }) => channelName && channelDetails;

    onOpen = () => this.setState({ modal: true });

    onClose = () => this.setState({ modal: false });

    render() {
        return (
            <Fragment>
                <Menu.Menu className = "menu">
                    <Menu.Item>
                        <span>
                            <Icon name="exchange" />Channels
                    </span> {' '}
                        ({this.state.channels.length}) <Icon name="add" onClick={this.onOpen} />
                    </Menu.Item>
                    {this.displayChannels(this.state.channels)}
                </Menu.Menu>

                {/* //Add Channel Modal */}
                <Modal basic open={this.state.modal} onClose={this.onClose}>
                    <Modal.Header>Add a Channel</Modal.Header>
                    <Modal.Content>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Field>
                                <Input
                                    fluid
                                    label="name of channel"
                                    name="channelName"
                                    onChange={this.onChange}
                                />
                            </Form.Field>

                            <Form.Field>
                                <Input
                                    fluid
                                    label="About the channel"
                                    name="channelDetails"
                                    onChange={this.onChange}
                                />
                            </Form.Field>
                        </Form>
                    </Modal.Content>

                    <Modal.Actions>
                        <Button basic color='green' inverted onClick={this.handleSubmit}>
                            <Icon name='checkmark' /> Add
                 </Button>

                        <Button basic color='red' inverted onClick={this.onClose}>
                            <Icon name='remove' /> Cancel
                 </Button>
                    </Modal.Actions>
                </Modal>
            </Fragment>
        );
    }
}


export default connect(null,{setCurrentChannel , setPrivateChannel}) (Channels);