import React from 'react';
import { Icon, Input, Segment, Header } from 'semantic-ui-react'

class MessagsHeader extends React.Component {
    render() {
        const { channelName, numUniqueUsers, handelSearchChange, searchLoading , privateChannel , handleStar , isChannelStarred} = this.props;
        return (
            <Segment clearing>
                <Header as="h2" fluid="true" floated="left" style={{ marginBottom: 0 }}>
                    <span>
                        {channelName}
                        {!privateChannel && (<Icon onClick = {handleStar} name={isChannelStarred ? 'star': 'star outline'} color= {isChannelStarred ? 'yellow': 'black'} />)}
                    </span>
                    <Header.Subheader>{numUniqueUsers}</Header.Subheader>
                </Header>
                <Header floated="right">
                    <Input
                        loading={searchLoading}
                        onChange={handelSearchChange}
                        size="mini"
                        icon="search"
                        name="searchTerm"
                        placeholder="Search Messages.."
                    />
                </Header>
            </Segment>
        );
    }
}



export default MessagsHeader;