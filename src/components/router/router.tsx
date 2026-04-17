import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../../pages/Authorization/Login/Login";
import Registration from "../../pages/Authorization/Registration/Registration";
import Collections from "../../pages/Collections/collections";
import { useAuth } from "../../context/AuthContext";
import MastersList from "../../pages/MastersList/masters_list.tsx";
import MastersRegistration from "../../pages/Authorization/Masters/Registration/Registration";
import MasterProfile from "../../pages/Profile/Master/profile_master";

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
                path="/registration/master"
                element={!user ? <MastersRegistration onLogin={login} /> : <Navigate to="/" replace />}
            />
            <Route
                path="/categories/:id"
                element={user ? <MastersList /> : <Navigate to="/registration" replace />}
            />
            <Route
                path="/profile"
                element={user ? <MasterProfile /> : <Navigate to="/registration" replace />}
            />

            <Route
                path="/*"
                element={user ? <Collections /> : <Navigate to="/registration" replace />}
            />


        </Routes>
    );
}