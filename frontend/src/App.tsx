import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Signup from "./pages/SIgnup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import useAuthStore from "./store/authstore";
import Settings from "./pages/Settings";
import NavBar from "./components/Navbar";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import useThemeStore from "./store/themeStore";

const App = () => {
    const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
    const { theme } = useThemeStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isCheckingAuth && !authUser) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader className="size-10 animate-spin" />
            </div>
        );
    }
    return (
        <div data-theme={theme}>
            <Toaster />
            <NavBar />
            <Routes>
                <Route
                    path="/"
                    element={
                        authUser ? <HomePage /> : <Navigate to={"/login"} />
                    }
                />
                <Route
                    path="/signup"
                    element={!authUser ? <Signup /> : <Navigate to={"/"} />}
                />
                <Route
                    path="/login"
                    element={!authUser ? <Login /> : <Navigate to={"/"} />}
                />
                <Route
                    path="/profile"
                    element={
                        authUser ? <Profile /> : <Navigate to={"/login"} />
                    }
                />
                <Route path="/settings" element={<Settings />} />
            </Routes>
        </div>
    );
};

export default App;
