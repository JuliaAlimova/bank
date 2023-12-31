import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import BalancePage from "../../page/balancePage";


export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth должен быть использован внутри AuthProvider');
    }

    return context;
};

export const AuthRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const { state } = useAuth();

    if (state.token && state.user.isConfirm) {
        return <BalancePage />
    } else {
        return <>{children}</>
    }

};
