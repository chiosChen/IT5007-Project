import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Fab from "../../components/Button/Fab";
import Empty from "../../components/Empty/Empty";
import GlobalContext from "../../context/GlobalContext";
import { Row, Col } from "../../layout/Responsive";
import AddEvent from "./AddEvent";
import Event from "./Event";
import "./events.css";
import { eventsNavLinks } from "../../utils/navigation";
import { nullEvents } from "../../utils/images";
import { Input } from "../../components/Input/Input";

export default function Events() {

	const { getAllEvents, events, setSideBarLinks, isAuthenticated, calendarDate, setCalendarDate } = useContext(GlobalContext);

	const [eventsToRender, setEventsToRender] = useState([]);

	const [showAddEventBox, setShowAddEventBox] = useState(false);

	const [selectedDate, setSelectedDate] = useState(calendarDate);;


	const handleChange = e => {
		const { value } = e.target;
		setSelectedDate(value);
	}

	useEffect(() => {
		setSideBarLinks(eventsNavLinks);
		getAllEvents();
		
		if (calendarDate !== moment(new Date()).format('YYYY-MM-DD')) {
			setCalendarDate(moment(new Date()).format('YYYY-MM-DD'));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);



	useEffect(() => {
		let allEvents = [...events];
		let res = [];
		for (let event of allEvents) {
			if (!event.trashed && event.date === selectedDate) {
				res = [
					...res,
					event
				]
			}
		}
		setEventsToRender(res);
	}, [events, selectedDate]);

	return (
		<main className="events">
			<section className="events-head">
				{moment(selectedDate).format("MMM Do YYYY")}
				
			</section>
			<section className="events-calendar">
				<Input
					name="date"
					placeholder="Event Date"
					type="date"
					icon="calendar_month"
					value={selectedDate}
					onChange={handleChange}
				/>
			</section>
			{eventsToRender.length > 0 ? (
				<>
					<section className="events-body">
							<div className="events-body-section">
								<span className="events-body-section__head">
									Events
								</span>
								<div className="events-body-section__body">
									<Row>
										{eventsToRender?.map(
											(event, index) => (
												<Col
													lg={33}
													md={50}
													sm={50}
													key={index}
												>
													<Event {...event} />
												</Col>
											)
										)}
									</Row>
								</div>
							</div>
						
					</section>
				</>
			) : (

				<Empty
					img={nullEvents}
					text={`No Events on ${moment(selectedDate).format("MMM Do YYYY")}`}
					cta={{
						text: "Add One",
						icon: "add",
						action: () => setShowAddEventBox(true)
					}}
				/>
			)}
			<Fab icon="add" onClick={() => setShowAddEventBox(true)} />
			{showAddEventBox && (
				isAuthenticated ?
				<AddEvent close={() => setShowAddEventBox(false)} date={selectedDate} />
				: <Navigate to="/login" />
			)}
		</main>
	);
};

