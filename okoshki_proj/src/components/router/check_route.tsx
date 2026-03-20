import { Navigate } from "react-router-dom";

interface check_routeProps {
    user: any;
    children: JSX.Element;
}

export default function CheckRoute({ user, children }: check_routeProps) {
    if (!user) return <Navigate to="/login" replace />;
    return children;
}