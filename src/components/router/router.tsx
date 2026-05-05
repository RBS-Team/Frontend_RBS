import {Routes, Route, Navigate, useNavigate} from "react-router-dom";
import Collections from "../../pages/Collections/collections";
import { useAuth } from "../../context/AuthContext";
import {MasterRegistration} from "../master/MasterRegistration";
import {PrivateRoute} from "./privateRoute";
import {MasterDashboard} from "../master/MasterDashboard";
import {SmartSearch} from "../SmartSearch/SmartSearch";
import {CategoriesView} from "../CategoryViews/CategoryViews";
import {CategoryMasters} from "../CategoryMasters/CategoryMasters";


export default function AppRouter() {
    const { user, loading } = useAuth();
    if (loading) return null;
    return (
        <Routes>

            <Route path="/" element={<Collections />} />
            <Route path="/category/:id" element={<CategoryMasters />} />


            <Route path="/master/dashboard" element={
                <PrivateRoute user={user} loading={loading}>
                <MasterDashboard/>
                </PrivateRoute>
            }/>

            <Route path="/smart-search" element={
                    <SmartSearch/>
            }/>

            <Route path="/services" element={
                <CategoriesView/>
            }/>

            <Route path="/master/register" element={
                    <MasterRegistration />
            }/>

            <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
    );
}