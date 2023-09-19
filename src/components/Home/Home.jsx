import { signOut } from "firebase/auth"
import { database } from "../../FireBaseConfig"
import { useNavigate } from "react-router-dom";
import { useCallback, useMemo, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { db, storage } from "../../firebase";
import { addDoc, arrayUnion, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";
import Posts from "../Posts/Posts";
import "./Home.css"

// import { preview } from "vite";

const Home = () => {
    const [selectedImage, setSelectedImage] = useState([]);
    const history = useNavigate();
    const captionRef = useRef(null);
    const baseStyle = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        borderWidth: 2,
        borderRadius: 2,
        borderColor: '#eeeeee',
        borderStyle: 'dashed',
        backgroundColor: '#fafafa',
        color: '#bdbdbd',
        outline: 'none',
        transition: 'border .24s ease-in-out'
    };

    const focusedStyle = {
        borderColor: '#2196f3'
    };

    const acceptStyle = {
        borderColor: '#00e676'
    };

    const rejectStyle = {
        borderColor: '#ff1744'
    };

    const uploadPost = async () => {
        const docRef = await addDoc(collection(db, "posts"), {
            caption: captionRef.current.value,
            timestamp: serverTimestamp()
        })

        await Promise.all(
            selectedImage.map(image => {
                const imageRef = ref(storage, `posts/${docRef.id}/${image.path}`);
                uploadBytes(imageRef, image, "data_url").then(async () => {
                    const downloadURL = await getDownloadURL(imageRef)
                    await updateDoc(doc(db, "posts", docRef.id), {
                        images: arrayUnion(downloadURL)
                    })
                })
            })
        )
        captionRef.current.value = ""
        setSelectedImage([])
    }

    const handleClick = () => {
        // eslint-disable-next-line no-unused-vars
        signOut(database).then(val => {
            history("/");
        })
    }

    const onDrop = useCallback(acceptedFiles => {
        // Do something with the files
        setSelectedImage(acceptedFiles.map(file => Object.assign(file, { preview: URL.createObjectURL(file) })))
    }, [])
    const { getRootProps, getInputProps, isFocused,
        isDragAccept,
        isDragReject } = useDropzone({ onDrop, accept: { 'image/*': [] } });
    const style = useMemo(() => ({
        ...baseStyle,
        ...(isFocused ? focusedStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [
        isFocused,
        isDragAccept,
        isDragReject
    ]);
    const selected_images = selectedImage?.map(file => (
        <div key={file.name}>
            <img className="img" src={file.preview} alt={file.name} />
        </div>
    ))

    return (
        <div>
            <div>
                <h1>Drag n Drap Gallery</h1>
                <button onClick={handleClick}> signout</button>

            </div>
            <div className="DragPostWrappper">
                <div >
                    <div {...getRootProps({ style })}>
                        <input {...getInputProps()} />

                        <p>Drop the files here ...</p> :

                    </div>
                    <input type="text" placeholder="Enter a caption" ref={captionRef} /> <button onClick={uploadPost}>post</button>
                    {selected_images}
                </div>
                <Posts />
            </div>

        </div>


    )
}

export default Home
