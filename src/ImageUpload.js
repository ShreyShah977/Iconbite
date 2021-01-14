import { Button } from '@material-ui/core'
import React, { useState } from 'react'
import {storage, db} from "./firebase";
import firebase from "firebase";
import './ImageUpload.css';


function ImageUpload({username}) {
    const [imageFile, setImageFile] = useState(null);
    // const [url, setUrl] = useState('');
    const [currentProgress, setcurrentProgress] = useState(0);
    const [tagLine, setTagLine] = useState('');


    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };
    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${imageFile.name}`).put(imageFile);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // Progress updater
                const currentProgress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setcurrentProgress(currentProgress);
            },

            // Second part: Error Handling

            (error) => {
                console.log(error);
                alert(error.message); // < -- remove in prod
            },

            () => {
            // Wrapping it up
                storage
                .ref("images")
                .child(imageFile.name)
                .getDownloadURL()
                .then(url => {
                    // Post uploaded image inside DB
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        imageSrc: url,
                        tagLine: tagLine,
                        username: username
                    });

                    setcurrentProgress(0);
                    setImageFile(null);
                    setTagLine("");

                });




            }

        );
    };
    return (
        <div className="imageUpload">
            <progress className="imageUpload__progress" value={currentProgress} max="100"></progress>
            <input 
                type="text"
                placeholder='Share your thoughts to the world!'
                onChange={event => setTagLine(event.target.value)}
                value={tagLine}
            >
            </input>

            <input
                type="file"
                onChange={handleChange}
            >
            </input>
            <Button onClick={handleUpload}>
            <p className='imageUpload_UploadButton'>Upload Post</p>
            </Button>



        </div>
    )
}

export default ImageUpload
