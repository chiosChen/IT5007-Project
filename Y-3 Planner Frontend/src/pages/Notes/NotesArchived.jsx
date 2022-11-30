import React, { useContext, useEffect } from "react";
import Empty from "../../components/Empty/Empty";
import GlobalContext from "../../context/GlobalContext";
import { Masonry, MasonryBox } from "../../layout/Masonry/Masonry";
import { nullArchive } from "../../utils/images";
import { notesNavLinks } from "../../utils/navigation";
import Note from "./Note";

export default function NotesArchived() {

	const { setSideBarLinks, getAllNotes, notes } = useContext(GlobalContext);

	useEffect(() => {
		setSideBarLinks(notesNavLinks);
		window.scrollTo(0, 0);
		getAllNotes();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [setSideBarLinks]);
	
	return (
		<main className="notes">
			<section className="notes-body">
				{notes.some((p) => p.archived && !p.trashed) ? (
					<Masonry>
						{notes.map(
							(note, index) =>
								!note.trashed &&
								note.archived && note.pinned && (
									<MasonryBox key={index}>
										<Note {...note} />
									</MasonryBox>
								)
						)}
						{notes.map(
							(note, index) =>
								!note.trashed &&
								note.archived && !note.pinned && (
									<MasonryBox key={index}>
										<Note {...note} />
									</MasonryBox>
								)
						)}
					</Masonry>
				) : (
					<Empty
						img={nullArchive}
						text="Archived Notes will be shown here."
					/>
				)}
			</section>
		</main>
	);
};

