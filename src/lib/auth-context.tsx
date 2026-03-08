import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
} from "react";
import { authAPI, type UserProfile } from "./api";

interface AuthContextType {
    user: UserProfile | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: Record<string, unknown>) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshUser = useCallback(async () => {
        const token = localStorage.getItem("phxnorth_token");
        if (!token) {
            setUser(null);
            setIsLoading(false);
            return;
        }
        try {
            const profile = await authAPI.getMe();
            setUser(profile);
        } catch {
            localStorage.removeItem("phxnorth_token");
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    const login = async (email: string, password: string) => {
        const response = await authAPI.login(email, password);
        localStorage.setItem("phxnorth_token", response.access_token);
        await refreshUser();
    };

    const register = async (data: Record<string, unknown>) => {
        const response = await authAPI.register(data);
        localStorage.setItem("phxnorth_token", response.access_token);
        await refreshUser();
    };

    const logout = () => {
        localStorage.removeItem("phxnorth_token");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                register,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
