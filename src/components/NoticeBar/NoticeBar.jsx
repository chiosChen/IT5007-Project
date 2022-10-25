import React, { useState, useEffect } from "react";
import "./noticebar.css";
import { X } from "react-feather";

export default function NoticeBar({
	text = "Hey!",
	bgColor = "rgba(255, 255, 255, 0.5)",
	color = "",
	close
}) {
	const [move, setMove] = useState(120);

	const [clickClose, setClickClose] = useState(false);

	useEffect(() => {
		if (!clickClose) {
			if (move > 0) {
				setTimeout(() => {
					setMove(move - 1);
				}, 1);
			}
		} else {
			if (move <= 150) {
				setTimeout(() => {
					setMove(move + 1);
				}, 1);
			}
		}
	}, [clickClose, move]);

	const handleClose = () => {
		setClickClose(true);
		if (move >= 150) close();
	};
	
	return (
		<div
			className="notice"
			style={{
				backgroundColor: bgColor,
				color: color,
				transform: `translateX(-${move}%)`,
			}}
		>
			<span className="notice-text">{text}</span>
			<button className="notice-close" onClick={handleClose}>
				<X />
			</button>
		</div>
	);
};

