import React, { useContext, useState } from "react";
import IconButton from "../../components/Button/IconButton";
import MaterialIcons from "../../components/MaterialIcons";
import GlobalContext from "../../context/GlobalContext";
import TaskPopup from "./TaskPopup";
import { Popup } from "../../layout/Popup/Popup";
import moment from 'moment'


export default function Task({
	title,
	description,
	color,
	date,
	done,
	trashed,
	...rest
}) {
	const {
		theme,
		markTaskAsDone,
		markTaskAsNotDone,
		moveOneTaskToBin,
		recycleOneTask,
		deleteOneTask,
	} = useContext(GlobalContext);



	const [openTaskPopup, setOpenTaskPopup] = useState(false);
	const [openPopup, setOpenPopup] = useState(false);
	const [popupCta, setPopupCta] = useState({
		text: "Move to Bin",
		color: "red",
		icon: "delete",
	});

	const [popupContent, setPopupContent] = useState(
		<>
			Move the note to Trash Bin?
		</>
	);
	return (
		<div
			className="tasks-body-task task"
			style={{
				backgroundColor: `var(--${color}-${
					theme === "light" ? "100" : "700"
				})`,
				// borderColor: `${moment(date).format("YYYY-MMM-DD")===moment(new Date()).format("YYYY-MMM-DD") && !done && !trashed && date? "red":"black"}`
			}}
		>
			<div className="task-title">{title}</div>
			<div className="task-description">{description}</div>
			{date && <div className="task-deadline">{moment(new Date(date)).format("YYYY-MMM-DD")}</div>}
			{!trashed && (
				<button
					className="icon task-control task-control-done"
					onClick={() => {
						done
							? markTaskAsNotDone(rest._id)
							: markTaskAsDone(rest._id);
						setOpenTaskPopup(false);
					}}
				>
					<MaterialIcons
						title={done ? "Mark as not done" : "Mark as done"}
					>
						{done ? "done_all" : "check_circle"}
					</MaterialIcons>
				</button>
			)}
			<div
				className="task-controls"
				style={{
					backgroundColor: `var(--${color}-${
						theme === "light" ? "100" : "700"
					})`,
				}}
			>
				{trashed ? (
					<>
						<IconButton
							icon="restore"
							className="task-control task-control-edit"
							fill="var(--back-shadow-light)"
							title="Restore Task"
							onClick={() => {
								setPopupCta(() => ({
									text: "Restore",
									color: "green",
									icon: "restore",
									onClick: () => {
										recycleOneTask(rest._id);
										setOpenPopup(false);
									},
								}));
								setPopupContent(() => (
									<>
										Restore task?
									</>
								));
								setOpenTaskPopup(false);
								setOpenPopup(true);
							}}
						/>
						<IconButton
							icon="delete_forever"
							className="task-control task-control-delete"
							fill="var(--back-shadow-light)"
							title="Delete Forever"
							onClick={() => {
								setPopupCta(() => ({
									text: "Delete",
									color: "red",
									icon: "delete",
									onClick: () => {
										deleteOneTask(rest._id);
										setOpenPopup(false);
									},
								}));
								setPopupContent(() => (
									<>
										Delete this task forever? This actions can't be undone
									</>
								));
								setOpenTaskPopup(false);
								setOpenPopup(true);
							}}
						/>
					</>
				) : (
					<>
						<IconButton
							icon="edit"
							className="task-control task-control-edit"
							fill="var(--back-shadow-light)"
							title="Edit Task"
							onClick={() => setOpenTaskPopup(true)}
						/>
						<IconButton
							icon="delete"
							className="task-control task-control-delete"
							fill="var(--back-shadow-light)"
							title="Move To Trash"
							onClick={() => {
								setPopupCta(() => ({
									text: "Move to Bin",
									color: "red",
									icon: "delete",
									onClick: () => {
										moveOneTaskToBin(rest._id);
										setOpenPopup(false);
									},
								}));
								setPopupContent(() => (
									<>
										Move the task to Trash Bin?
									</>
								));
								setOpenTaskPopup(false);
								setOpenPopup(true);
							}}
						/>
					</>
				)}
			</div>
			{openTaskPopup && (
				<TaskPopup
					title={title}
					description={description}
					color={color}
					date={date}
					done={done}
					close={() => setOpenTaskPopup(false)}
					{...rest}
				/>
			)}
			{openPopup && (
				<Popup
					width="50%"
					height="fit-content"
					breakpoints={{
						tab: ["60%", "fit-content"],
						mobile: ["90%", "fit-content"],
					}}
					cta={popupCta}
					close={() => setOpenPopup(false)}
				>
					<span style={{ fontSize: "1.25rem", lineHeight: "1.5rem" }}>
						{popupContent}
					</span>
				</Popup>
			)}
		</div>
	);
};

