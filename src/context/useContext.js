import axios from "axios";
import { useState } from "react";
import { omit } from "../utils";
import { homeNavLinks } from "../utils/navigation";
import moment from "moment";

// Custom hooks
export default function useGlobalContext() {
	// Axios instance
	const axiosIns = axios.create({
		baseURL: process.env.REACT_APP_BACKEND_URL,
		headers: {
			"x-auth-token": localStorage.getItem("token"),
			"Content-Type": "application/json",
		},
	});

	

	// Network Status
	const [networkStatus, setNetworkStatus] = useState("offline");

	// Loading State
	const [isLoading, setIsLoading] = useState(false);

	// Snack Bar component
	const [snackMsg, setSnackMsg] = useState({
		text: "Y^3 Planner",
		bgColor: "var(--indigo)",
		color: 'var(--white)',
	});

	const [showSnackBar, setShowSnackBar] = useState(false);

	// Global Authentication State
	const Authentification = localStorage.getItem("isAuthenticated");
	
	const [isAuthenticated, setIsAuthenticated] = useState(JSON.parse(Authentification) || true);

	const [calendarDate, setCalendarDate] = useState(moment(new Date()).format('YYYY-MM-DD'));

	// Global User State
	const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);


	// Update local user
	const updateUser = newUser => {
		localStorage.removeItem('user');
		setUser(null);
		localStorage.setItem('user', JSON.stringify(omit({...user, ...newUser}, 'password')));
		setUser( e => ({...e, ...newUser}) );
	}

	// Verify User
	const verifyUser = async () => {
		try {
			setIsLoading(true);
			const res = await axiosIns.get('/api/auth'); //API
			let info = res.data.user;
			setUser(info);
			localStorage.setItem('user', JSON.stringify(info));
			setIsLoading(false);
		} catch (error) {
			setSnackMsg({
				text: error.response?.data?.message,
				bgColor: 'var(--red)',
				color: 'var(--white)'
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			setIsLoading(false);
			localStorage.removeItem('token');
			localStorage.removeItem('user');
			localStorage.setItem('isAuthenticated', false);
			setUser(null);
			setIsAuthenticated(false);
		}
	}


	// Events
	const [events, setEvents] = useState([
	]);

	const getAllEvents = async () => {
		try {
			setIsLoading(true);
			const res = await axiosIns.get("/api/events"); //API
			setEvents( res.data.allEvents );
			setIsLoading(false);
		} catch (error) {
			setSnackMsg({
				text: error.response?.data?.message,
				bgColor: 'var(--red)',
				color: 'var(--white)'
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			setIsLoading(false);
		}
	}

	
	const addOneEvent = async event => {
		try {
			setIsLoading(true);
			const res = await axiosIns.post("/api/events/add", {...event});//API
			if (res.status === 200) {
				setEvents((prev) => {
					return [...prev, res.data.newEvent];
				});
				setSnackMsg({
					text: res.data.message,
					bgColor: 'var(--green)',
					color: 'var(--white)'
				});
				setShowSnackBar(true);
				setTimeout(() => {
					setShowSnackBar(false);
				}, 3000);
				setIsLoading(false);
			}
		} catch (error) {
			setSnackMsg({
				text: error.response?.data?.message,
				bgColor: 'var(--red)',
				color: 'var(--white)',
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			setIsLoading(false);
		}
	};

	const updateOneEvent = async (eid, updatedEvent) => {
		try {
			setIsLoading(true);
			const res = await axiosIns.put(`/api/events/update/${eid}`, {...updatedEvent});//API
			setEvents( prev => {
				let newEvents = prev.map( e =>
					e._id !== eid
						? e
						: res.data.updatedEvent
				);
				return newEvents;
			});
			setSnackMsg({
				text: res.data.message,
				bgColor: 'var(--green)',
				color: 'var(--white)'
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			setIsLoading(false);
		} catch (error) {
			setSnackMsg({
				text: error.response?.data?.message,
				bgColor: 'var(--red)',
				color: 'var(--white)'
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			setIsLoading(false);
		}
	};

	const moveOneEventToBin = async eid => {
		try {
			setIsLoading(true);
			const res = await axiosIns.put(`/api/events/trash/${eid}`);//API
			setEvents( prev => {
				let newEvents = prev.map( e =>
					e._id !== eid
						? e
						: res.data.updatedEvent
				);
				return newEvents;
			});
			setSnackMsg({
				text: res.data.message,
				bgColor: 'var(--green)',
				color: 'var(--white)'
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			setIsLoading(false);
		} catch (error) {
			setSnackMsg({
				text: error.response?.data?.message,
				bgColor: 'var(--red)',
				color: 'var(--white)'
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			setIsLoading(false);
		}
	};

	const recycleOneEvent = async (eid) => {
		try {
			setIsLoading(true);
			const res = await axiosIns.put(`/api/events/recycle/${eid}`);
			setEvents((prev) => {
				let newEvents = prev.map( e =>
					e._id !== eid
						? e
						: res.data.updatedEvent
				);
				return newEvents;
			});
			setSnackMsg({
				text: res.data.message,
				bgColor: 'var(--green)',
				color: 'var(--white)'
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			setIsLoading(false);
		} catch (error) {
			setSnackMsg({
				text: error.response?.data?.message,
				bgColor: 'var(--red)',
				color: 'var(--white)'
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			setIsLoading(false);
		}
	};

	const deleteOneEvent = async (eid) => {
		try {
			setIsLoading(true);
			const res = await axiosIns.delete(`/api/events/delete/${eid}`);
			getAllEvents();
			setSnackMsg({
				text: res.data.message,
				bgColor: 'var(--green)',
				color: 'var(--white)'
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			setIsLoading(false);
		} catch (error) {
			setSnackMsg({
				text: error.response?.data?.message,
				bgColor: 'var(--red)',
				color: 'var(--white)'
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			setIsLoading(false);
		}
	};

	// Notes
	// Similar APIs as Events
	const [notes, setNotes] = useState([]);

	const pinNote = async nid => {
		try {
			setIsLoading(true);
			const res = await axiosIns.put(`/api/notes/pin/${nid}`);
			setNotes( prev => {
				let newNotes = prev.map((e) =>
					e._id !== nid ? e : res.data.updatedNote
				);
				return newNotes;
			});
			setSnackMsg({
				text: res.data.message,
				bgColor: 'var(--green)',
				color: 'var(--white)'
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			setIsLoading(false);
		} catch (error) {
			setSnackMsg({
				text: error.response?.data?.message,
				bgColor: 'var(--red)',
				color: 'var(--white)',
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			setIsLoading(false);
		}
	};

	const unPinNote = async nid => {
		try {
			setIsLoading(true);
			const res = await axiosIns.put(`/api/notes/unpin/${nid}`);
			setNotes( prev => {
				let newNotes = prev.map((e) =>
					e._id !== nid ? e : res.data.updatedNote
				);
				return newNotes;
			});
			setSnackMsg({
				text: res.data.message,
				bgColor: 'var(--green)',
				color: 'var(--white)'
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			setIsLoading(false);
		} catch (error) {
			setSnackMsg({
				text: error.response?.data?.message,
				bgColor: 'var(--red)',
				color: 'var(--white)',
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			setIsLoading(false);
		}
	};

	const getAllNotes = async () => {
		try {
			setIsLoading(true);
			const res = await axiosIns.get("/api/notes");
			setNotes(res.data.allNotes);
			setIsLoading(false);
		} catch (error) {
			setSnackMsg({
				text: error.response?.data?.message,
				bgColor: 'var(--red)',
				color: 'var(--white)'
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			setIsLoading(false);
		}
	};

	const addOneNote = async newNote => {
		try {
			setIsLoading(true);
			const res = await axiosIns.post("/api/notes/add", {...newNote});
			if (res.status === 200) {
				setSnackMsg({
					text: res.data.message,
					bgColor: 'var(--green)',
					color: 'var(--white)'
				});
				setNotes( prev => [...prev, res.data.newNote] );
				setShowSnackBar(true);
				setTimeout(() => {
					setShowSnackBar(false);
				}, 3000);
				setIsLoading(false);
			}
		} catch (error) {
			setSnackMsg({
				text: error.response?.data?.message,
				bgColor: 'var(--red)',
				color: 'var(--white)'
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			setIsLoading(false);
		}
	};

	const updateOneNote = async (nid, updatedNote) => {
		try {
			setIsLoading(true);
			const res = await axiosIns.put(`/api/notes/update/${nid}`, {...updatedNote});
			setNotes((prev) => {
				let newNotes = prev.map( e =>
					e._id !== nid ? e : res.data.updatedNote
				);
				return newNotes;
			});
			setSnackMsg({
				text: res.data.message,
				bgColor: 'var(--green)',
				color: 'var(--white)'
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			setIsLoading(false);
		} catch (error) {
			setSnackMsg({
				text: error.response?.data?.message,
				bgColor: 'var(--red)',
				color: 'var(--white)'
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			setIsLoading(false);
		}
	};

	const archiveOneNote = async nid => {
		try {
			setIsLoading(true);
			const res = await axiosIns.put(`/api/notes/archive/${nid}`);
			setNotes( prev => {
				let newNotes = prev.map((e) =>
					e._id !== nid ? e : res.data.updatedNote
				);
				return newNotes;
			});
			setSnackMsg({
				text: res.data.message,
				bgColor: 'var(--green)',
				color: 'var(--white)'
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			setIsLoading(false);
		} catch (error) {
			setSnackMsg({
				text: error.response?.data?.message,
				bgColor: 'var(--red)',
				color: 'var(--white)',
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			setIsLoading(false);
		}
	};

	const unArchiveOneNote = async nid => {
		try {
			setIsLoading(true);
			const res = await axiosIns.put(`/api/notes/unarchive/${nid}`);
			setNotes((prev) => {
				let newNotes = prev.map((e) =>
					e._id !== nid ? e : res.data.updatedNote
				);
				return newNotes;
			});
			setSnackMsg({
				text: res.data.message,
				bgColor: 'var(--green)',
				color: 'var(--white)'
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			setIsLoading(false);
		} catch (error) {
			setSnackMsg({
				text: error.response?.data?.message,
				bgColor: 'var(--red)',
				color: 'var(--white)'
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			setIsLoading(false);
		}
	};

	const moveOneNoteToBin = async nid => {
		try {
			setIsLoading(true);
			const res = await axiosIns.put(`/api/notes/trash/${nid}`);
			setNotes((prev) => {
				let newNotes = prev.map((e) =>
					e._id !== nid ? e : res.data.updatedNote
				);
				return newNotes;
			});
			setSnackMsg({
				text: res.data.message,
				bgColor: 'var(--green)',
				color: 'var(--white)'
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			setIsLoading(false);
		} catch (error) {
			setSnackMsg({
				text: error.response?.data?.message,
				bgColor: 'var(--red)',
				color: 'var(--white)'
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			setIsLoading(false);
		}
	};

	const recycleOneNote = async nid => {
		try {
			setIsLoading(true);
			const res = await axiosIns.put(`/api/notes/recycle/${nid}`);
			setNotes((prev) => {
				let newNotes = prev.map((e) =>
					e._id !== nid ? e : res.data.updatedNote
				);
				return newNotes;
			});
			setSnackMsg({
				text: res.data.message,
				bgColor: 'var(--green)',
				color: 'var(--white)'
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			setIsLoading(false);
		} catch (error) {
			setSnackMsg({
				text: error.response?.data?.message,
				bgColor: 'var(--red)',
				color: 'var(--white)'
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			setIsLoading(false);
		}
	};

	const deleteOneNote = async nid => {
		try {
			setIsLoading(true);
			const res = await axiosIns.delete(`/api/notes/delete/${nid}`);
			getAllNotes();
			setSnackMsg({
				text: res.data.message,
				bgColor: 'var(--green)',
				color: 'var(--white)'
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			setIsLoading(false);
		} catch (error) {
			setSnackMsg({
				text: error.response?.data?.message,
				bgColor: 'var(--red)',
				color: 'var(--white)'
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			setIsLoading(false);
		}
	};

	// Tasks
	// Identical APIs
	const [tasks, setTasks] = useState([]);

	const getAllTasks = async () => {
		try {
			setIsLoading(true);
			const res = await axiosIns.get("/api/tasks");
			setTasks(res.data.allTasks);
			setIsLoading(false);
		} catch (error) {
			setSnackMsg({
				text: error.response?.data?.message,
				bgColor: 'var(--red)',
				color: 'var(--white)'
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			setIsLoading(false);
		}
	};

	const addOneTask = async newTask => {
		try {
			setIsLoading(true);
			const res = await axiosIns.post("/api/tasks/add", {...newTask});
			if (res.status === 200) {
				setSnackMsg({
					text: res.data.message,
					bgColor: 'var(--green)',
					color: 'var(--white)'
				});
				setTasks( prev => [...prev, res.data.newTask] );
				setShowSnackBar(true);
				setTimeout(() => {
					setShowSnackBar(false);
				}, 3000);
			}
			setIsLoading(false);
		} catch (error) {
			setSnackMsg({
				text: error.response?.data?.message,
				bgColor: 'var(--red)',
				color: 'var(--white)'
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			setIsLoading(false);
		}
	};

	const updateOneTask = async (tid, updatedTask) => {
		try {
			setIsLoading(true);
			const res = await axiosIns.put(`/api/tasks/update/${tid}`, {...updatedTask});
			setTasks( prev => {
				let newTasks = prev.map((e) =>
					e._id !== tid ? e : res.data.updatedTask
				);
				return newTasks;
			});
			setSnackMsg({
				text: res.data.message,
				bgColor: 'var(--green)',
				color: 'var(--white)'
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			setIsLoading(false);
		} catch (error) {
			setSnackMsg({
				text: error.response?.data?.message,
				bgColor: 'var(--red)',
				color: 'var(--white)'
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			setIsLoading(false);
		}
	};

	const markTaskAsDone = async tid => {
		try {
			setIsLoading(true);
			const res = await axiosIns.put(`/api/tasks/mark-as-done/${tid}`);
			setTasks((prev) => {
				let newTasks = prev.map( e =>
					e._id !== tid ? e : res.data.updatedTask
				);
				return newTasks;
			});
			setSnackMsg({
				text: res?.data?.message,
				bgColor: 'var(--green)',
				color: 'var(--white)'
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			setIsLoading(false);
		} catch (error) {
			setSnackMsg({
				text: error.response?.data?.message,
				bgColor: 'var(--red)',
				color: 'var(--white)'
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			setIsLoading(false);
		}
	};

	const markTaskAsNotDone = async tid => {
		try {
			setIsLoading(true);
			const res = await axiosIns.put(`/api/tasks/mark-as-not-done/${tid}`);
			setTasks( prev => {
				let newTasks = prev.map( e =>
					e._id !== tid ? e : res.data.updatedTask
				);
				return newTasks;
			});
			setSnackMsg({
				text: res?.data?.message,
				bgColor: 'var(--green)',
				color: 'var(--white)'
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			setIsLoading(false);
		} catch (error) {
			setSnackMsg({
				text: error.response?.data?.message,
				bgColor: 'var(--red)',
				color: 'var(--white)'
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			setIsLoading(false);
		}
	};

	const moveOneTaskToBin = async tid => {
		try {
			setIsLoading(true);
			const res = await axiosIns.put(`/api/tasks/trash/${tid}`);
			setTasks( prev => {
				let newTasks = prev.map( e =>
					e._id !== tid ? e : res.data.updatedTask
				);
				return newTasks;
			});
			setSnackMsg({
				text: res?.data?.message,
				bgColor: 'var(--green)',
				color: 'var(--white)'
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			setIsLoading(false);
		} catch (error) {
			setSnackMsg({
				text: error.response?.data?.message,
				bgColor: 'var(--red)',
				color: 'var(--white)'
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			setIsLoading(false);
		}
	};

	const recycleOneTask = async tid => {
		try {
			setIsLoading(true);
			const res = await axiosIns.put(`/api/tasks/recycle/${tid}`);
			setTasks( prev => {
				let newTasks = prev.map( e =>
					e._id !== tid ? e : res.data.updatedTask
				);
				return newTasks;
			});
			setSnackMsg({
				text: res?.data?.message,
				bgColor: 'var(--green)',
				color: 'var(--white)'
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			setIsLoading(false);
		} catch (error) {
			setSnackMsg({
				text: error.response?.data?.message,
				bgColor: 'var(--red)',
				color: 'var(--white)'
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			setIsLoading(false);
		}
	};

	const deleteOneTask = async tid => {
		try {
			setIsLoading(true);
			const res = await axiosIns.delete(`/api/tasks/delete/${tid}`);
			getAllTasks();
			setSnackMsg({
				text: res?.data?.message,
				bgColor: 'var(--green)',
				color: 'var(--white)'
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			setIsLoading(false);
		} catch (error) {
			setSnackMsg({
				text: error.response?.data?.message,
				bgColor: 'var(--red)',
				color: 'var(--white)'
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			setIsLoading(false);
		}
	};

	// Settings
	const getSettings = async () => {
		try {
			setIsLoading(true);
			const res = await axiosIns.get(`/api/settings`);
			if (res.status === 200) {
				setAccentColor(res.data.accentColor);
				document
					.querySelector('body')
					.style.setProperty('--accent-color', res.data.accentColor);
				localStorage.setItem("accentColor", res.data.accentColor);
			}
		} catch (error) {
			setSnackMsg({
				text: error.response?.data?.message,
				bgColor: 'var(--red)',
				color: 'var(--white)'
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			setIsLoading(false);
		}
	};

	const getCriticalTasks = async () => {
		try {
			setIsLoading(true);
			const res = await axiosIns.get(`/api/tasks/criticalTasks`);
			setIsLoading(false);
			return res.data.message === "true" ? true : false ;
		} catch (error) {
			setIsLoading(false);
			return false;
		}
	}

	// Synchronize
	const synchronize = async () => {
		getAllEvents();
		getAllNotes();
		getAllTasks();
		getSettings();
	};

	// Side Bar
	const [openSideBar, setOpenSideBar] = useState(false);

	const [sideBarLinks, setSideBarLinks] = useState(homeNavLinks);

	const toggleSideBar = () => {

		setOpenSideBar( e => !e );

	};

	// Theme: light or dark
	const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

	const toggleTheme = () => {
		let tmp = theme === "light" ? "dark" : "light";
		document.body.classList = tmp;
		localStorage.setItem("theme", tmp);
		setTheme( e => e === "light" ? "dark" : "light");
	};

	// Manage Features
	const [accentColor, setAccentColor] = useState(localStorage.getItem("accentColor") || "indigo");
	
	const updateAccentColor = async color => {
		setAccentColor(color);
		document
			.querySelector("body")
			.style.setProperty("--accent-color", color);
		localStorage.setItem("accentColor", color);
		try {
			setIsLoading(true);
			const res = await axiosIns.put(`/api/settings/update`, {
				accentColor: color,
			});
			setSnackMsg({
				text: res.data.message,
				bgColor: 'var(--green)',
				color: 'var(--white)'
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			setIsLoading(false);
		} catch (error) {
			setSnackMsg({
				text: error.response?.data?.message,
				bgColor: 'var(--red)',
				color: 'var(--white)'
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			setIsLoading(false);
		}
	};

	// Media Breakpoints to distinguish devices
	// Not important
	const mediaQuerySm = window.matchMedia("(max-width: 672px)");
	const mediaQueryMd = window.matchMedia("(max-width: 880px)");
	const mediaQueryLg = window.matchMedia("(min-width: 880px)");
	const breakpoint = device => device === 'mobile' ? (mediaQuerySm.matches) : (device === 'tab' ? mediaQueryMd.matches : mediaQueryLg.matches);
	//Don't change
	mediaQuerySm.addListener(breakpoint);
	mediaQueryMd.addListener(breakpoint);
	mediaQueryLg.addListener(breakpoint);

	return {
		//Settings
		theme,
		setTheme,
		toggleTheme,
		accentColor,
		setAccentColor,
		updateAccentColor,
		breakpoint,
		networkStatus,
		setNetworkStatus,
		isLoading,
		setIsLoading,
		snackMsg,
		setSnackMsg,
		showSnackBar,
		setShowSnackBar,
		isAuthenticated,
		setIsAuthenticated,
		//Users
		user,
		setUser,
		verifyUser,
		updateUser,
		//SideBars
		openSideBar,
		setOpenSideBar,
		toggleSideBar,
		sideBarLinks,
		setSideBarLinks,
		//Ajax
		axiosIns,
		//Events
		events,
		setEvents,
		getAllEvents,
		addOneEvent,
		updateOneEvent,
		moveOneEventToBin,
		recycleOneEvent,
		deleteOneEvent,
		//Notes
		notes,
		setNotes,
		getAllNotes,
		addOneNote,
		updateOneNote,
		archiveOneNote,
		unArchiveOneNote,
		moveOneNoteToBin,
		recycleOneNote,
		deleteOneNote,
		pinNote,
		unPinNote,
		//Tasks
		tasks,
		setTasks,
		getAllTasks,
		addOneTask,
		updateOneTask,
		markTaskAsDone,
		markTaskAsNotDone,
		moveOneTaskToBin,
		recycleOneTask,
		deleteOneTask,
		getSettings,
		synchronize,
		getCriticalTasks,
		calendarDate,
		setCalendarDate
	};
};
