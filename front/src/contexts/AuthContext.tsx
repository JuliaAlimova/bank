import React, { createContext, useReducer, useEffect } from 'react';

const currentTime = new Date().getTime();
const authStateFromLocalStorageStr = localStorage.getItem('authState');
const authStateFromLocalStorage = authStateFromLocalStorageStr ? JSON.parse(authStateFromLocalStorageStr) : null;

const initialState = authStateFromLocalStorage || {
    token: null as string | null,
    user: null as any,
    expirationTime: currentTime + 60 * 60 * 1000,
};

type State = typeof initialState;

type Action =
    | { type: 'LOGIN'; payload: { token: string; user: any; } }
    | { type: 'LOGOUT' };

export const AuthContext = createContext<{
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
            };
        case 'LOGOUT':
            return initialState;
        default:
            return state;
    }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        const savedState = localStorage.getItem('authState');

        if (savedState) {
            const parsedState = JSON.parse(savedState);
            const currentTime = new Date().getTime();

            if (currentTime >= parsedState.expirationTime) {
                dispatch({ type: 'LOGOUT' });
                localStorage.removeItem('authState');
            } else {
                dispatch({
                    type: 'LOGIN',
                    payload: {
                        token: parsedState.token,
                        user: parsedState.user
                    }
                });
            }
        }
    }, [dispatch]);

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};