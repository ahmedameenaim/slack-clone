import React from 'react';
import firebase from '../../firebase';
import { Grid, Form, Button, Header, Message, Icon, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class Register extends React.Component {

    state = {
        username: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        errors: []
    };

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }

    displayErrors = errors => errors.map((error,index) => <p key = {index}>{error.message}</p>)

    isFormEmpty = ({ username, password, email, passwordConfirmation }) => {
        return !username.length || !password.length || !email.length || !passwordConfirmation.length
    };

    isPasswordValid = ({password , passwordConfirmation}) => {
        if (password.length < 6 || passwordConfirmation.length < 6) {
            return false;
        } else if (password !== passwordConfirmation) {
            return false;
        }
        return true;
    }

    isFormValid = () => {
        let errors = []
        let error
        if (this.isFormEmpty(this.state)) {
            //throw Error
            error = { message: "fill all fields" }
            this.setState({ errors: errors.concat(error) })
            return false;
        } else if (!this.isPasswordValid(this.state)) {
            //throw Error
            error = {message: "password unvalid"}
            this.setState({errors: errors.concat(error)})
            return false;
        }
        return true
    }

    handleSubmit = async event => {
        event.preventDefault();
        if (this.isFormValid()) {
            try {
                const createdUser = await firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
                console.log(createdUser)
            }
            catch (error) {
                console.error(error)
            }
        }
    }



    render() {

        //Desrcuting our State
        const { username, email, password, passwordConfirmation } = this.state;

        return (
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as="h2" color="orange" textaling="center">
                        <Icon color="orange" name="puzzle piece" />
                        Register For DevChat
                    </Header>
                    <Form size="large" onSubmit={this.handleSubmit}>
                        <Segment stacked>
                            <Form.Input fluid name="username" icon="user" iconPosition="left" value={username}
                                placeholder="Enter your username" type="text" onChange={this.handleChange} />
                            <Form.Input fluid name="email" icon="mail" iconPosition="left" value={email}
                                placeholder="Enter your email" type="email" onChange={this.handleChange} />
                            <Form.Input name="password" fluid icon="lock" iconPosition="left" value={password}
                                placeholder="Type your password" type="password" onChange={this.handleChange} />
                            <Form.Input name="passwordConfirmation" fluid icon="repeat" iconPosition="left" value={passwordConfirmation}
                                placeholder="Type your passwordConfirm" type="password" onChange={this.handleChange} />
                            <Button color="orange" fluid size="large">Register</Button>
                        </Segment>
                    </Form>
                    {this.state.errors.length > 0 && <Message error>
                        <h3>Errors</h3>
                        {this.displayErrors(this.state.errors)}
                    </Message> }
                    <Message>Already a user? <Link to="/login">Sign In</Link></Message>
                </Grid.Column>
            </Grid>
        );
    }
}

export default Register;