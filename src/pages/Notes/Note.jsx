import React, { useContext, useState } from "react";
import MaterialIcons from "../../components/MaterialIcons";
import GlobalContext from "../../context/GlobalContext";
import { Popup } from "../../layout/Popup/Popup";
import { copy, imageBackgroundUrl } from "../../utils";
import NotePopup from "./NotePopup";

export default function Note({ title, content, color, image, trashed, archived, ...rest }) {
	const {
		theme,
		archiveOneNote,
		unArchiveOneNote,
		moveOneNoteToBin,
		recycleOneNote,
		deleteOneNote,
	} = useContext(GlobalContext);

	const [openNotePopup, setOpenNotePopup] = useState(false);
	const [openPopup, setOpenPopup] = useState(false);
	const [popupCta, setPopupCta] = useState({
		text: "Move to Trash",
		color: "red",
		icon: "delete",
	});
	const [popupContent, setPopupContent] = useState(
		<>
			Move the note to
			Trash Bin?
		</>
	);
	const handleCopy = (e) => {
		e?.preventDefault();
		let ans = `${title} \n${content}\n`;
		if (archived) ans += " \nNote: This Note is in owner's archives";
		if (trashed) ans += " \nNote: This Note is in owner's bin";
		copy(ans);
	};
	return (
		<div
			className="note"
			style={{
				backgroundImage:
					image >= 0 && image < 24
						? `url(${imageBackgroundUrl(image)})`
						: "none",
				backgroundBlendMode: "lighten",
				backgroundColor:
					image >= 0 && image < 24
						? "rgba(255,255,255,0.65)"
						: `var(--${color}-${
								theme === "light" ? "100" : "700"
						  })`,
			}}
		>
			<div className="note-title" onClick={() => setOpenNotePopup(true)}>
				<span>{title}</span>
			</div>
			<div
				className="note-content"
				onClick={() => setOpenNotePopup(true)}
			>
				{content}
			</div>
			<div className="note-buttons">
				{!trashed ? (
					<>
						<button
							className="note-button"
							title="Background Color"
						>
							<MaterialIcons>palette</MaterialIcons>
						</button>
						<button
							onClick={handleCopy}
							className="note-button"
							title="Copy Note"
						>
							<MaterialIcons>content_copy</MaterialIcons>
						</button>
						{/* <button className="note-button" title="Add to list">
							<MaterialIcons>playlist_add</MaterialIcons>
						</button> */}
						{archived ? (
							<button
								className="note-button"
								title="Unarchive Note"
								onClick={() => {
									setPopupCta(() => ({
										text: "Unarchive Note",
										color: "green",
										icon: "unarchive",
										onClick: () => {
											unArchiveOneNote(rest._id);
											setOpenPopup(false);
										},
									}));
									setPopupContent(() => (
										<>
											Ubarchive Note?
										</>
									));
									setOpenNotePopup(false);
									setOpenPopup(true);
								}}
							>
								<MaterialIcons>unarchive</MaterialIcons>
							</button>
						) : (
							<button
								className="note-button"
								title="Archive Note"
								onClick={() => {
									setPopupCta(() => ({
										text: "Archive Note",
										color: "green",
										icon: "archive",
										onClick: () => {
											archiveOneNote(rest._id);
											setOpenPopup(false);
										},
									}));
									setPopupContent(() => (
										<>
											Archive Note?
										</>
									));
									setOpenNotePopup(false);
									setOpenPopup(true);
								}}
							>
								<MaterialIcons>archive</MaterialIcons>
							</button>
						)}
						<button
							className="note-button"
							title="Delete Note"
							onClick={() => {
								setPopupCta(() => ({
									text: "Move to Bin",
									color: "red",
									icon: "delete",
									onClick: () => {
										moveOneNoteToBin(rest._id);
										setOpenPopup(false);
									},
								}));
								setPopupContent(() => (
									<>
										Move the note to Trash Bin?
									</>
								));
								setOpenNotePopup(false);
								setOpenPopup(true);
							}}
						>
							<MaterialIcons>delete</MaterialIcons>
						</button>
					</>
				) : (
					<>
						<button
							className="note-button"
							title="Restore Note"
							onClick={() => {
								setPopupCta(() => ({
									text: "Restore",
									color: "green",
									icon: "restore",
									onClick: () => {
										recycleOneNote(rest._id);
										setOpenPopup(false);
									},
								}));
								setPopupContent(() => (
									<>
										Restore note?
										
									</>
								));
								setOpenNotePopup(false);
								setOpenPopup(true);
							}}
						>
							<MaterialIcons>restore</MaterialIcons>
						</button>
						<button
							className="note-button"
							title="Delete forever"
							onClick={() => {
								setPopupCta(() => ({
									text: "Delete",
									color: "red",
									icon: "delete",
									onClick: () => {
										deleteOneNote(rest._id);
										setOpenPopup(false);
									},
								}));
								setPopupContent(() => (
									<>
										Delete note forever? This actions can't be undone.
									</>
								));
								setOpenNotePopup(false);
								setOpenPopup(true);
							}}
						>
							<MaterialIcons>delete_forever</MaterialIcons>
						</button>
					</>
				)}
			</div>
			{openNotePopup && (
				<NotePopup
					title={title}
					content={content}
					color={color}
					image={image}
					archived={archived}
					trashed={trashed}
					close={() => setOpenNotePopup(false)}
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

