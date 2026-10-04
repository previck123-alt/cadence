import React, { Suspense } from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";

import "./App.css";

import FallBack from "./components/Fallback";

// ================= AUTH SCREENS =================
const Login = React.lazy(() => import("./screens/Login"));
const Signup = React.lazy(() => import("./screens/Signup"));

// ================= PROTECTED SCREENS =================
const Dashboard = React.lazy(() => import("./screens/Dashboard"));
const Transactions = React.lazy(() => import("./screens/Transactions"));
const TransactionHistory = React.lazy(() => import("./screens/History"));
const Profile = React.lazy(() => import("./screens/Profile"));
const Settings = React.lazy(() => import("./screens/Settings"));
const Deposit = React.lazy(() => import("./screens/Deposit"));
const Transfer = React.lazy(() => import("./screens/Transfer"));
const ChangePassword = React.lazy(() =>
  import("./screens/ChangePassword")
);

function ProtectedRoute({ children }) {
  const { userToken } = useSelector((state) => state.userAuth);

  return userToken ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { userToken } = useSelector((state) => state.userAuth);

  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}

      <Route
        path="/"
        element={
          userToken ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login />
          )
        }
      />

      <Route
        path="/login"
        element={
          userToken ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login />
          )
        }
      />

      <Route
        path="/signup"
        element={
          userToken ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Signup />
          )
        }
      />

      {/* ================= PROTECTED ROUTES ================= */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/transfer"
        element={
          <ProtectedRoute>
            <Transfer />
          </ProtectedRoute>
        }
      />

      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        }
      />

      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <TransactionHistory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/deposit"
        element={
          <ProtectedRoute>
            <Deposit />
          </ProtectedRoute>
        }
      />

      <Route
        path="/change-password"
        element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        }
      />

      {/* ================= LOGOUT ================= */}

      <Route
        path="/logout"
        element={<Navigate to="/login" replace />}
      />

      {/* ================= UNKNOWN ROUTES ================= */}

      <Route
        path="*"
        element={
          <Navigate
            to={userToken ? "/dashboard" : "/login"}
            replace
          />
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Suspense fallback={<FallBack />}>
      <div className="App">
        <AppRoutes />
      </div>
    </Suspense>
  );
}

export default App;
