import {
    createBrowserRouter,
    RouterProvider,
    Outlet,
    ScrollRestoration,
} from "react-router-dom";
import './App.css';
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import axios from "axios";
import { ProfileProvider } from "./context/ProfileContext";
import { useEffect, lazy, Suspense } from "react";
import { baseUrl } from "../apiConfig";
import LoadingPage from "./components/LoadingPage";
import { useLoading } from "./hooks/useLoading";
import { GlobalLoadingContext } from "./context/GlobalLoadingContext";

axios.defaults.baseURL = baseUrl;
axios.defaults.withCredentials = true;

const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const Home = lazy(() => import("./pages/Home"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const ChatHome = lazy(() => import("./pages/ChatHome"));
const Profile = lazy(() => import("./pages/Profile"));
const Developer = lazy(() => import("./pages/Developer"));
const Design = lazy(() => import("./pages/Design"));
const TestChat = lazy(() => import("./pages/TestChat"));
const LoadingDemo = lazy(() => import("./pages/LoadingDemo"));
const Chat = lazy(() => import("./pages/Chat"));

const Layout = () => {
    const { checkAuth } = useAuth();
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);
    return (
        <>
            <ScrollRestoration />
            <Outlet />
        </>
    );
};

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "register",
                element: <Register />,
            },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "users/:id/verify/:token",
                element: <VerifyEmail />,
            },
            {
                path: "chathome",
                element: <ChatHome />,
            },
            {
                path: "profile",
                element: <Profile />,
            },
            {
                path: "developer",
                element: <Developer />,
            },
            {
                path: "design",
                element: <Design />,
            },
            {
                path: "test",
                element: <TestChat />,
            },
            {
                path: "loading-demo",
                element: <LoadingDemo />,
            },
            {
                path: "chat",
                element: <Chat />,
            },
        ],
    },
]);

function App() {
    const loadingState = useLoading();

    return (
        <GlobalLoadingContext.Provider value={loadingState}>
            <AuthProvider>
                <ProfileProvider>
                    <Suspense fallback={
                        <LoadingPage
                            message="Loading your experience..."
                            variant="detailed"
                        />
                    }>
                        <RouterProvider router={router} />
                    </Suspense>
                    <Toaster />

                    {/* Global Loading Overlay */}
                    {loadingState.isLoading && (
                        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
                            <LoadingPage
                                message={loadingState.loadingMessage}
                                progress={loadingState.loadingProgress}
                                variant={loadingState.loadingVariant}
                            />
                        </div>
                    )}
                </ProfileProvider>
            </AuthProvider>
        </GlobalLoadingContext.Provider>
    );
}

export default App;
