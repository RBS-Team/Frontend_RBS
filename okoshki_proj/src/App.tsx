import { useAuth } from "./hooks/useAuth";
import AppRouter from "./components/router/router.tsx";

export default function App() {
    const { user, login, logout } = useAuth();

    return <AppRouter user={user} login={login} logout={logout} />;
}