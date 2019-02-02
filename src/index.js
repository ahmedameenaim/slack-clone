import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Login from './components/auth/login';
import Register from './components/auth/register';
import firebase from './firebase';
import { BrowserRouter as Router, Switch, Route, withRouter } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import 'semantic-ui-css/semantic.min.css'

class Root extends React.Component {
    componentDidMount() {
        firebase.auth.onAuthStateChanged(user => {
            if (user) {
                this.props.history.push('/')
            }
        })
    }
    render() {
        return (
            <Switch>
                <Route exact path='/' component={App} />
                <Route path='/login' component={Login} />
                <Route path='/register' component={Register} />
            </Switch>
        )
    }
}

const RootWithAuth = withRouter(Root)

ReactDOM.render(<Router>
<RootWithAuth />
</Router>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
