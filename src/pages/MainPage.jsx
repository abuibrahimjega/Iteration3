import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NewPostModal from "../components/NewPostModal";
import { getAllPosts } from "../services/discussionService";
import { getResources, subscribeResources } from "../services/resourceService";
import "./MainPage.css";
import MainLayout from "../layouts/MainLayout";

export default function MainPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [resources, setResources] = useState([]);

  // Fetch discussions and resources
  useEffect(() => {
    // fetch latest posts
    const fetchPosts = async () => {
      const allPosts = await getAllPosts();
      setPosts(allPosts);
    };
    fetchPosts();

    // fetch current resources once
    getResources().then(setResources);
    // subscribe to real-time updates for resources
    const unsubRes = subscribeResources(setResources);

    return () => {
      unsubRes();
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <MainLayout>
      <div className="iframe-container">
        <iframe
          src="http://localhost:8080/"
          title="Virtual Omrah"
          className="omrah-iframe"
          allowFullScreen
        />
      </div>

      {/* Discussions Section */}
      <section className="section discussions">
        <div className="discussions-header">
          <h2 className="clickable" onClick={() => navigate("/discussions")}>
            Discussions
          </h2>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            New Post +
          </button>
        </div>

        <div className="card-grid">
          {posts.slice(0, 3).map((post) => (
            <div
              className="card"
              key={post.id}
              onClick={() => navigate(`/discussion/${post.id}`)}
              style={{ cursor: "pointer" }}
            >
              <h3>{post.title}</h3>
              <p className="preview">{post.content}</p>
              <div className="meta">
                <span>By {post.authorName || post.createdBy}</span>
                <span>{post.createdAt?.toDate().toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <button
            className="btn-primary"
            onClick={() => navigate("/discussions")}
          >
            View All Discussions
          </button>
        </div>
      </section>

      {/* Educational Resources Section */}
      <section className="section resources">
        <div className="resources-header">
          <h2>Educational Resources</h2>
        </div>
        <ul className="resources-list">
          {resources.map((r) => (
            <li key={r.id} className="resource-card">
              <a href={r.url} target="_blank" rel="noopener noreferrer">
                {r.title}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <NewPostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </MainLayout>
  );
}
