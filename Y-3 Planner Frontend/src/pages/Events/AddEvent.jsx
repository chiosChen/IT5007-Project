import React, { useContext, useState } from "react";
import Button from "../../components/Button/Button";
import { TextArea, Select, Input } from "../../components/Input/Input";
import GlobalContext from "../../context/GlobalContext";
import Dialog from "../../layout/Dialog/Dialog";


export default function AddEvent({ close, date }) {
	const { accentColor, 
			addOneEvent } = useContext(GlobalContext);
	
	const [newEvent, setNewEvent] = useState({
		title: "",
		description: "",
		date: date,
		time:"",
		type: "",
		link: ""
	});
	const handleChange = e => {
		const { name, value } = e.target;
		setNewEvent( cur => ({ ...cur, [name]: value }));

	};
	const handleSubmit = async e => {
		e?.preventDefault();
		addOneEvent(newEvent);
		close();
	};
	const handleReset = (e) => {
		e?.preventDefault();
		setNewEvent({
			title: "",
			description: "",
			date: "",
			time:"",
			type: "",
			link: "",
		});
		close();
	};
	return (
		<Dialog
			title="Add a new Event"
			cta={{ text: "Add Event", action: handleSubmit }}
			close={close}
			color='red'
		>
			<form
				className="add-event-form"
				onReset={handleReset}
				onSubmit={handleSubmit}
			>
				<Input
					name="title"
					placeholder="Add a title"
					icon="edit"
					type="text"
					autoFocus
					required
					value={newEvent.title}
					onChange={handleChange}
				/>
				<TextArea
					name="description"
					placeholder="Add a description"
					required
					icon="notes"
					rows={5}
					value={newEvent.description}
					onChange={handleChange}
				/>
				<Input
					name="date"
					placeholder="Event Date"
					type="date"
					icon="calendar_month"
					value={newEvent.date}
					onChange={handleChange}
				/>
				<Input 
					name="time"
					placeholder='Meeting time'
					type="time"
					icon="schedule"
					value={newEvent.time}
					onChange={handleChange}
				/>
				<Select
					name='type'
					icon='event'
					options={['Appointment', 'Party', 'Meeting', 'Festival', 'Birthday', 'Dating', 'Other']}
					onChange={handleChange}
				/>
				{newEvent.type === "Meeting" && (
					<>
						
						<Input
							name="link"
							placeholder="Meeting Link"
							type="url"
							icon="link"
							value={newEvent.link}
							onChange={handleChange} />
					</>
				)}
				<div className="form-group">
					<Button
						text="Cancel"
						type="reset"
						variant="outline"
						color={accentColor}
					/>
					<Button
						text="Add"
						type="submit"
						color={accentColor}
					/>
				</div>
			</form>
		</Dialog>
	);
};

