import React from "react";
import Button from 'react-bootstrap/Button';
import Peaks from 'peaks.js';
import Wave from './Wave';


class Player extends React.Component {

    state = {
        file: null
    }

    fileInput: React.RefObject<HTMLInputElement>;

    constructor(props: any) {
        super(props);
        this.fileInput = React.createRef();
    }

    handleChange() {
        console.log('change on input#file triggered');
        var file = this.fileInput.current!.files![0];
        console.log('file:' + file.name);

        var fileURL = window.URL.createObjectURL(file);
        console.log(file);
        console.log('File name: ' + file!.name);
        console.log('File type: ' + file!.type);
        console.log('File BlobURL: ' + fileURL);
        (document!.getElementById('audio')! as HTMLAudioElement).src = fileURL;
        this.forceUpdate();
    }

    render() {
        return (
            <div>
                <input id="audio_file" type="file" accept="audio/*" ref={this.fileInput} onChange={() => this.handleChange()}></input><br />
                <Wave />
            </div>
        );
    }


}


export default Player;