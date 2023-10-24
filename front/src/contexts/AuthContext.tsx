import React, { createContext, useReducer, useContext } from 'react';

const initialState = {
    token: null as string | null,
    user: null as any,
    isLogged: false as boolean | undefined,
};

type State = typeof initialState;

type Action =
    | { type: 'LOGIN'; payload: { token: string; user: any; isLogged?: boolean } }
    | { type: 'LOGOUT' };

const AuthContext = createContext<{
    state: State;
    dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

function authReducer(state: State, action: Action): State {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                token: action.payload.token,
                user: action.payload.user,
                isLogged: action.payload.isLogged,
            };
        case 'LOGOUT':
            return initialState;
        default:
            return state;
    }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth должен быть использован внутри AuthProvider');
    }
    return context;
};