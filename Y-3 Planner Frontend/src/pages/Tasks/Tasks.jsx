import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Fab from "../../components/Button/Fab";
import Empty from "../../components/Empty/Empty";
import GlobalContext from "../../context/GlobalContext";
import { Masonry, MasonryBox } from "../../layout/Masonry/Masonry";
import { nullTasks } from "../../utils/images";
import { tasksNavLinks } from "../../utils/navigation";
import AddTask from "./AddTask";
import Task from "./Task";
import "./tasks.css";

export default function Tasks() {

	const [showAddTaskBox, setShowAddTaskBox] = useState(false);
	const [tasksToRender, setTasksToRender] = useState([]);
	const { setSideBarLinks, tasks, getAllTasks, isAuthenticated } = useContext(GlobalContext);

	useEffect(() => {
		setSideBarLinks(tasksNavLinks);
		window.scrollTo(0, 0);
		getAllTasks();
		// eslint-disable-next-line react-hooks/exhaustive-deps
		
	}, [setSideBarLinks]);

	useEffect(() => {
		let allTasks = [...tasks];
		let newTasks = allTasks.filter( e => !e.done && !e.trashed );
		// newTasks = newTasks.map( e => ({
		// 			...e,
		// 			date: new Date(e.date)
		// 		}));
		setTasksToRender(newTasks);
	}, [tasks]);

	return (
		<main className="tasks">
			{tasksToRender.length > 0 ? (
				<>
					<section className="tasks-head">
						<span>Tasks</span>
					</section>
					<section className="tasks-body">
						<div className="tasks-body-section">
							<span className="tasks-body-section__head">
								Don't stop! You are almost there!
							</span>
							<div className="tasks-body-section__body">
								<Masonry lg={4} md={3} sm={2}>
									{tasksToRender?.map(
										(task, index) =>
											!task?.done &&
											!task?.trashed && (
												<MasonryBox key={index}>
													<Task {...task} />
												</MasonryBox>
											)
									)}
								</Masonry>
							</div>
						</div>
					</section>
				</>
			) : (
				<Empty
					img={nullTasks}
					text="Time to set up a goal!"
					cta={{
						text: "Add a task",
						icon: "add",
						action: () => setShowAddTaskBox(true),
					}}
				/>
			)}
			<Fab icon="add_task" onClick={() => setShowAddTaskBox(true)} />
			{showAddTaskBox && (
				isAuthenticated ?
				<AddTask close={() => setShowAddTaskBox(false)} />
				: <Navigate to="/login" />
			)}
		</main>
	);
};

