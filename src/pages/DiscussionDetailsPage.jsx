import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  getDiscussion,
  getComments,
  addComment,
  deleteComment,
} from "../services/discussionService";
import { FaArrowLeft } from "react-icons/fa";
import MainLayout from "../layouts/MainLayout";
import "./DiscussionDetailsPage.css";
import { Timestamp } from "firebase/firestore";

function formatDate(ts) {
  if (!ts) return "";
  // Firestore Timestamp
  if (ts instanceof Timestamp || ts?.toDate) {
    return (ts.toDate ? ts.toDate() : ts).toLocaleString();
  }
  // plain JS Date
  if (ts instanceof Date) {
    return ts.toLocaleString();
  }
  // fallback (ISO string etc)
  return new Date(ts).toLocaleString();
}

export default function DiscussionDetailsPage() {
  const { postId } = useParams();
  const { user } = useAuth();

  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const fetchedPost = await getDiscussion(postId);
      const fetchedComments = await getComments(postId);
      setPost(fetchedPost);
      setComments(fetchedComments);
    };
    fetchData();
  }, [postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    await addComment(postId, commentText, user.displayName || user.email);
    setCommentText("");

    const updatedComments = await getComments(postId);
    setComments(updatedComments);
  };

  const handleDeleteComment = async (commentId) => {
    // remove from Firestore
    await deleteComment(postId, commentId);
    // update local state
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  return (
    <MainLayout>
      <div className="discussion-details">
        {post && (
          <div className="post-section">
            <FaArrowLeft
              onClick={() => navigate(-1)}
              style={{ cursor: "pointer", marginRight: "0.5rem" }}
            />
            <h2>{post.title}</h2>
            <p className="content">{post.content}</p>
            <p className="author">
              By {post.authorName} — {formatDate(post.createdAt)}
            </p>
          </div>
        )}

        <div className="comments-section">
          <h3>Comments</h3>
          {comments.map((c) => (
            <div className="comment-card" key={c.id}>
              <p className="comment-text">{c.text}</p>
              <div className="comment-meta">
                <span>{c.createdBy}</span>
                <span>{formatDate(c.createdAt)}</span>
              </div>
              {c.createdBy === (user.displayName || user.email) && (
                <button
                  className="comment-delete-btn"
                  onClick={() => handleDeleteComment(c.id)}
                >
                  Delete
                </button>
              )}
            </div>
          ))}

          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <textarea
              placeholder="Write a comment..."
              required
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button type="submit">Post Comment</button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
