import moment from "moment";
import React, { useContext, useState } from "react";
import IconButton from "../../components/Button/IconButton";
import MaterialIcons from "../../components/MaterialIcons";
import GlobalContext from "../../context/GlobalContext";
import { Popup } from "../../layout/Popup/Popup";
import EventPopup from "./EventPopup";

export default function Event({
	title,
	description,
	date,
	time,
	type,
	link,
	trashed,
	expired,
	...rest
}) {
	const { theme, moveOneEventToBin, recycleOneEvent, deleteOneEvent } = useContext(GlobalContext);
	
	const setIcon = e => {
		switch (e) {
			case "Dating":
				return "favorite";
			case "Party":
				return "Liquor"
			case "Birthday":
				return "cake";
			case "Meeting":
				return "group";
			case "Festival":
				return "festival";
			default:
				return "event";
		}
	};

	const getColor = e => {
		switch (e) {
			case "Birthday":
				return "blue";
			case "Dating":
				return "pink";
			case "Meeting":
				return "indigo";
			case "Festival":
				return "purple";
			case "Party":
				return "red";
			case "Appointment":
				return "green"
			default:
				return "bgcolor";
		}
	};

	const [openEventPopup, setOpenEventPopup] = useState(false);

	const [openTrashPopup, setOpenTrashPopup] = useState(false);

	const [popupCta, setPopupCta] = useState({
		text: "Move to Bin",
		color: "red",
		icon: "delete",
		onClick: () => {
			moveOneEventToBin(rest._id);
			setOpenTrashPopup(false);
		},
	});

	const [popupContent, setPopupContent] = useState(
		<>
			Move the event to Trash Bin?
		</>
	);

	return (
		<div
			className="events-body-event event"
			style={{
				backgroundColor: `var(--${getColor(type)}-${
					theme === "light" ? "100" : "700"
				})`,
			}}
		>
			<div
				className="event__icon"
				onClick={() => setOpenEventPopup(true)}
			>
				<MaterialIcons>{setIcon(type)}</MaterialIcons>
			</div>
			<div className="event-details">
				<div
					className="event-details__title"
					onClick={() => setOpenEventPopup(true)}
				>
					{title || type}
				</div>
				<div
					className="event-details__date"
					onClick={() => setOpenEventPopup(true)}
				>
					{time ? `${moment(date).format("YYYY-MMM-DD")} ${time}` : `${moment(date).format("YYYY-MMM-DD")}`}
				</div>
				<div className="event-details__delete">
					{trashed ? (
						<>
							<IconButton
								icon="restore"
								fill="var(--back-shadow-light)"
								title="Restore Event"
								onClick={() => {
									setPopupCta(() => ({
										text: "Restore",
										color: "green",
										icon: "restore",
										onClick: () => {
											recycleOneEvent(rest._id);
											setOpenTrashPopup(false);
										},
									}));
									setPopupContent(() => (
										<>
											Restore this event?
										</>
									));
									setOpenEventPopup(false);
									setOpenTrashPopup(true);
								}}
							/>
							<IconButton
								icon="delete_forever"
								fill="var(--back-shadow-light)"
								title="Delete Event"
								onClick={() => {
									setPopupCta(() => ({
										text: "Delete",
										color: "red",
										icon: "delete_forever",
										onClick: () => {
											deleteOneEvent(rest._id);
											setOpenTrashPopup(false);
										},
									}));
									setPopupContent(() => (
										<>
											Delete this event forever? This action can't be undone.
										</>
									));
									setOpenEventPopup(false);
									setOpenTrashPopup(true);
								}}
							/>
						</>
						) : 
						(
						<IconButton
							icon="delete"
							fill="var(--back-shadow-light)"
							title="Move Event to Bin"
							onClick={() => {
								setPopupCta(() => ({
									text: "Move to Bin",
									color: "red",
									icon: "delete",
									onClick: () => {
										moveOneEventToBin(rest._id);
										setOpenTrashPopup(false);
									},
								}));
								setPopupContent(() => (
									<>
										Move the event to Trash Bin?
									</>
								));
								setOpenEventPopup(false);
								setOpenTrashPopup(true);
							}}
						/>
					)}
				</div>
			</div>
			{openEventPopup && (
				<EventPopup
					title={title}
					description={description}
					date={date}
					time={time}
					type={type}
					link={link}
					color={getColor(type)}
					close={() => setOpenEventPopup(() => false)}
					{...rest}
				/>
			)}
			{openTrashPopup && (
				<Popup
					width="50%"
					height="fit-content"
					breakpoints={{
						tab: ["60%", "fit-content"],
						mobile: ["90%", "fit-content"],
					}}
					cta={popupCta}
					close={() => setOpenTrashPopup(false)}
				>
					<span style={{ fontSize: "1.25rem", lineHeight: "1.5rem" }}>
						{popupContent}
					</span>
				</Popup>
			)}
		</div>
	);
};

