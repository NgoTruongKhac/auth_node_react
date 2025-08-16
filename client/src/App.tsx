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
import { useThemeStore } from "./store/useThemeStore";

function App() {
  const { checkAuthStatus } = useAuthStore();

  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  useEffect(() => {
    // Gán thuộc tính data-theme cho thẻ <html>
    document.documentElement.setAttribute("theme", theme);
  }, [theme]);

  return (
    <>
      <div data-theme={theme} className="flex justify-center">
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
      </div>
    </>
  );
}

export default App;
