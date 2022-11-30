import React, { useContext, useState } from "react";
import moment from "moment";
import { Input, TextArea, Select } from "../../components/Input/Input";
import MaterialIcons from "../../components/MaterialIcons";
import Dialog from "../../layout/Dialog/Dialog";
import GlobalContext from "../../context/GlobalContext";

export default function EventPopup({
	close,
	title,
	description,
	date,
	time,
	type,
	link,
	color,
	...rest
}) {
	let originalEvent = { title, description, date, time, type, link };

	const { updateOneEvent, setSnackMsg, setShowSnackBar } = useContext(GlobalContext);

	const [edit, setEdit] = useState(false);

	const [currEvent, setCurrEvent] = useState({
		title,
		description,
		date,
		time,
		type,
		link
	});

	const getOptions = () => {
		let res = [type];
		let ops = ['Appointment', 'Party', 'Meeting', 'Festival', 'Birthday', 'Dating', 'Other'];
		for (let i of ops) {
			if (i != type) res.push(i);
		}
		return res;
	}

	const handleChange = e => {
		const { name, value } = e.target;
		setCurrEvent( cur => ({ ...cur, [name]: value }));
	};

	const handleSubmit = async e => {
		e?.preventDefault();
		if (!currEvent.title || !currEvent.description) {
			currEvent.title = originalEvent.title;
			currEvent.description = originalEvent.description;
			setSnackMsg ({
				text: `An event must have a title and a description`,
				bgColor: "var(--red)",
				color: "var(--white)"
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			return;
		}
		let updatedEvent = {};

		for (let i in currEvent) {
			if ( currEvent[i] !== originalEvent[i] && currEvent[i] )
				updatedEvent = { ...updatedEvent, [i]: currEvent[i] };
			else if (currEvent[i] !== originalEvent[i] && !currEvent[i])
				updatedEvent = { ...updatedEvent, [i]: originalEvent[i] };
		}
		
		updateOneEvent(rest._id, updatedEvent);

	};

	return (
		<Dialog
			title={currEvent.title}
			close={close}
			cta={{
				text: edit ? "Save" : "Edit",
				icon: edit ? "save" : "edit",
				action: () => {
					if (edit) handleSubmit();
					setEdit(e => !e);
				},
				color: color,
			}}
			color={color}
		>
			<div className="event-dialog" style={{ margin: "1rem 0" }}>
				<form className="event-dialog-form" onSubmit={handleSubmit}>
					<Input
						name="title"
						placeholder="Event Title"
						icon="edit"
						readOnly={!edit}
						required
						value={currEvent.title}
						onChange={handleChange}
					/>
					<TextArea
						name="description"
						placeholder="Event Description"
						icon="notes"
						rows={5}
						required
						value={currEvent.description}
						onChange={handleChange}
						readOnly={!edit}
					/>
				
					<Input
						type="date"
						name="date"
						readOnly={!edit}
						value={moment(currEvent.date).format(
							"yyyy-MM-DD"
						)}
						onChange={handleChange}
						icon="calendar_month"
						placeholder="Event Date"
					/>
					<Select
						name="type"
						disabled={!edit}
						options={getOptions()}
						icon="event"
						placeholder="Event Type"
						onChange={handleChange}
					/>
					{(currEvent.time &&  currEvent.type === "Meeting") && (
						<Input
							name="time"
							readOnly={!edit}
							value={currEvent.time}
							icon="schedule"
							type="time"
							placeholder="Event Time"
							onChange={handleChange}
						/>
					)}
					{currEvent.type === "Meeting"  && 
							(edit ? 
								(
								<Input
									name="link"
									type="url"
									value={currEvent?.link}
									icon="link"
									placeholder="Event Link"
									onChange={handleChange} 
								/>
								
								) : 
								(<a
									href={currEvent?.link}
									target="_blank"
									style={{
										width: "90%",
										margin: "2rem 1rem",
										display: "flex",
									}}
									rel="noreferrer"
								>
									<MaterialIcons
										style={{
											color: "var(--indigo)",
											margin: "0 0.5rem",
										}}
									>
										link
									</MaterialIcons>
									{currEvent?.link?.length > 8 &&
									currEvent?.link.substr(0, 8) ===
										"https://"
										? currEvent?.link.substr(
												8,
												currEvent?.link.length
											)
										: currEvent?.link}
								</a>)
			
							)}
				</form>
			</div>
		</Dialog>
	);
};

