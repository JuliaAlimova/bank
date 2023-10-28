import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthRoute, useAuth } from "./component/authRoute";
import { AuthProvider } from "./contexts/AuthContext";

import WellcomePage from "./page/wellcomePage";
import SignUpPage from "./page/signUpPage";
import SignupConfirmPage from "./page/signupConfirmPage";
import SignIpPage from "./page/signInPage";
import BalancePage from "./page/balancePage";
import RecoveryPage from "./page/recoveryPage";
import RecoveryConfirmPage from "./page/recoveryConfirmPage";

// NotificationsPage, SettingsPage, RecivePage, SendPage, TransactionPage

function App() {

  const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const { state } = useAuth();

    if (state.user) {
      if (state.user.isConfirm) {
        return <BalancePage />;
      } else if (!state.user.isLogged) {
        return <SignUpPage />;
      } else {
        return <SignupConfirmPage />
      }
    } else {
      return children
    }
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            index
            element={
              <AuthRoute>
                <WellcomePage />
              </AuthRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <AuthRoute>
                <SignUpPage />
              </AuthRoute>
            }
          />
          <Route
            path="/signup-confirm"
            element={
              <PrivateRoute>
                <SignupConfirmPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/signin"
            element={
              <AuthRoute>
                <SignIpPage />
              </AuthRoute>
            }
          />
          <Route
            path="/recovery"
            element={
              <AuthRoute>
                <RecoveryPage />
              </AuthRoute>
            }
          />
          <Route
            path="/recovery-confirm"
            element={
              <AuthRoute>
                <RecoveryConfirmPage />
              </AuthRoute>
            }
          />
          <Route
            path="/balance"
            element={
              <PrivateRoute>
                <BalancePage />
              </PrivateRoute>
            }
          />
          {/* <Route
                path="/notifications"
                element={
                  <PrivateRoute>
                    <NotificationsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <PrivateRoute>
                    <SettingsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/recive"
                element={
                  <PrivateRoute>
                    <RecivePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/send"
                element={
                  <PrivateRoute>
                    <SendPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/transaction/:transactionId"
                element={
                  <PrivateRoute>
                    <TransactionPage />
                  </PrivateRoute>
                }
              />
              <Route path="*" Component={Error} />  */}
        </Routes>
      </BrowserRouter>
    </AuthProvider >
  );
}

export default App;
