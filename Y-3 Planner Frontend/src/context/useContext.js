
import { useState } from "react";
import { omit } from "../utils";
import { homeNavLinks } from "../utils/navigation";
import moment from "moment";

// Custom hooks
export default function useGlobalContext() {
	


	const graphQLFetch = async (query, variables = {}) => {
		try {
			const rep = await fetch('http://127.0.0.1:8000/graphql', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({ query, variables })
			});
			const data = await rep.text();
			const res = JSON.parse(data, (k, v) => v);
			return res;
		} catch (error) {
			
			setSnackMsg({
				text: 'Y-3 Planner',
				bgColor: 'var(--green)',
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


	const Authentification = localStorage.getItem("isAuthenticated");
	
	const [isAuthenticated, setIsAuthenticated] = useState(JSON.parse(Authentification) || false);

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

	const verifyUser = async () => {
		const query = `mutation verifyUser($username: String!){
			verifyUser(username: $username) { 
				_id, fname, lname, email, bio, avatar, username, createDate
			}	
		}`;
		const username = user.username + "";
		const res = await graphQLFetch(query, {username});

		if (res.data.verifyUser._id) {
			setUser({ ...res.data.verifyUser })
		}else {
			setIsAuthenticated(false);
			setUser(null);
			localStorage.setItem("isAuthenticated", false);
			localStorage.setItem("user", null);
			synchronize();
		}
	}




	// Events
	const [events, setEvents] = useState([]);

	const getAllEvents = async () => {

		if (!isAuthenticated || !user) {
			setEvents([]);
			return;
		}

		setIsLoading(true);
		const query = `query myGetAllEventsQuery($userID: String!){
			getAllEvents(user: $userID) { 
				title description date time type link trashed _id
			}	
		}`;
		
		const userID = user._id
		
		const res = await graphQLFetch(query, {userID});//API

		if (res) {
			if (res.errors) {
				setSnackMsg({
					text: "Opps error",
					bgColor: 'var(--red)',
					color: 'var(--white)'
				});
				setShowSnackBar(true);
				setTimeout(() => {
					setShowSnackBar(false);
				}, 3000);
			}else {
				setEvents( res.data.getAllEvents );
			}
		}
		setIsLoading(false);
	}

	const addOneEvent = async event => {

			if (!isAuthenticated || !user) {
				setEvents([]);
				return;
			}

			setIsLoading(true);
			event.user = user._id;
			event.trashed = false;
			if (event.type === ""){
				event.type = "Appointment"
			}
			
			const query = `mutation myAddOneEvent($event: inputEvent!){
				addOneEvent(event: $event){
					title description date time type link trashed _id
				}
			}`;
			
			const res = await graphQLFetch(query, {event});//API
			

			if (res) {
				if (res.errors) {
					setSnackMsg({
						text: "Opps error",
						bgColor: 'var(--red)',
						color: 'var(--white)',
					});
					setShowSnackBar(true);
					setTimeout(() => {
						setShowSnackBar(false);
					}, 3000);
				}else {
					setEvents((prev) => {
						return [...prev, res.data];
					});
					setSnackMsg({
						text: "Added Successfully!",
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
			getAllEvents();
	};

	const updateOneEvent = async (eid, updatedEvent) => {

			if (!isAuthenticated || !user) {
				setEvents([]);
				return;
			}
			setIsLoading(true);
			const query = `mutation myUpdateOneEvent($updatedEvent: updatedEvent!, $eid:String!){
				updateOneEvent(event:$updatedEvent, eid:$eid){
					title description date time type link trashed _id
				}
			}`;
			
			
			const res = await graphQLFetch(query, {updatedEvent, eid});//API
			
			if (res) {
				if (res.errors) {
					setSnackMsg({
						text: "Opps error",
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
								: res.data.updateOneEvent
						);
						return newEvents;
					});
					setSnackMsg({
						text: "Edit Success!",
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
		if (!isAuthenticated || !user) {
			setEvents([]);
			return;
		}

		setIsLoading(true);
		const event = {trashed: true}
		const query = `mutation myMoveEventToBin($event: updatedEvent!, $eid:String!){
			updateOneEvent(event:$event, eid:$eid){
				title description date time type link trashed _id
			}
		}`;
		
	
		const res = await graphQLFetch(query, {event, eid});
		

		if (res) {
			if (res.errors) {
				setSnackMsg({
					text: "Opps error",
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
							: res.data.updateOneEvent
					);
					return newEvents;
				});
				setSnackMsg({
					text: "Successfully Trashed!",
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

		if (!isAuthenticated || !user) {
			setEvents([]);
			return;
		}
		setIsLoading(true);
		const event = {trashed: false}
		const query = `mutation myRecycleOneEvent($event: updatedEvent!, $eid:String!){
			updateOneEvent(event:$event, eid:$eid){
				title description date time type link trashed _id
			}
		}`;
		const res = await graphQLFetch(query, {event, eid});
		
		if (res) {
			if (res.errors) {
				setSnackMsg({
					text: "Opps Error",
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
							: res.data.updateOneEvent
					);
					return newEvents;
				});
				setSnackMsg({
					text: "Successfully Recycled!",
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

		if (!isAuthenticated || !user) {
			setEvents([]);
			return;
		}
		setIsLoading(true);
		const query = `mutation myDeleteOneEvent($eid:String!){
			deleteOneEvent(eid:$eid)
		}`;
		const res = await graphQLFetch(query, {eid});
		getAllEvents();
		if (res) {
			if (res.errors) {
				setSnackMsg({
					text:"Opps error",
					bgColor: 'var(--red)',
					color: 'var(--white)'
				});
				setShowSnackBar(true);
				setTimeout(() => {
					setShowSnackBar(false);
				}, 3000);
			}else {
				setSnackMsg({
					text: "Deleted Successfully!",
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
		if (!isAuthenticated || !user) {
			setNotes([]);
			return;
		}
		setIsLoading(true);
		const query = `mutation myUpdateOneNote($updatedNote: updatedNote!, $nid:String!){
			updateOneNote(note:$updatedNote, nid:$nid){
				title content image color archived trashed pinned _id
			}
		}`;		
		let updatedNote = {pinned: true};
		
		const res = await graphQLFetch(query, {updatedNote, nid});
	

		if (res) {
			if (res.errors) {
				setSnackMsg({
					text: "Opps error",
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
						e._id !== nid ? e : res.data.updateOneNote
					);
					return newNotes;
				});
				setSnackMsg({
					text: "Successfully Pinned!",
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

	const unPinNote = async nid => {
		if (!isAuthenticated || !user) {
			setNotes([]);
			return;
		}
		setIsLoading(true);
		const query = `mutation myUpdateOneNote($updatedNote: updatedNote!, $nid:String!){
			updateOneNote(note:$updatedNote, nid:$nid){
				title content image color archived trashed pinned _id
			}
		}`;		
		let updatedNote = {pinned: false};
		
		const res = await graphQLFetch(query, {updatedNote, nid});
		
		if (res) {
			if (res.errors) {
				setSnackMsg({
					text: "Opps error",
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
						e._id !== nid ? e : res.data.updateOneNote
					);
					return newNotes;
				});
				setSnackMsg({
					text: "Successfully Unpinned!",
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
		if (!isAuthenticated || !user) {
			setNotes([]);
			return;
		}
		setIsLoading(true);
		const userID = user._id
		const query = `query myGetAllNotes($userID:String!){
			getAllNotes(user:$userID){
				_id title content image color archived trashed pinned
			}
		}`;
		

		const res = await graphQLFetch(query, {userID});
		
		if (res) {
			if (res.errors) {
				setSnackMsg({
					text: "Opps error",
					bgColor: 'var(--red)',
					color: 'var(--white)'
				});
				setShowSnackBar(true);
				setTimeout(() => {
					setShowSnackBar(false);
				}, 3000);
			}else {
				setNotes(res.data.getAllNotes);
			}
		}
		
		setIsLoading(false);
	};

	const addOneNote = async newNote => {
		if (!isAuthenticated || !user) {
			setNotes([]);
			return;
		}
		setIsLoading(true);
		const query = `mutation myAddOneNote($newNote: inputNote!){
			addOneNote(note: $newNote){
				_id title content image color archived trashed pinned
			}
		}`;
		newNote.user = user._id;
		
		const res = await graphQLFetch(query, {newNote});
		
		if (res) {
			if (res.errors) {
				setSnackMsg({
					text: "Opps error",
					bgColor: 'var(--red)',
					color: 'var(--white)'
				});
				setShowSnackBar(true);
				setTimeout(() => {
					setShowSnackBar(false);
				}, 3000);
			}else {
				setSnackMsg({
					text: "Added Successfully!",
					bgColor: 'var(--green)',
					color: 'var(--white)'
				});
				setNotes( prev => [...prev, res.data.addOneNote] );
				setShowSnackBar(true);
				setTimeout(() => {
					setShowSnackBar(false);
				}, 3000);
			}
			
			
		}
		setIsLoading(false);

	};

	const updateOneNote = async (nid, updatedNote) => {
		if (!isAuthenticated || !user) {
			setNotes([]);
			return;
		}
		setIsLoading(true);
		const query = `mutation myUpdateOneNote($updatedNote: updatedNote!, $nid:String!){
			updateOneNote(note:$updatedNote, nid:$nid){
				title content image color archived trashed pinned _id
			}
		}`;		
		// updatedNote.user = user._id;
		
		const res = await graphQLFetch(query, {updatedNote, nid});
		if (res) {
			if (res.errors) {
				setSnackMsg({
					text: "Opps error",
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
						e._id !== nid ? e : res.data.updateOneNote
					);
					return newNotes;
				});
				setSnackMsg({
					text: "Updated Successfully!",
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
		if (!isAuthenticated || !user) {
			setNotes([]);
			return;
		}
		setIsLoading(true);
		const query = `mutation myUpdateOneNote($updatedNote: updatedNote!, $nid:String!){
			updateOneNote(note:$updatedNote, nid:$nid){
				title content image color archived trashed pinned _id
			}
		}`;		
		let updatedNote = {archived: true};
		const res = await graphQLFetch(query, {updatedNote, nid});
		if (res) {
			if (res.errors) {
				setSnackMsg({
					text: "Opps error",
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
						e._id !== nid ? e : res.data.updateOneNote
					);
					return newNotes;
				});
				setSnackMsg({
					text: "Sucessfully Archived!",
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
		if (!isAuthenticated || !user) {
			setNotes([]);
			return;
		}
		setIsLoading(true);
		const query = `mutation myUpdateOneNote($updatedNote: updatedNote!, $nid:String!){
			updateOneNote(note:$updatedNote, nid:$nid){
				title content image color archived trashed pinned _id
			}
		}`;		
		let updatedNote = {archived: false};
		const res = await graphQLFetch(query, {updatedNote, nid});
		if (res) {
			if (res.errors) {
				setSnackMsg({
					text: "Opps error",
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
						e._id !== nid ? e : res.data.updateOneNote
					);
					return newNotes;
				});
				setSnackMsg({
					text: "Successfully Unarchived!",
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
		if (!isAuthenticated || !user) {
			setNotes([]);
			return;
		}
		setIsLoading(true);
		const query = `mutation myUpdateOneNote($updatedNote: updatedNote!, $nid:String!){
			updateOneNote(note:$updatedNote, nid:$nid){
				title content image color archived trashed pinned _id
			}
		}`;		
		let updatedNote = {trashed: true, pinned: false};
		const res = await graphQLFetch(query, {updatedNote, nid});
		if (res) {
			if (res.errors) {
				setSnackMsg({
					text: "Opps error",
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
						e._id !== nid ? e : res.data.updateOneNote
					);
					return newNotes;
				});
				setSnackMsg({
					text: "Successfully Moved to Bin!",
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
		if (!isAuthenticated || !user) {
			setNotes([]);
			return;
		}
		setIsLoading(true);
		const query = `mutation myUpdateOneNote($updatedNote: updatedNote!, $nid:String!){
			updateOneNote(note:$updatedNote, nid:$nid){
				title content image color archived trashed pinned _id
			}
		}`;		
		let updatedNote = {trashed: false};
		const res = await graphQLFetch(query, {updatedNote, nid});
		if (res) {
			if (res.errors) {
				setSnackMsg({
					text: "Opps error",
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
						e._id !== nid ? e : res.data.updateOneNote
					);
					return newNotes;
				});
				setSnackMsg({
					text: "Successfully Recycled!",
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
		if (!isAuthenticated || !user) {
			setNotes([]);
			return;
		}
		setIsLoading(true);
		const query = `mutation myDeleteOneNote($nid:String!){
			deleteOneNote(nid:$nid)
		}`;
		const res = await graphQLFetch(query, {nid});
		getAllNotes();
		if (res) {
			if (res.errors) {
				setSnackMsg({
					text: "Opps error",
					bgColor: 'var(--red)',
					color: 'var(--white)'
				});
				setShowSnackBar(true);
				setTimeout(() => {
					setShowSnackBar(false);
				}, 3000);
			}else {
				setSnackMsg({
					text: "Successfully Deleted!",
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
		if (!isAuthenticated || !user) {
			setTasks([]);
			return;
		}
		setIsLoading(true);
		const query = `query myGetAllTasksQuery($userID: String!){
			getAllTasks(user: $userID) { 
				title description date color done trashed _id
			}	
		}`;
		const userID = user._id
		const res = await graphQLFetch(query, {userID});
		if (res) {
			if (res.errors) {
				setSnackMsg({
					text: "Opps error",
					bgColor: 'var(--red)',
					color: 'var(--white)'
				});
				setShowSnackBar(true);
				setTimeout(() => {
					setShowSnackBar(false);
				}, 3000);
			}else {
				setTasks(res.data.getAllTasks);
			}
		}
		
		setIsLoading(false);

	};

	const addOneTask = async newTask => {
		if (!isAuthenticated || !user) {
			setTasks([]);
			return;
		}
		setIsLoading(true);
		const query = `mutation myAddOneTask($newTask: inputTask!){
			addOneTask(task: $newTask){
				title description date color done trashed _id
			}
		}`;
		newTask.user = user._id;
		const res = await graphQLFetch(query, {newTask});
		if (res) {
			if (res.errors) {
				setSnackMsg({
					text: "Opps error",
					bgColor: 'var(--red)',
					color: 'var(--white)'
				});
				setShowSnackBar(true);
				setTimeout(() => {
					setShowSnackBar(false);
				}, 3000);
			}else {
				setSnackMsg({
					text: "Successfully Added!",
					bgColor: 'var(--green)',
					color: 'var(--white)'
				});
				setTasks( prev => [...prev, res.data.addOneTask] );
				setShowSnackBar(true);
				setTimeout(() => {
					setShowSnackBar(false);
				}, 3000);
			}
			
		}
		setIsLoading(false);

	};

	const updateOneTask = async (tid, updatedTask) => {
		if (!isAuthenticated || !user) {
			setTasks([]);
			return;
		}
		setIsLoading(true);
		const query = `mutation myUpdateOneTask($updatedTask: updatedTask!, $tid:String!){
			updateOneTask(task:$updatedTask, tid:$tid){
				title description date color done trashed _id
			}
		}`;
		const res = await graphQLFetch(query, {updatedTask, tid});
		if (res) {
			if (res.errors) {
				setSnackMsg({
					text: "Opps error",
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
						e._id !== tid ? e : res.data.updateOneTask
					);
					return newTasks;
				});
				setSnackMsg({
					text: "Successfully Updated!",
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
		if (!isAuthenticated || !user) {
			setTasks([]);
			return;
		}
		setIsLoading(true);
		const updatedTask = {done: true}
		const query = `mutation myUpdateOneTask($updatedTask: updatedTask!, $tid:String!){
			updateOneTask(task:$updatedTask, tid:$tid){
				title description date color done trashed _id
			}
		}`;
		const res = await graphQLFetch(query, {updatedTask, tid});
		if (res) {
			if (res.errors) {
				setSnackMsg({
					text: "Opps error",
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
						e._id !== tid ? e : res.data.updateOneTask
					);
					return newTasks;
				});
				setSnackMsg({
					text: "Successfull Marked as Done!",
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
		if (!isAuthenticated || !user) {
			setTasks([]);
			return;
		}
		setIsLoading(true);
		const updatedTask = {done: false}
		const query = `mutation myUpdateOneTask($updatedTask: updatedTask!, $tid:String!){
			updateOneTask(task:$updatedTask, tid:$tid){
				title description date color done trashed _id
			}
		}`;
		const res = await graphQLFetch(query, {updatedTask, tid});
		if (res) {
			if (res.errors) {
				setSnackMsg({
					text: "Opps error",
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
						e._id !== tid ? e : res.data.updateOneTask
					);
					return newTasks;
				});
				setSnackMsg({
					text: "Successfully Marked as not Done!",
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
		if (!isAuthenticated || !user) {
			setTasks([]);
			return;
		}
		setIsLoading(true);
		const updatedTask = {trashed: true}
		const query = `mutation myUpdateOneTask($updatedTask: updatedTask!, $tid:String!){
			updateOneTask(task:$updatedTask, tid:$tid){
				title description date color done trashed _id
			}
		}`;
		const res = await graphQLFetch(query, {updatedTask, tid});
		if (res) {
			if (res.errors) {
				setSnackMsg({
					text: "Opps error",
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
						e._id !== tid ? e : res.data.updateOneTask
					);
					return newTasks;
				});
				setSnackMsg({
					text: "Successfully Trashed!",
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
		if (!isAuthenticated || !user) {
			setTasks([]);
			return;
		}
		setIsLoading(true);
		const updatedTask = {trashed: false}
		const query = `mutation myUpdateOneTask($updatedTask: updatedTask!, $tid:String!){
			updateOneTask(task:$updatedTask, tid:$tid){
				title description date color done trashed _id
			}
		}`;
		const res = await graphQLFetch(query, {updatedTask, tid});
		if (res) {
			if (res.errors) {
				setSnackMsg({
					text: "Opps error",
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
						e._id !== tid ? e : res.data.updateOneTask
					);
					return newTasks;
				});
				setSnackMsg({
					text: "Successfully Recycled!",
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
		if (!isAuthenticated || !user) {
			setTasks([]);
			return;
		}
		setIsLoading(true);
		const query = `mutation myDeleteOneTask($tid:String!){
			deleteOneTask(tid:$tid)
		}`;
		const res = await graphQLFetch(query, {tid});
		getAllTasks();
		if (res) {
			if (res.errors){
				setSnackMsg({
					text: "Opps error",
					bgColor: 'var(--red)',
					color: 'var(--white)'
				});
				setShowSnackBar(true);
				setTimeout(() => {
					setShowSnackBar(false);
				}, 3000);
			}else {
				setSnackMsg({
					text: "Successfully Deleted!",
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
			if (res.errors) {
				setSnackMsg({
					text: "Opps error",
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
			if (res.errors) {
				setSnackMsg({
					text: "Opps error",
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
		updateUser,
		//SideBars
		openSideBar,
		setOpenSideBar,
		toggleSideBar,
		sideBarLinks,
		setSideBarLinks,
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
		calendarDate,
		setCalendarDate,
		graphQLFetch,
		verifyUser
	};
};
