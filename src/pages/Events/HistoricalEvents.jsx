import React, { useContext, useEffect, useState } from "react";
import GlobalContext from "../../context/GlobalContext";
import { eventsNavLinks } from "../../utils/navigation";
import moment from "moment";
import Empty from "../../components/Empty/Empty";
import { Row, Col } from "../../layout/Responsive";
import Event from "./Event";
import { nullEvents } from "../../utils/images";

export default function HistoricalEvents() {

	const [eventsToRender, setEventsToRender] = useState([]);
	const { setSideBarLinks, events, getAllEvents } = useContext(GlobalContext);

	useEffect(() => {
		setSideBarLinks(eventsNavLinks);
		window.scrollTo(0, 0);
		getAllEvents();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	useEffect(() => {
		let allEvents = [...events];
		let newEvents = allEvents
			.map( e => ({
				...e,
				date: new Date(e.date),
			}))
			.sort((a, b) => b.date - a.date);
		let map = new Map();
		for (let event of newEvents) {
			let presentDate = `${moment(event.date).format("MMMM YYYY")}`;
			let a = map.get(presentDate);
			if (event.expired) {
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
						<span>Historical Events</span>
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
					text={
						<>
							<h3
								style={{
									fontSize: "3rem",
									lineHeight: "4rem",
									margin: "0 0 1rem 0",
								}}
							>
								No historical events
							</h3>
							<span
								style={{
									fontSize: "2rem",
									lineHeight: "3rem",
								}}
							>
								Expired events will be permanantly deleted after 30 days
							</span>
						</>
					}
				/>
			)}
		</main>
	);
};

