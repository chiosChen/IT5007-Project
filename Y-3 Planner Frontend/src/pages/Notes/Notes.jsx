import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Fab from "../../components/Button/Fab";
import Empty from "../../components/Empty/Empty";
import GlobalContext from "../../context/GlobalContext";
import { Masonry, MasonryBox } from "../../layout/Masonry/Masonry";
import { nullNotes } from "../../utils/images";
import { notesNavLinks } from "../../utils/navigation";
import AddNote from "./AddNote";
import Note from "./Note";
import "./notes.css";

export default function Notes() {
	const [showAddNoteBox, setShowAddNoteBox] = useState(false);
	const { setSideBarLinks, getAllNotes, notes, isAuthenticated } = useContext(GlobalContext);

	useEffect(() => {
		setSideBarLinks(notesNavLinks);
		window.scrollTo(0, 0);
		getAllNotes();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);



	return (
		<main className="notes">
			{notes.length > 0 ? (
				<section className="notes-body">
					<Masonry>
						{notes?.map(
							(note, index) =>
								!note.archived &&
								!note.trashed && note.pinned && (
									<MasonryBox key={index}>
										<Note {...note} />
									</MasonryBox>
								)
						)}
						{notes?.map(
							(note, index) =>
								!note.archived &&
								!note.trashed && !note.pinned && (
									<MasonryBox key={index}>
										<Note {...note} />
									</MasonryBox>
								)
						)}
					</Masonry>
				</section>
			) : (
				<Empty
					img={nullNotes}
					text="Start Building Your Note Wall Now"
					cta={{
						text: "Add a note",
						icon: "add",
						action: () => setShowAddNoteBox(true),
					}}
				/>
			)}
			<Fab icon="edit" onClick={() => setShowAddNoteBox(true)} />
			{showAddNoteBox && (
				isAuthenticated ?
				<AddNote close={() => setShowAddNoteBox(false)} />
				: <Navigate to="/login" />
			)}
		</main>
	);
};

