import { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import {apiFetch} from "../api/apiFetch.ts";

interface User {
    id: string;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem("user");

        if (!stored || stored === "undefined" || stored === "null") {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const parsed = JSON.parse(stored);
            setUser(parsed);
        } catch {
            localStorage.removeItem("user");
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const logout = async () => {
        try {
            await apiFetch("/logout", { method: "POST" });
        } catch (e) {
            console.error(e);
        } finally {
            setUser(null);
            localStorage.removeItem("user");
        }
    };

    return { user, login, logout, loading };
}