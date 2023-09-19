import { signOut } from "firebase/auth"
import { database } from "../../FireBaseConfig"
import { useNavigate } from "react-router-dom";
import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone'
import { db, storage } from "../../firebase";
import { addDoc, arrayUnion, collection, doc, serverTimestamp, updateDoc , query, where, getDocs, orderBy} from "firebase/firestore";
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";
import Posts from "../Posts/Posts";
import "./Home.css"
import SearchResult from "../Posts/SearchResult";
// import searchResult from "../Posts/SearchResult"

// import { preview } from "vite";

const Home = () => {
    const [selectedImage, setSelectedImage] = useState([]);
    const [selectedTag, setSelectedTag] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [searchResults, setSearchResults] = useState([]);

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
        borderColor: '#f1356d',
        borderStyle: 'dashed',
        backgroundColor: '#fafafa40',
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

    const handleTagChange = (event) => {
        setSelectedTag(event.target.value);
    };
    const searchFirestore = async (tag) => {
        const collectionRef = collection(db, "posts");
        const q = query(collectionRef, orderBy("timestamp", "desc"), where("caption", "==", tag.toLowerCase()));
    
        const querySnapshot = await getDocs(q);
    
        const results = [];
        querySnapshot.forEach((doc) => {
            results.push({
                ...doc.data(),
                id: doc.id,
                timestamp: doc.data().timestamp?.toDate().getTime(),
            });
        });
    
        return results;
    };
    
    

    const handleSearchChange = (event) => {
        const value = event.target.value.toLowerCase(); // Convert search value to lowercase
        setSearchValue(value);
    
        // Search Firestore and update the searchResults state
        searchFirestore(value).then((results) => {
            setSearchResults(results);
        });
    };

    const performSearch = async () => {
        const q = query(collection(db, "posts"), where("caption", "==", searchValue));
        const querySnapshot = await getDocs(q);
        const results = [];
        querySnapshot.forEach((doc) => {
            results.push(doc.data());
        });
        setSearchResults(results);
    };
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

    useEffect(() => {
        if (searchValue) {
            performSearch();
        } else {
            setSearchResults([]); // Clear results when searchValue is empty
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchValue]);

    return (
        <div className="home_wrapper">
            <div className="title">
                <h1>Drag n Drap Gallery</h1>
                <button onClick={handleClick}>signout</button>
            </div>
            <div className="DragPostWrappper">
                <div>
                    <div {...getRootProps({ style })}>
                        <input {...getInputProps()} />
                        <p>Drop the files here ...</p>
                    </div>

                    <input
                        className="search"
                        type="text"
                        placeholder="Search for a caption"
                        value={searchValue}
                        onChange={handleSearchChange}
                    />

                    <select ref={captionRef} className="tags" value={selectedTag} onChange={handleTagChange}>
                        <option value="">Select a tag</option>
                        <option value="tag 1">Tag 1</option>
                        <option value="tag 2">Tag 2</option>
                        <option value="tag 3">Tag 3</option>
                    </select>
                    <button onClick={uploadPost}>post</button>
                    {selected_images}
                </div>
                <SearchResult searchResults={searchResults} />
                <Posts />
            </div>
        </div>
    );
};

export default Home;
