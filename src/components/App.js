import React from 'react';
import './App.css';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import MetaPanel from './metapanel/metapanel';
import ColorPanel from './colorpanel/color.panel';
import SidePanel from './sidepanel/sidepanel';
import Messages from './messages/messages';;



const App = ({currentUser}) => (
  <Grid columns = "equal" className = "app" style = {{background: '#eee'}}>
    <ColorPanel />
    <SidePanel  currentUser = {currentUser}/>

    <Grid.Column style = {{marginLeft: 320}}> 
    <Messages /> 
    </Grid.Column>
     
     <Grid.Column style = {{width: 4}}>
     <MetaPanel />
     </Grid.Column>
    
  </Grid>

)

const mapStateToProps = state => ({
  currentUser: state.user.currentUser
})

export default connect(mapStateToProps)(App);
