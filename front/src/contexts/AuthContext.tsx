import React, { createContext, useReducer, useEffect } from 'react';

const initialState = {
    token: null as string | null,
    user: null as any,
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

            console.log(parsedState.data.token)

            fetch(`http://localhost:4000?token=${parsedState.data.token}`)
                .then(response => response.json())
                .then(userExists => {
                    if (userExists && currentTime >= parsedState.expirationTime) {
                        dispatch({ type: 'LOGOUT' });
                        localStorage.removeItem('authState');
                    } else if (userExists) {
                        dispatch({
                            type: 'LOGIN',
                            payload: {
                                token: userExists.token,
                                user: userExists.user
                            }
                        });
                    } else {
                        dispatch({
                            type: 'LOGIN',
                            payload: {
                                token: parsedState.data.token,
                                user: parsedState.data.user
                            }
                        });
                    }
                })
                .catch(error => {
                    console.error('Error checking user existence:', error);
                    dispatch({ type: 'LOGOUT' });
                });
        }

    }, [dispatch]);

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};