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

export default function Events() {

	const { getAllEvents, events, setSideBarLinks, isAuthenticated } = useContext(GlobalContext);

	const [eventsToRender, setEventsToRender] = useState([]);

	const [showAddEventBox, setShowAddEventBox] = useState(false);

	useEffect(() => {
		setSideBarLinks(eventsNavLinks);
		getAllEvents();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		let allEvents = [...events];
		let newEvents = allEvents
			.map( e => ({
				...e,
				date: new Date(e.date)
			}))
			.sort((a, b) => a.date - b.date);

		let map = new Map();
		for (let event of newEvents) {
			let presentDate = `${moment(event.date).format("MMMM YYYY")}`;
			let a = map.get(presentDate);
			if (!event.trashed) {
				if (!a) map.set(presentDate, [event]);
				else map.set(presentDate, [...a, event]);
			}
		}
		let res = [];
		for (const [key, value] of map) {
			res = [
				...res,
				{
					month: key,
					eventsOfMonth: value,
				},
			];
		}
		setEventsToRender(res);
	}, [events]);

	return (
		<main className="events">
			{eventsToRender.length > 0 ? (
				<>
					<section className="events-head">
						<span>Events</span>
					</section>
					<section className="events-body">
						{eventsToRender?.map((element, index) => (
							<div className="events-body-section" key={index}>
								<span className="events-body-section__head">
									{element?.month}
								</span>
								<div className="events-body-section__body">
									<Row>
										{element?.eventsOfMonth?.map(
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
						))}
					</section>
				</>
			) : (
				<Empty
					img={nullEvents}
					text="No Event Waiting For You"
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
				<AddEvent close={() => setShowAddEventBox(false)} />
				: <Navigate to="/login" />
			)}
		</main>
	);
};

