import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../../pages/Authorization/Login/Login";
import Registration from "../../pages/Authorization/Registration/Registration";
import Collections from "../../pages/Collections/collections";
import { useAuth } from "../../context/AuthContext";

export default function AppRouter() {
    const { user, login, loading } = useAuth();

    if (loading) return null;

    return (
        <Routes>
            <Route
                path="/login"
                element={!user ? <Login onLogin={login} /> : <Navigate to="/" replace />}
            />
            <Route
                path="/registration"
                element={!user ? <Registration onLogin={login} /> : <Navigate to="/" replace />}
            />
            <Route
                path="/*"
                element={user ? <Collections /> : <Navigate to="/login" replace />}
            />
        </Routes>
    );
}