import React from "react";
import { useNavigate } from "react-router-dom";
import "./PostCard.css";

export default function PostCard({ post, currentUserId, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="post-card">
      <div className="post-header">
        <span className="post-author">{post.authorName}</span>
        {post.authorId === currentUserId && (
          <button onClick={() => onDelete(post.id)}>Delete</button>
        )}
      </div>
      <p className="post-content">{post.content}</p>
      <button onClick={() => navigate(`/discussion/${post.id}`)}>
        View Comments
      </button>
    </div>
  );
}
