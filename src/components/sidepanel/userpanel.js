import React from 'react';
import { Grid, Header, Icon, Dropdown , Image} from 'semantic-ui-react';
import firbase from '../../firebase';


class UserPanel extends React.Component {

    state = {
        user: this.props.currentUser
    }



    dropdownOptions = () => [
        {
            key: 'user',
            text: <span>Signed in as <strong>{this.state.user.displayName}</strong></span>,
            disabled: true
        },
        {
            key: 'avatar',
            text: <span>Change Avatar</span>
        },
        {
            key: 'signout',
            text: <span onClick={this.handleSignOut}>Sign Out</span>
        }
    ]

    handleSignOut = async () => {
        try {
            await firbase.auth().signOut()
            console.log('Sign Out!')
        } catch (e) {
            console.log(e)
        }

    }

    render() {
        return (
            <Grid style={{ background: '#4c3c4c' }}>
                <Grid.Column>
                    <Grid.Row style={{ padding: '1.2em', margin: 0 }}>
                        <Header inverted as="h2" floated="left">
                            <Icon name="code" />
                            <Header.Content>DevChat</Header.Content>
                        </Header>
                    </Grid.Row>
                    <Header as="h4" style={{ padding: '0.25rem' }} inverted>
                        <Dropdown trigger={
                        <span>
                        <Image avatar spaced = "right" src = {this.state.user.photoURL}/>
                        {this.state.user.displayName}
                        </span>} options={this.dropdownOptions()} />
                    </Header>
                </Grid.Column>
            </Grid>
        );
    }
}



export default UserPanel;