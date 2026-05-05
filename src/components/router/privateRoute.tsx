import { Navigate } from "react-router-dom";

interface Props {
    user: any;
    loading: boolean;
    children: React.ReactNode;
}

export function PrivateRoute({ user, loading, children }: Props) {
    if (loading) return null;

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return children;
}