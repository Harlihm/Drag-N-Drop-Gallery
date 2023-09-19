/* eslint-disable react/prop-types */
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import "./Posts.css";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

// eslint-disable-next-line react/prop-types
const SearchResult = ({searchResults}) => {
  const [posts, setPosts] = useState([]);

  const postImages = (post) => {
    const post_images = post.images?.map((file) => (
      <div key={file}>
        <img className="postImg" src={file} alt="Post" />
      </div>
    ));
    return post_images;
  };

  useEffect(() => {
    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setPosts(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          timestamp: doc.data().timestamp?.toDate().getTime(),
        }))
      );
    });

    return unsubscribe;
  }, []);

  // Function to handle the drag-and-drop reordering
  const onDragEnd = (result) => {
    if (!result.destination) return; // Dropped outside of the list

    const updatedPosts = [...posts];
    const [reorderedPost] = updatedPosts.splice(result.source.index, 1);
    updatedPosts.splice(result.destination.index, 0, reorderedPost);

    setPosts(updatedPosts);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable  droppableId="postsList" /* Provide a unique droppableId here */>
        {(provided) => (
          <div className="postlists" ref={provided.innerRef} {...provided.droppableProps}>
            {searchResults.map((post, index) => (
              <Draggable key={post.id} draggableId={post.id} index={index}>
                {(provided) => (
                  <div
                    className="cards"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <div className="caption">{post.caption}</div>
                    <div>{postImages(post)}</div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default SearchResult;
