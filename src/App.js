import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import MainPage from "./pages/MainPage";
import DiscussionsPage from "./pages/DiscussionsPage";
import DiscussionDetailsPage from "./pages/DiscussionDetailsPage";
import AdminResourcesPage from "./pages/AdminResourcesPage";
import UmrahTour from "./components/UmrahTour";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/home" element={<MainPage />} />
      <Route path="/umrah-tour" element={<UmrahTour />} />
      <Route path="/discussions" element={<DiscussionsPage />} />
      <Route path="/discussion/:postId" element={<DiscussionDetailsPage />} />
      <Route path="/admin/resources" element={<AdminResourcesPage />} />
      {}
    </Routes>
  );
}

export default App;
