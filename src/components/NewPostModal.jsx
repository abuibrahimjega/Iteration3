import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "./NewPostModal.css";

export default function NewPostModal({ isOpen, onClose, onPostCreated }) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    // 1) Create the Firestore doc
    const docRef = await addDoc(collection(db, "discussions"), {
      title,
      content,
      createdById: user.uid,
      authorName: user.displayName,
      createdAt: serverTimestamp(),
    });

    // 2) Build a local post object
    const newPost = {
      id: docRef.id,
      title,
      content,
      createdById: user.uid,
      authorName: user.displayName,
      createdAt: new Date(),
    };

    // 3) Reset form & close modal
    setTitle("");
    setContent("");
    onClose();

    // 4) Notify parent
    onPostCreated?.(newPost);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Create New Post</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="modal-input"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            className="modal-textarea"
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <div className="modal-actions">
            <button type="submit" className="submit-btn">
              Post
            </button>
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
