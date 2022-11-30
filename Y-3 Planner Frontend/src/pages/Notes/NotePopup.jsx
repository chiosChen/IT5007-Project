import React, { useContext, useState } from "react";
import Button from "../../components/Button/Button";
import IconButton from "../../components/Button/IconButton";
import { Input, TextArea } from "../../components/Input/Input";
import Dialog from "../../layout/Dialog/Dialog";
import { Row, Col } from "../../layout/Responsive";
import { colors, imageBackgroundUrl } from "../../utils";
import GlobalContext from "../../context/GlobalContext";
import { slash } from "../../utils/images";

export default function NotePopup({
	close,
	title,
	content,
	color,
	image,
	archived,
	trashed,
	pinned,
	...rest
}) {
	const { updateOneNote, setSnackMsg, setShowSnackBar } = useContext(GlobalContext);
	let originalNote = { title, content, color, image, archived };
	const [currNote, setCurrNote] = useState({
		title,
		content,
		color,
		image,
		archived
	});
	const notesBackgrounds = Array(24).fill(null);
	const [openColorBox, setOpenColorBox] = useState(false);
	const [openImageBox, setOpenImageBox] = useState(false);
	const handleChange = e => {
		const { name, value } = e.target;
		setCurrNote( n => ({ ...n, [name]: value }));
	};
	const handleSubmit = async e => {
		e?.preventDefault();
		if (!currNote.title || !currNote.content) {
			currNote.title = originalNote.title;
			currNote.content = originalNote.content;
			setSnackMsg ({
				text: `A note must have a title and content`,
				bgColor: "var(--red)",
				color: "var(--white)"
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
			return
		}
		let updatedNote = {};
		for (let i in currNote) {
			if (currNote[i] !== originalNote[i] && currNote[i])
				updatedNote = { ...updatedNote, [i]: currNote[i] };
			else if (currNote[i] !== originalNote[i] && !currNote[i])
				updatedNote = { ...updatedNote, [i]: originalNote[i] };
		}
		
		updateOneNote(rest._id, updatedNote);
	};
	return (
		<Dialog
			close={close}
			color={currNote.color}
			cta={{
				text: "Save Note",
				icon: "save",
				action: () => handleSubmit(),
			}}
			bodyStyle={{
				backgroundImage:
					currNote.image >= 0 && currNote.image < 24
						? `url(${imageBackgroundUrl(currNote.image)})`
						: "none",
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
				color: color === "bgcolor" ? "var(--tcolor)" : "var(--black)",
				backgroundColor:
					currNote.image >= 0 && currNote.image < 24
						? "rgba(255,255,255,0.65)"
						: `var(--${currNote.color}-100)`,
			}}
		>
			<form className="add-note-form" onSubmit={handleSubmit}>
				<Input
					name="title"
					placeholder="Note Title"
					icon="edit"
					type="text"
					value={currNote.title}
					onChange={handleChange}
					disabled={trashed}
				/>
				<TextArea
					name="content"
					placeholder="Take a Note..."
					icon="notes"
					rows={5}
					value={currNote.content}
					onChange={handleChange}
					disabled={trashed}
				/>
				{!trashed && (
					<>
						<div
							className="form-group"
							style={{ justifyContent: "flex-start" }}
						>
							<div className="add-note-form-group">
								<IconButton
									fill={`var(--${currNote.color}-400)`}
									icon="palette"
									title='Colorbox'
									onClick={(e) => {
										e.preventDefault();
										setOpenColorBox(true);
									}}
								/>
								{openColorBox && !trashed && (
									<>
										<div className="add-note-color-box">
											<Row>
												{colors.map(
													(thisColor, index) => (
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
																	borderRadius:
																		"500px",
																	margin: "0.5rem",
																}}
																onClick={(
																	e
																) => {
																	e.preventDefault();
																	setCurrNote(
																		(
																			p
																		) => ({
																			...p,
																			color: thisColor,
																		})
																	);
																	setOpenColorBox(
																		false
																	);
																}}
															></button>
														</Col>
													)
												)}
											</Row>
										</div>
									</>
								)}
							</div>
							<div className="add-note-form-group">
								<IconButton
									fill={`var(--${currNote.color}-400)`}
									icon="image"
									title='Image Box'
									onClick={(e) => {
										e.preventDefault();
										setOpenImageBox(true);
									}}
								/>
								{openImageBox && !trashed && (
									<>
										<div
											className="add-note-image-box"
											style={{
												width: "20rem",
												height: "12rem",
											}}
										>
											<Row>
												<Col lg={20} md={25} sm={33}>
													<button
														style={{
															width: "2.5rem",
															height: "2.5rem",
															backgroundImage: `url(${slash})`,
															backgroundSize:
																"100% 100%",
															backgroundPosition:
																"center",
															backgroundRepeat:
																"no-repeat",
															borderRadius:
																"500px",
															margin: "0.5rem",
														}}
														onClick={(e) => {
															e.preventDefault();
															setCurrNote(
																(p) => ({
																	...p,
																	image: -1,
																})
															);
															setOpenImageBox(
																false
															);
														}}
													></button>
												</Col>
												{notesBackgrounds.map(
													(thisImage, index) => (
														<Col
															lg={20}
															md={25}
															sm={33}
															key={index}
														>
															<button
																style={{
																	width: "2.5rem",
																	height: "2.5rem",
																	backgroundImage: `url(${imageBackgroundUrl(
																		index
																	)})`,
																	backgroundSize:
																		"cover",
																	backgroundPosition:
																		"center",
																	backgroundRepeat:
																		"no-repeat",
																	borderRadius:
																		"500px",
																	margin: "0.5rem",
																}}
																onClick={(
																	e
																) => {
																	e.preventDefault();
																	setCurrNote(
																		cur => ({
																			...cur,
																			image: index,
																		})
																	);
																	setOpenImageBox(
																		false
																	);
																}}
															></button>
														</Col>
													)
												)}
											</Row>
										</div>
									</>
								)}
							</div>
							<div className="add-note-form-group">
								<IconButton
									fill={
										currNote.archived
											? `var(--${currNote.color}-400)`
											: "transparent"
									}
									icon="archive"
									title={archived?'Unarchive':'Archive'}
									onClick={(e) => {
										e.preventDefault();
										setCurrNote( cur => ({
											...cur,
											archived: !cur.archived,
										}));
									}}
								/>
							</div>
						</div>
						<div className="form-group">
							<Button
								text="Cancel"
								onClick={(e) => {
									e.preventDefault();
									setCurrNote({
										title,
										content,
										color,
										image,
										archived,
									});
									close();
								}}
								variant="outline"
							/>
							<Button text="Save" type="submit" />
						</div>
					</>
				)}
			</form>
			{(openColorBox || openImageBox) && (
				<div
					className="add-note-cover"
					onClick={() => {
						setOpenColorBox(false);
						setOpenImageBox(false);
					}}
				></div>
			)}
		</Dialog>
	);
};

