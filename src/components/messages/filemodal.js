import React from 'react';
import { Button, Modal, Icon, Input } from 'semantic-ui-react';
import mime from 'mime-types';



class FileModal extends React.Component {
    
    state = {
        file: null,
        authorized: ['image/jpeg' , 'image/png']
    };

    addFile = (event) => {
        const file = event.target.files[0]
        if(file) {
            this.setState({file})
        }
    };

    clearFile = () => this.setState({file : null})


    sendFile = () => {
        const {file} = this.state;

        if(file !== null) {
            if(this.isAuthorized(file.name)) {
                //send file
                const metadata = {contentType: mime.lookup(file.name)}
                this.props.fileUpload(file , metadata);
                this.props.closeModal();
                this.clearFile();
            }
        }
    }

    isAuthorized = (filename) => {
     return  this.state.authorized.includes(mime.lookup(filename));
    }


    render() {
        const { modal, closeModal } = this.props;
        return (
            <Modal basic open={modal} onClose={closeModal}>
                <Modal.Header> Select an Image File </Modal.Header>
                <Modal.Content>
                    <Input
                    onChange = {this.addFile}
                        fluid
                        label="File types: jpg , png"
                        name="file"
                        type="file"
                    />
                </Modal.Content>
                <Modal.Actions>
                    <Button color="green" inverted onClick = {this.sendFile}>
                        <Icon name="checkmark" /> Send
              </Button>
                    <Button color="red" inverted onClick={closeModal}>
                        <Icon name="remove" /> Cancel
              </Button>
                </Modal.Actions>
            </Modal>
        );
    }
}


export default FileModal;