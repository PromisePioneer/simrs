import {createBrowserRouter, Navigate, RouterProvider} from "react-router";
import Login from "@/pages/Auth/login.jsx";
import LandingPage from "@/pages/landing.jsx";
import Dashboard from "@/pages/Dashboard/Dashboard.jsx";
import EmailVerify from "@/pages/email-verify.jsx";
import RoleManagement from "@/pages/Master/Role/role-management.jsx";
import {useAuthStore} from "@/store/authStore.js";
import {useEffect} from "react";
import Users from "@/pages/Master/User/users.jsx";
import User from "@/pages/Master/User/detail/user.jsx";
import Register from "@/pages/Auth/register.jsx";

function ProtectedRoute({children}) {
    const {loggedIn, fetchUser, userData} = useAuthStore();

    useEffect(() => {
        const initAuth = async () => {
            if (loggedIn && !userData) {
                await fetchUser();
            }
        };
        initAuth();
    }, []);

    if (!loggedIn) {
        return <Navigate to="/login" replace/>;
    }

    return children;
}

const router = createBrowserRouter([
    {path: "/", element: <LandingPage/>},
    {path: "/login", element: <Login/>},
    {path: "/register", element: <Register/>},
    {path: "/email/verify", element: <EmailVerify/>},

    {
        path: "/dashboard",
        element: (
            <ProtectedRoute>
                <Dashboard/>
            </ProtectedRoute>
        ),
    },

    {
        path: "/master/role",
        element: (
            <ProtectedRoute>
                <RoleManagement/>
            </ProtectedRoute>
        ),
    },
    {
        path: "/master/user",
        element: (
            <ProtectedRoute>
                <Users/>
            </ProtectedRoute>
        ),
    },
    {
        path: "/master/user/:id",
        element: (
            <ProtectedRoute>
                <User/>
            </ProtectedRoute>
        ),
    }
]);

function App() {
    return <RouterProvider router={router}/>;
}

export default App;
