import moment from "moment";
import React, { useContext, useState } from "react";
import Button from "../../components/Button/Button";
import IconButton from "../../components/Button/IconButton";
import { TextArea, Input } from "../../components/Input/Input";
import GlobalContext from "../../context/GlobalContext";
import Dialog from "../../layout/Dialog/Dialog";
import { Col, Row } from "../../layout/Responsive";
import { colors } from "../../utils";

export default function TaskPopup({
	close,
	title,
	description,
	color,
	date,
	done,
	...rest
}) {
	let originalTask = { title, description, color, date, done };
	const { updateOneTask, setSnackMsg, setShowSnackBar } = useContext(GlobalContext);
	const [currTask, setCurrTask] = useState({
		title,
		description,
		color,
		date,
		done,
	});

	const [openColorBox, setOpenColorBox] = useState(false);

	const handleChange = e => {
		const { name, value } = e.target;
		setCurrTask( cur => ({ ...cur, [name]: value }));
	};
	const handleSubmit = async e => {
		e?.preventDefault();
		if (!currTask.title || !currTask.description) {
			currTask.title = originalTask.title;
			currTask.description = originalTask.description;
			setSnackMsg ({
				text: `A task must have a title and a description`,
				bgColor: "var(--red)",
				color: "var(--white)"
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			return;
		}
		let updatedTask = {};
		for (let i in currTask) {
			if (currTask[i] !== originalTask[i])
				updatedTask = { ...updatedTask, [i]: currTask[i] };
			else if (currTask[i] !== originalTask[i] && !currTask[i])
				updatedTask = { ...updatedTask, [i]: originalTask[i] };
		}
		
		updateOneTask(rest._id, updatedTask);
	};

	const handleReset = e => {
		e?.preventDefault();
		setCurrTask({ title, description, color, date, done });
	};

	return (
		<Dialog
			close={close}
			color={currTask.color}
			cta={{
				text: "Save task",
				icon: "save",
				action: () => handleSubmit(),
			}}
			bodyStyle={{ backgroundColor: `var(--${currTask.color}-100)` }}
		>
			<form
				className="add-task-form"
				onSubmit={handleSubmit}
				onReset={handleReset}
			>
				<Input
					name="title"
					placeholder="Task Title"
					icon="edit"
					type="text"
					value={currTask.title}
					onChange={handleChange}
				/>
				<TextArea
					name="description"
					placeholder="Task Description"
					icon="notes"
					type="text"
					value={currTask.description}
					onChange={handleChange}
				/>

				{date && <Input
					name="date"
					placeholder="Due Date"
					icon="calendar_month"
					type="date"
					value={moment(new Date(currTask.date)).format("YYYY-MM-DD")}
					onChange={handleChange}
				/>}
				
				<div
					className="form-group"
					style={{ justifyContent: "flex-start" }}
				>
					<div className="add-task-form-group">
						<IconButton
							fill={`var(--${currTask.color}-400)`}
							icon="palette"
							onClick={(e) => {
								e.preventDefault();
								setOpenColorBox(true);
							}}
						/>
						{openColorBox && (
							<>
								<div className="add-task-color-box">
									<Row>
										{colors.map((thisColor, index) => (
											<Col
												lg={25}
												md={25}
												sm={33}
												key={index}
											>
												<button
													style={{
														width: "2rem",
														height: "2rem",
														backgroundColor: `var(--${thisColor})`,
														borderRadius: "500px",
														margin: "0.5rem",
													}}
													onClick={(e) => {
														e.preventDefault();
														setCurrTask((p) => ({
															...p,
															color: thisColor,
														}));
														setOpenColorBox(false);
													}}
												></button>
											</Col>
										))}
									</Row>
								</div>
							</>
						)}
					</div>
				</div>
				<div className="form-group">
					<Button text="Cancel" type="reset" variant="outline" onClick={() => close()}/>
					<Button text="Save" type="submit" />
				</div>
			</form>
		</Dialog>
	);
};

