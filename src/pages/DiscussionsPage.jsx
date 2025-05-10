import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext"; // ← import Auth
import NewPostModal from "../components/NewPostModal";
import { getAllPosts, deletePost } from "../services/discussionService"; // ← import deletePost
import MainLayout from "../layouts/MainLayout";
import { FaArrowLeft } from "react-icons/fa";
import "./DiscussionsPage.css";
import { Timestamp } from "firebase/firestore";

export default function DiscussionsPage() {
  const navigate = useNavigate();
  const { user } = useAuth(); // ← get the current user
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    (async () => {
      const all = await getAllPosts();
      setPosts(all);
    })();
  }, []);

  function formatDate(ts) {
    if (!ts) return "";
    if (ts instanceof Timestamp || ts?.toDate) {
      return (ts.toDate ? ts.toDate() : ts).toLocaleString();
    }
    if (ts instanceof Date) {
      return ts.toLocaleString();
    }
    return new Date(ts).toLocaleString();
  }

  // ← delete handler
  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    await deletePost(postId);
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  return (
    <MainLayout>
      <div className="discussions-wrapper">
        <div className="discussions-header">
          <h2>
            <FaArrowLeft
              onClick={() => navigate(-1)}
              style={{ cursor: "pointer", marginRight: "0.5rem" }}
            />
            Discussions
          </h2>
          <button onClick={() => setIsModalOpen(true)}>New Post</button>
        </div>

        <div className="post-list">
          {posts.map((post) => (
            <div
              className="post-card"
              key={post.id}
              onClick={() => navigate(`/discussion/${post.id}`)}
              style={{ cursor: "pointer" }}
            >
              <h3>{post.title}</h3>
              <p className="preview">{post.content}</p>
              <div className="meta">
                <span>By {post.authorName || post.createdBy}</span>
                <span>{formatDate(post.createdAt)}</span>
              </div>
              <div className="actions">
                {user.uid === post.createdById && (
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation(); // prevent card’s onClick
                      handleDelete(post.id);
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <NewPostModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onPostCreated={(newPost) => setPosts((p) => [newPost, ...p])}
        />
      </div>
    </MainLayout>
  );
}
