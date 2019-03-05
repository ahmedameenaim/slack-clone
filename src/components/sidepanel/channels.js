import React, { Fragment } from 'react';
import firebase from '../../firebase';
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';

class Channels extends React.Component {


    state = {
        channels: [],
        modal: false,
        channelName: '',
        channelDetails: '',
        channelsRef: firebase.database().ref('channels'),
        user: this.props.currentUser

    }

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
            const channelAdd = await channelsRef.child(key).update(payload);
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


export default Channels;