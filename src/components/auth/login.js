import React from 'react';
import firebase from '../../firebase';
import { Grid, Form, Button, Header, Message, Icon, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class Login extends React.Component {

    state = {
        email: '',
        password: '',
        errors: [],
        loading: false
    };

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }

    handleErrorInput = (errors, nameInput) => {
        return errors.some(error => error.message.toLowerCase().includes(nameInput) ? "error" : "")
    }

    displayErrors = errors => errors.map((error, index) => <p key={index}>{error.message}</p>)


    isFormValid = ({email , password}) => {
        let errors = [];
        let error;
        if( password.length < 6 ) {
          error = {message: 'password must be at least 6 characters'}
          this.setState({errors: errors.concat(error)})
          return false;
        } else if (!email.includes('.com')) {
            error = {message: 'enter a valid email'}
            this.setState({errors: errors.concat(error)})
            return false;
        }
        return true
    }

    handleSubmit = async event => {
        event.preventDefault();
        if (this.isFormValid(this.state)) {
            this.setState({ errors: [], loading: true })
            try {

                const signedUser = await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
                console.log(signedUser)
                console.log('User signIn!')
                this.setState({ loading: false })

            }
            catch (error) {
                console.error(error)
                this.setState({ errors: this.state.errors.concat(error), loading: false })
            }
        }
    }



    render() {
        //Desrcuting our State
        const { email, password ,loading, errors } = this.state;

        return (
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as="h1" color="violet" textaling="center">
                        <Icon color="violet" name="code branch" />
                        Login For DevChat
                    </Header>
                    <Form size="large" onSubmit={this.handleSubmit}>
                        <Segment stacked>
                            <Form.Input fluid name="email" icon="mail" iconPosition="left" value={email} className={this.handleErrorInput(errors, 'email')}
                                placeholder="Enter your email" type="email" onChange={this.handleChange} />
                            <Form.Input name="password" fluid icon="lock" iconPosition="left" value={password} className={this.handleErrorInput(errors, 'password')}
                                placeholder="Type your password" type="password" onChange={this.handleChange} />
                            <Button color="violet" fluid size="large" className={loading ? 'loading' : ''} disabled={loading}>Login</Button>
                        </Segment>
                    </Form>
                    {this.state.errors.length > 0 && <Message error>
                        <h3>Errors</h3>
                        {this.displayErrors(this.state.errors)}
                    </Message>}
                    <Message>Haven't account? <Link to="/register">create one</Link></Message>
                </Grid.Column>
            </Grid>
        );
    }
}

export default Login;