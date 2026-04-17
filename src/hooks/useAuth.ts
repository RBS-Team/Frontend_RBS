import { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import {apiFetch} from "../api/apiFetch.ts";

interface User {
    id: string;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadUser = () => {
            try {
                const stored = localStorage.getItem("user");

                if (!stored || stored === "undefined" || stored === "null") {
                    setUser(null);
                    localStorage.removeItem("user");
                    return;
                }

                const parsedUser = JSON.parse(stored);

                if (parsedUser && typeof parsedUser === "object" && 'id' in parsedUser && typeof parsedUser.id === 'string') {
                    setUser(parsedUser);
                } else {
                    console.warn("Invalid user data structure:", parsedUser);
                    localStorage.removeItem("user");
                    setUser(null);
                }
            } catch (error) {
                console.error("Failed to parse user from localStorage:", error);
                localStorage.removeItem("user");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = (userData: User) => {
        if (!userData.id ) return;
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const logout = async () => {
        try {
            await apiFetch("/logout", {
                method: "POST",
            });
        } catch (error) {
            console.error("Logout request failed:", error);
        } finally {
            setUser(null);
            localStorage.removeItem("user");
            navigate("/login", { replace: true });
        }
    };

    return { user, login, logout, loading };
}