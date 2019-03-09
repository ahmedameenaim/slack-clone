import React from 'react';
import { Icon, Input, Segment, Header } from 'semantic-ui-react'

class MessagsHeader extends React.Component {
    render() {
        return (
            <Segment clearing>
                <Header as="h2" fluid="true" floated="left" style={{ marginBottom: 0 }}>
                    <span>
                        Channel
                    <Icon name={"star outline"} color="black" />
                    </span>
                    <Header.Subheader>2 Users</Header.Subheader>
                </Header>
                <Header floated = "right">
                  <Input 
                      size = "mini"
                      icon = "search"
                      name = "searchTerm"
                      placeholder = "Search Messages.."
                  />
                </Header>
            </Segment>
        );
    }
}



export default MessagsHeader;