import { useAuth } from "../contexts/AuthContext";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import "./MainLayout.css";

export default function MainLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) setProfile(snap.data());
      }
    };
    fetchProfile();
  }, [user]);

  useEffect(() => {
    // Close menu when clicking outside
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="main-wrapper">
      <header className="topbar">
        <div className="logo-container">
          <img
            src="https://ui-avatars.com/api/?name=VU&background=000&color=D4AF37"
            alt="Virtual Umrah Logo"
          />
          <h1>Virtual Umrah</h1>
        </div>

        {user && (
          <nav className="nav-links">
            <NavLink to="/home" className="nav-link" activeclassname="active">
              Home
            </NavLink>
            <NavLink
              to="/discussions"
              className="nav-link"
              activeclassname="active"
            >
              Discussions
            </NavLink>
          </nav>
        )}

        <div className="user-info" ref={menuRef}>
          <div
            className="user-box"
            onClick={() => setShowMenu((prev) => !prev)}
          >
            <img
              src={
                user?.photoURL ||
                `https://ui-avatars.com/api/?name=${
                  profile?.firstName || "User"
                }`
              }
              alt="User Avatar"
              className="avatar"
            />
            <span>
              {profile?.firstName} {profile?.lastName}
            </span>
          </div>
          {showMenu && (
            <div className="dropdown-menu">
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
