import React from 'react';
import './App.css';
import { Grid } from 'semantic-ui-react';
import MetaPanel from './metapanel/metapanel';
import ColorPanel from './colorpanel/color.panel';
import SidePanel from './sidepanel/sidepanel';
import Messages from './messages/messages';;



const App = () => (
  <Grid columns = "equal" className = "app" style = {{background: '#eee'}}>
    <ColorPanel />
    <SidePanel />

    <Grid.Column style = {{marginLeft: 320}}> 
    <Messages /> 
    </Grid.Column>
     
     <Grid.Column style = {{width: 4}}>
     <MetaPanel />
     </Grid.Column>
    
  </Grid>

)

export default App;
