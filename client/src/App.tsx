import { Routes, Route } from "react-router";
import Home from "./pages/home";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import "./style.css";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import Profile from "./pages/profile";
import Layout from "./layout/layout";
import AuthGoogle from "./pages/authGoogle";
import PrivateRoute from "./components/privateRoute";
import PublicRoute from "./components/publicRoute";
import Chat from "./pages/chat";

function App() {
  const { checkAuthStatus } = useAuthStore();

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />

          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/chat" element={<Chat />} />
          </Route>
        </Route>
        <Route path="/auth-google" element={<AuthGoogle />} />
      </Routes>
    </>
  );
}

export default App;
