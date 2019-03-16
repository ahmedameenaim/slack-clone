import React from 'react';
import { Progress } from 'semantic-ui-react';

const ProgressBar = ({ uploadState, precentendUploaded }) => {

    return (
        uploadState && (
            <Progress
                className="progress__bar"
                precent={precentendUploaded}
                progress
                indicating
                size="medium"
                inverted
            />
        )
    );
}




export default ProgressBar;