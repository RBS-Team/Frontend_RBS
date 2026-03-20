import { Routes, Route } from "react-router-dom";
import Login from "../../pages/Authorization/Login/Login";
import Registration from "../../pages/Authorization/Registration/Registration";
import CheckRoute from "./check_route.tsx";
import Collections from "../../pages/Collections/collections.tsx";
import GuestRoute from "./GuestRoute.tsx";


export default function AppRouter({ user, login }: any) {
    return (
        <Routes>
            <Route path="/login" element={
                <GuestRoute user={user}>
                <Login onLogin={login} />
                </GuestRoute>
            } />



            <Route path="/registration" element={
                <GuestRoute user={user}>
                <Registration onLogin={login} />
                </GuestRoute>
            } />


            <Route
                path="/*"
                element={
                    <CheckRoute user={user}>
                        <Collections />
                    </CheckRoute>
                }
            />


        </Routes>
    );
}