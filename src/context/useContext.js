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

	

	const graphQLFetch = async (query, variables = {}) => {
		try {
			const rep = await fetch('/graphql', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({ query, variables })
			});
			const data = await rep.text();
			const res = JSON.parse(data, (k, v) => v);
			return res;
		} catch (error) {
			//console.log(error);
			setSnackMsg({
				text: 'Server Error',
				bgColor: 'var(--red)',
				color: 'var(--white)'
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
		}
	}

	

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
	
		setIsLoading(true);
		const query = '';
		const res = await graphQLFetch(query, {user}); //API
		if (res) {
			if (res.error) {
				setSnackMsg({
					text: res.error.message,
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
			}else {
				let info = res.data.user;
				setUser(info);
				localStorage.setItem('user', JSON.stringify(info));
				setIsLoading(false);
			}
			
		}
		
	}


	// Events
	const [events, setEvents] = useState([]);

	const getAllEvents = async () => {
		setIsLoading(true);
		const query = '';
		const res = await graphQLFetch(query, {user});//API
		if (res) {
			if (res.error) {
				setSnackMsg({
					text: res.error.message,
					bgColor: 'var(--red)',
					color: 'var(--white)'
				});
				setShowSnackBar(true);
				setTimeout(() => {
					setShowSnackBar(false);
				}, 3000);
			}else {
				setEvents( res.data.allEvents );
			}
		}
		setIsLoading(false);
			
		
	}

	const addOneEvent = async event => {
			setIsLoading(true);
			event.user = user._id;
			const query = '';
			const res = await graphQLFetch(query, {event});//API
			if (res) {
				if (res.error) {
					setSnackMsg({
						text: res.error.response?.data?.message,
						bgColor: 'var(--red)',
						color: 'var(--white)',
					});
					setShowSnackBar(true);
					setTimeout(() => {
						setShowSnackBar(false);
					}, 3000);
				}else {
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
				}
			}
			setIsLoading(false);
	};

	const updateOneEvent = async (eid, updatedEvent) => {
			setIsLoading(true);
			const query = '';
			updatedEvent.user = user._id;
			const res = await graphQLFetch(query, {updatedEvent, eid});//API
			if (res) {
				if (res.error) {
					setSnackMsg({
						text: res.error.message,
						bgColor: 'var(--red)',
						color: 'var(--white)'
					});
					setShowSnackBar(true);
					setTimeout(() => {
						setShowSnackBar(false);
					}, 3000);
				}else {
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
				}
			}
			
			setIsLoading(false);
		
	};

	const moveOneEventToBin = async eid => {
		setIsLoading(true);
		const query = '';
		let event = {eid: eid, uid: user._id}
		const res = await graphQLFetch(query, {event});//API
		if (res) {
			if (res.error) {
				setSnackMsg({
					text: res.error.message,
					bgColor: 'var(--red)',
					color: 'var(--white)'
				});
				setShowSnackBar(true);
				setTimeout(() => {
					setShowSnackBar(false);
				}, 3000);
			}else {
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
			}
		}
		setIsLoading(false);

	};

	const recycleOneEvent = async eid => {
		setIsLoading(true);
		const query = '';
		let event = {eid: eid, uid: user._id}
		const res = await graphQLFetch(query, {event});
		if (res) {
			if (res.error) {
				setSnackMsg({
					text: res.error.message,
					bgColor: 'var(--red)',
					color: 'var(--white)'
				});
				setShowSnackBar(true);
				setTimeout(() => {
					setShowSnackBar(false);
				}, 3000);
			}else {
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
			}
		}
			
		setIsLoading(false);

	};

	const deleteOneEvent = async eid => {
		setIsLoading(true);
		const query = '';
		let event = {eid: eid, uid: user._id}
		const res = await graphQLFetch(query, {event});
		getAllEvents();
		if (res) {
			if (res.error) {
				setSnackMsg({
					text:res.error.message,
					bgColor: 'var(--red)',
					color: 'var(--white)'
				});
				setShowSnackBar(true);
				setTimeout(() => {
					setShowSnackBar(false);
				}, 3000);
			}else {
				setSnackMsg({
					text: res.data.message,
					bgColor: 'var(--green)',
					color: 'var(--white)'
				});
				setShowSnackBar(true);
				setTimeout(() => {
					setShowSnackBar(false);
				}, 3000);
			}
		}

		setIsLoading(false);

	};

	// Notes
	// Similar APIs as Events
	const [notes, setNotes] = useState([]);

	const pinNote = async nid => {
		setIsLoading(true);
		const query = '';
		let note = {nid: nid, uid: user._id};
		const res = await graphQLFetch(query, {note});
		if (res) {
			if (res.error) {
				setSnackMsg({
					text: res.error.message,
					bgColor: 'var(--red)',
					color: 'var(--white)',
				});
				setShowSnackBar(true);
				setTimeout(() => {
					setShowSnackBar(false);
				}, 3000);
			}else {
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
			}
		}
		
		setIsLoading(false);
		
	};

	const unpinNote = async nid => {
		setIsLoading(true);
		const query = '';
		let note = {nid: nid, uid: user._id};
		const res = await graphQLFetch(query, {note});
		if (res) {
			if (res.error) {
				setSnackMsg({
					text: res.error.message,
					bgColor: 'var(--red)',
					color: 'var(--white)',
				});
				setShowSnackBar(true);
				setTimeout(() => {
					setShowSnackBar(false);
				}, 3000);
			}else {
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
			}
		}
		
		setIsLoading(false);
		
	};

	const getAllNotes = async () => {
		setIsLoading(true);
		const query = '';
		const res = await graphQLFetch(query, {user});
		if (res) {
			if (res.error) {
				setSnackMsg({
					text: res.error.message,
					bgColor: 'var(--red)',
					color: 'var(--white)'
				});
				setShowSnackBar(true);
				setTimeout(() => {
					setShowSnackBar(false);
				}, 3000);
			}else {
				setNotes(res.data.allNotes);
			}
		}
		
		setIsLoading(false);
	};

	const addOneNote = async newNote => {
		setIsLoading(true);
		const query = '';
		newNote.user = user._id;
		const res = await graphQLFetch(query, {newNote});
		if (res) {
			if (res.error) {
				setSnackMsg({
					text: res.error.message,
					bgColor: 'var(--red)',
					color: 'var(--white)'
				});
				setShowSnackBar(true);
				setTimeout(() => {
					setShowSnackBar(false);
				}, 3000);
			}else {
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
			}
			
			
		}
		setIsLoading(false);

	};

	const updateOneNote = async (nid, updatedNote) => {
		setIsLoading(true);
		const query = '';
		updatedNote.user = user._id;
		const res = await graphQLFetch(query, {updatedNote, nid});
		if (res) {
			if (res.error) {
				setSnackMsg({
					text: res.error.message,
					bgColor: 'var(--red)',
					color: 'var(--white)'
				});
				setShowSnackBar(true);
				setTimeout(() => {
					setShowSnackBar(false);
				}, 3000);
			}else {
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
			}
		}
		
		setIsLoading(false);

	};

	const archiveOneNote = async nid => {
		setIsLoading(true);
		const query = '';
		let note = {nid: nid, uid: user._id}
		const res = await graphQLFetch(query, {note});
		if (res) {
			if (res.error) {
				setSnackMsg({
					text: res.error.message,
					bgColor: 'var(--red)',
					color: 'var(--white)',
				});
				setShowSnackBar(true);
				setTimeout(() => {
					setShowSnackBar(false);
				}, 3000);
			}else {
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
			}
		}
		
		setIsLoading(false);
	};

	const unArchiveOneNote = async nid => {
		setIsLoading(true);
		const query = '';
		let note = {nid: nid, uid: user._id}
		const res = await graphQLFetch(query, {note});
		if (res) {
			if (res.error) {
				setSnackMsg({
					text: res.error.message,
					bgColor: 'var(--red)',
					color: 'var(--white)',
				});
				setShowSnackBar(true);
				setTimeout(() => {
					setShowSnackBar(false);
				}, 3000);
			}else {
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
			}
		}
		
		setIsLoading(false);
	};

	const moveOneNoteToBin = async nid => {
		setIsLoading(true);
		const query = '';
		let note = {nid: nid, uid: user._id}
		const res = await graphQLFetch(query, {note});
		if (res) {
			if (res.error) {
				setSnackMsg({
					text: res.error.message,
					bgColor: 'var(--red)',
					color: 'var(--white)',
				});
				setShowSnackBar(true);
				setTimeout(() => {
					setShowSnackBar(false);
				}, 3000);
			}else {
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
			}
		}
		
		setIsLoading(false);
	};

	const recycleOneNote = async nid => {
		setIsLoading(true);
		const query = '';
		let note = {nid: nid, uid: user._id}
		const res = await graphQLFetch(query, {note});
		if (res) {
			if (res.error) {
				setSnackMsg({
					text: res.error.message,
					bgColor: 'var(--red)',
					color: 'var(--white)',
				});
				setShowSnackBar(true);
				setTimeout(() => {
					setShowSnackBar(false);
				}, 3000);
			}else {
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
			}
		}
		
		setIsLoading(false);
	};

	const deleteOneNote = async nid => {
	
		setIsLoading(true);
		const query = '';
		let note = {nid: nid, uid: user._id}
		const res = await graphQLFetch(query, {note});
		getAllNotes();
		if (res) {
			if (res.error) {
				setSnackMsg({
					text: res.error.message,
					bgColor: 'var(--red)',
					color: 'var(--white)'
				});
				setShowSnackBar(true);
				setTimeout(() => {
					setShowSnackBar(false);
				}, 3000);
			}else {
				setSnackMsg({
					text: res.data.message,
					bgColor: 'var(--green)',
					color: 'var(--white)'
				});
				setShowSnackBar(true);
				setTimeout(() => {
					setShowSnackBar(false);
				}, 3000);
			}
		}
		
		setIsLoading(false);

	};

	// Tasks
	// Identical APIs
	const [tasks, setTasks] = useState([]);

	const getAllTasks = async () => {
		
		setIsLoading(true);
		const query = '';
		const res = await graphQLFetch(query, {user});
		if (res) {
			if (res.error) {
				setSnackMsg({
					text: res.error.message,
					bgColor: 'var(--red)',
					color: 'var(--white)'
				});
				setShowSnackBar(true);
				setTimeout(() => {
					setShowSnackBar(false);
				}, 3000);
			}else {
				setTasks(res.data.allTasks);
			}
		}
		
		setIsLoading(false);

	};

	const addOneTask = async newTask => {
		setIsLoading(true);
		const query = '';
		newTask.user = user._id;
		const res = await graphQLFetch(query, {newTask});
		if (res) {
			if (res.error) {
				setSnackMsg({
					text: res.error.message,
					bgColor: 'var(--red)',
					color: 'var(--white)'
				});
				setShowSnackBar(true);
				setTimeout(() => {
					setShowSnackBar(false);
				}, 3000);
			}else {
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
			
		}
		setIsLoading(false);

	};

	const updateOneTask = async (tid, updatedTask) => {

		setIsLoading(true);
		const query = '';
		updatedTask.user = user._id;
		const res = await graphQLFetch(query, {updatedTask, tid});
		if (res) {
			if (res.error) {
				setSnackMsg({
					text: res.error.message,
					bgColor: 'var(--red)',
					color: 'var(--white)'
				});
				setShowSnackBar(true);
				setTimeout(() => {
					setShowSnackBar(false);
				}, 3000);
			}else {
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
			}
		}
		
		setIsLoading(false);

	};

	const markTaskAsDone = async tid => {
		setIsLoading(true);
		const query = '';
		let task = {tid: tid, uid: user._id};
		const res = await graphQLFetch(query, {task});
		if (res) {
			if (res.error) {
				setSnackMsg({
					text: res.error.message,
					bgColor: 'var(--red)',
					color: 'var(--white)'
				});
				setShowSnackBar(true);
				setTimeout(() => {
					setShowSnackBar(false);
				}, 3000);
			}else {
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
			}
		}
		
		setIsLoading(false);
	};

	const markTaskAsNotDone = async tid => {
		setIsLoading(true);
		const query = '';
		let task = {tid: tid, uid: user._id};
		const res = await graphQLFetch(query, {task});
		if (res) {
			if (res.error) {
				setSnackMsg({
					text: res.error.message,
					bgColor: 'var(--red)',
					color: 'var(--white)'
				});
				setShowSnackBar(true);
				setTimeout(() => {
					setShowSnackBar(false);
				}, 3000);
			}else {
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
			}
		}
		
		setIsLoading(false);
	};

	const moveOneTaskToBin = async tid => {
		setIsLoading(true);
		const query = '';
		let task = {tid: tid, uid: user._id};
		const res = await graphQLFetch(query, {task});
		if (res) {
			if (res.error) {
				setSnackMsg({
					text: res.error.message,
					bgColor: 'var(--red)',
					color: 'var(--white)'
				});
				setShowSnackBar(true);
				setTimeout(() => {
					setShowSnackBar(false);
				}, 3000);
			}else {
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
			}
		}
		
		setIsLoading(false);
	};

	const recycleOneTask = async tid => {
		setIsLoading(true);
		const query = '';
		let task = {tid: tid, uid: user._id};
		const res = await graphQLFetch(query, {task});
		if (res) {
			if (res.error) {
				setSnackMsg({
					text: res.error.message,
					bgColor: 'var(--red)',
					color: 'var(--white)'
				});
				setShowSnackBar(true);
				setTimeout(() => {
					setShowSnackBar(false);
				}, 3000);
			}else {
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
			}
		}
		
		setIsLoading(false);
	};

	const deleteOneTask = async tid => {
		setIsLoading(true);
		const query = '';
		let task = {tid: tid, uid: user._id}
		const res = await graphQLFetch(query, {task});
		getAllTasks();
		if (res) {
			if (res.error){
				setSnackMsg({
					text: res.error.message,
					bgColor: 'var(--red)',
					color: 'var(--white)'
				});
				setShowSnackBar(true);
				setTimeout(() => {
					setShowSnackBar(false);
				}, 3000);
			}else {
				setSnackMsg({
					text: res?.data?.message,
					bgColor: 'var(--green)',
					color: 'var(--white)'
				});
				setShowSnackBar(true);
				setTimeout(() => {
					setShowSnackBar(false);
				}, 3000);
			}
		}
		
		setIsLoading(false);

	};

	// Settings
	const getSettings = async () => {

		setIsLoading(true);
		const query = '';
		const res = await graphQLFetch(query, {user});
		if (res) {
			if (res.error) {
				setSnackMsg({
					text: res.error.message,
					bgColor: 'var(--red)',
					color: 'var(--white)'
				});
				setShowSnackBar(true);
				setTimeout(() => {
					setShowSnackBar(false);
				}, 3000);
			}else {
				setAccentColor(res.data.accentColor);
				document
					.querySelector('body')
					.style.setProperty('--accent-color', res.data.accentColor);
				localStorage.setItem("accentColor", res.data.accentColor);
			}
			
		}
		setIsLoading(false);
		
	};


	const [gapiurl, setGapiurl] = useState("d");

	const getGapiUrl = async () => {
		try {
			setIsLoading(true);
			const res = await axiosIns.get(`/api/calendar/gapi`);
			if (res.status === 200) {
				setGapiurl(res.data.url);
			}
			setIsLoading(false);
		} catch (error) {
			setSnackMsg({
				text: 'Opps, integration services temporarily down',
				bgColor: 'var(--red)',
				color: 'var(--white)'
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 2000);
			setIsLoading(false);
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
	
	const updateAccentColor = async c => {
		setAccentColor(c);
		document
			.querySelector("body")
			.style.setProperty("--accent-color", c);
		localStorage.setItem("accentColor", c);
		setIsLoading(true);
		const query = '';
		let color = {color: c, uid: user._id}
		const res = await graphQLFetch(query, {color});
		if (res) {
			if (res.error) {
				setSnackMsg({
					text: res.error.message,
					bgColor: 'var(--red)',
					color: 'var(--white)'
				});
				setShowSnackBar(true);
				setTimeout(() => {
					setShowSnackBar(false);
				}, 3000);
			}else {
				setSnackMsg({
					text: res.data.message,
					bgColor: 'var(--green)',
					color: 'var(--white)'
				});
				setShowSnackBar(true);
				setTimeout(() => {
					setShowSnackBar(false);
				}, 3000);
			}
		}
		
		setIsLoading(false);

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
		unpinNote,
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
		calendarDate,
		setCalendarDate,
		gapiurl,
		setGapiurl,
		getGapiUrl
	};
};
