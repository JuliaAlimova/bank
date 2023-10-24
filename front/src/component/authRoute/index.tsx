import { useAuth } from "../../contexts/AuthContext";

import { Navigate } from "react-router-dom";

export const AuthRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const { state } = useAuth();

    if (state.token) {
        return <Navigate to="/balance" replace />;
    } else {
        return children;
    }
};
