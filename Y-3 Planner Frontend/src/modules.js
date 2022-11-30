import {
	calendarPoster,
	eventsPoster,
	notesPoster,
	tasksPoster,
} from "./utils/images";

const modules = [
	{
		title: "Calendar",
		about: "Keep a track of your daily life with a calendar. It can be integrated with your google calendar",
		route: "/calendar",
		poster: calendarPoster,
		color: "green",
		navTitle: "View your calendar",
		icon: "calendar_month",
	},
	{
		title: "Events",
		about: "Always prepared for all your important events and never miss out",
		route: "/events",
		poster: eventsPoster,
		color: "purple",
		navTitle: "View your events",
		icon: "event",
	},
	{
		title: "Notes",
		about: "Create, record, and share your spark and epiphany",
		route: "/notes",
		poster: notesPoster,
		color: "yellow",
		navTitle: "View your notes",
		icon: "note",
	},
	{
		title: "Tasks",
		about: "Have your tasks well-managed and maintain a perfect work-life balance",
		route: "/tasks",
		poster: tasksPoster,
		color: "brown",
		navTitle: "View your tasks",
		icon: "task_alt",
	},
];

export default modules;
