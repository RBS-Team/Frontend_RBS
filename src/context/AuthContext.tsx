import { createContext, useContext } from "react";
import { useAuth as useAuthHook } from "../hooks/useAuth.ts";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const auth = useAuthHook();
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}