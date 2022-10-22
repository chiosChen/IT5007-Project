import React, { useContext, useEffect } from "react";
import "./style.css";
import { useLocation, Route, Routes } from "react-router-dom";
import { Popup } from "./layout/Popup/Popup";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "./components/Header/Header";
import SideBar from "./components/SideBar/SideBar";
import Footer from "./components/Footer/Footer";
import useGlobalContext from "./context/useContext";
import GlobalContext from "./context/GlobalContext";
import Loader from "./components/Loader/Loader";
import SnackBar from "./components/SnackBar/SnackBar";
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
import { useState } from "react";
import moment from "moment";

const Wrapper = () => {
	AOS.init();
	const {
		theme,
		openSideBar,
		setOpenSideBar,
		isLoading,
		setIsLoading,
		snackMsg,
		setSnackMsg,
		showSnackBar,
		setShowSnackBar,
		networkStatus,
		setNetworkStatus,
		verifyUser,
		setTheme,
		synchronize,
		getCriticalTasks,
		events
	} = useContext(GlobalContext);

	const location = useLocation();
	const [haveCriticalTasks, setHaveCriticalTasks] = useState(false);

	useEffect(() => {
		setOpenSideBar(false);
		document.body.classList = localStorage.getItem("theme");
	}, [location.pathname, setOpenSideBar, theme]);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [location.pathname]);
	
	useEffect(() => {
		synchronize();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		setNetworkStatus(navigator.onLine ? "online" : "offline");
		if (Notification.permission !== "granted") {
			Notification.requestPermission().then(() => {
				if (Notification.permission !== "granted") {
					console.log(
						"Allow notification for Planner to get notified for Tasks"
					);
				}
			});
		}
	});

	useEffect(() => {
		let allEvents = [...events];
		let times = [];
		let curr = new Date().getTime();
		let today = moment(new Date()).format("YYYY-MM-DD");
		for (let event of allEvents) {
			if (event.date === today) {
				let tmp = new Date(`${event.date} ${event.time}`).getTime();
				if (tmp - curr >= 300000) {
					times = [...times, tmp - curr];
				}
			}
		}
		for (let t of times) {
			if (t >= 900000) {
				setTimeout(() => {
					setSnackMsg({
						text: `You have an event in 15 mins`,
						bgColor: "var(--red)",
						color: "var(--white)",
					});
					setShowSnackBar(true);
					setTimeout(() => {
						setShowSnackBar(false);
					}, 5000);
				}, t-900000);
			}else {
				setTimeout(() => {
					setSnackMsg({
						text: `You have an event in 5 mins`,
						bgColor: "var(--red)",
						color: "var(--white)",
					});
					setShowSnackBar(true);
					setTimeout(() => {
						setShowSnackBar(false);
					}, 5000);
				}, t-300000);
			}
			
		}
	}, [events])
	useEffect(() => {
		if (!navigator.onLine) {
			setSnackMsg({
				text: `No Internet Connection`,
				bgColor: "var(--red)",
				color: "var(--white)",
			});
		} else {
			setSnackMsg({
				text: `Welcome Back`,
				bgColor: "var(--green)",
				color: "var(--white)",
			});
		}
		setShowSnackBar(true);
		setTimeout(() => {
			setShowSnackBar(false);
		}, 3000);
	}, [networkStatus, setShowSnackBar, setSnackMsg]);

	useEffect(() => {
		if (JSON.parse(localStorage.getItem("isAuthenticated"))) verifyUser();
		if (!localStorage.getItem("theme")) {
			let currDate = new Date();
			let h = currDate.getHours();
			if (h >= 20 && h < 8) {
				localStorage.setItem("theme", "dark");
				setTheme("dark");
				document.body.classList = "dark";
			} else {
				localStorage.setItem("theme", "light");
				setTheme("light");
				document.body.classList = "light";
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect( () => {
		if (getCriticalTasks() === true) setHaveCriticalTasks(true);
	}, [])

	

	

	return (
		<>
			{location.pathname !== "/login" &&
				location.pathname !== "/register" && <Header />}
			{openSideBar && <SideBar />}
			{isLoading && <Loader />}
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/about" element={<About />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/logout" element={<Logout />} />
				<Route path="/calendar" element={<Calendar />} />
				<Route
					path="/profile"
					element={<Profile />}
				/>
				<Route
					path="/events"
					element={<Events />}
				/>
				<Route
					path="/events/trash"
					element={<EventsTrash />}
				/>
				<Route
					path="/notes"
					element={<Notes />}
				/>
				<Route
					path="/notes/archive"
					element={<NotesArchived />}
				/>
				<Route
					path="/notes/trash"
					element={<NotesTrash />}
				/>
				<Route
					path="/tasks"
					element={<Tasks />}
				/>
				<Route
					path="/tasks/completed"
					element={<TasksCompleted />}
				/>
				<Route
					path="/tasks/trash"
					element={<TasksTrash />}
				/>
				<Route path="/contact" element={<Contact />} />
				<Route path="/settings" element={<Settings />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
			{location.pathname !== "/login" &&
				location.pathname !== "/register" && <Footer />}
			{showSnackBar && (
				<SnackBar
					text={snackMsg.text}
					bgColor={snackMsg.bgColor}
					color={snackMsg.color}
					close={() => setShowSnackBar(false)}
				/>
			)}
			{haveCriticalTasks && (
				<Popup
					width="50%"
					height="fit-content"
					breakpoints={{
						tab: ["60%", "fit-content"],
						mobile: ["90%", "fit-content"],
					}}
					cta={{
						text: "OK",
						color: "red",
						onClick: () => {
							setHaveCriticalTasks( e => !e );
						},
					}}
					close={() => setHaveCriticalTasks(false)}
				>
					<span style={{ fontSize: "1.25rem", lineHeight: "2.5rem", textAlign: "center" }}>
						{
							<>
								<h4>Your tasks are approaching deadlines</h4>
							</>
						}
					</span>
				</Popup>
			)}
		</>
	);
};

export default function App() {
	const context = useGlobalContext();
	return (
		<GlobalContext.Provider value={context}>
			<Wrapper />
		</GlobalContext.Provider>
	);
};

