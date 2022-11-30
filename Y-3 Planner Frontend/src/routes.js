import About from "./pages/About/About";
import Calendar from "./pages/Calendar/Calendar";
import Contact from "./pages/Contact/Contact";
import Events from "./pages/Events/Events";
import EventsTrash from "./pages/Events/EventsTrash";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Logout from "./pages/Logout/Logout";
import Notes from "./pages/Notes/Notes";
import NotesArchived from "./pages/Notes/NotesArchived";
import NotesTrash from "./pages/Notes/NotesTrash";
import NotFound from "./pages/NotFound/NotFound";
import Profile from "./pages/Profile/Profile";
import Register from "./pages/Register/Register";
import Settings from "./pages/Settings/Settings";
import TasksCompleted from "./pages/Tasks/TasksCompleted";
import TasksTrash from "./pages/Tasks/TasksTrash";
import Tasks from "./pages/Tasks/Tasks"

export const routes = [
    {
        path: "/",
        element: <Home />
    },
    {
        path: "/about",
        element: <About />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/logout",
        element: <Logout />
    },
    {
        path: "/calendar",
        element: <Calendar />
    },
    {
        path: "/profile",
        element: <Profile />
    },
    {
        path: "/events",
        element: <Events />,
        children: [
            {
                path: "trash",
                element: <EventsTrash />,

            }
        ]
    },
    {
        path: "/notes",
        element: <Notes />,
        children: [
            {
                path: "archive",
                element: <NotesArchived />
            },
            {
                path: "trash",
                element: <NotesTrash />
            }
        ]
    },
    {
        path: "/tasks",
        element: <Tasks />,
        children: [
            {
                path: "completed",
                element: <TasksCompleted />
            },
            {
                path: "trash",
                element: <TasksTrash />
            }
        ]
    },
    {
        path: "/contact",
        element: <Contact />
    },
    {
        path: "settings",
        element: <Settings />
    },
    {
        path: "*",
        element: <NotFound />
    }
]