import React, { Fragment } from 'react';
import firebase from '../../firebase';
import {connect} from 'react-redux';
import {setCurrentChannel} from '../../actions';
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';

class Channels extends React.Component {


    state = {
        firstLoad: true,
        activeChannel: '',
        channels: [],
        modal: false,
        channelName: '',
        channelDetails: '',
        channelsRef: firebase.database().ref('channels'),
        user: this.props.currentUser

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
        })
    }

    setFirstChannel = () => {
        const firstChannel = this.state.channels[0];
        if(this.state.firstLoad && this.state.channels.length > 0) {
            this.props.setCurrentChannel(firstChannel);
            this.setActiveChannel(firstChannel);
        }
        this.setState({firstLoad: false})
    }

    setActiveChannel = (channel) => {
        this.setState({activeChannel: channel.id})
    }
    
    changeChannel = (channel) => {
        this.setActiveChannel(channel)
        this.props.setCurrentChannel(channel)
    }

    displayChannels = (channels) => (
        channels.length > 0 && channels.map(channel => (
            <Menu.Item
                key={channel.id}
                name={channel.name}
                onClick={this.changeChannel}
                active = {channel.id === this.state.activeChannel}
            >
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
                <Menu.Menu style={{ paddingBottom: '2em' }}>
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


export default connect(null,{setCurrentChannel}) (Channels);