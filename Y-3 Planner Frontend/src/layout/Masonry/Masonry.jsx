import React, { useContext, useEffect, useState } from "react";
import GlobalContext from "../../context/GlobalContext";
import "./masonry.css";

export const Masonry = ({ lg = 3, md = 2, sm = 1, children }) => {
	const { breakpoint } = useContext(GlobalContext);
	const [countOfColumns, setCountOfColumns] = useState(breakpoint("mobile") ? sm : breakpoint("tab") ? md : lg);
	useEffect(() => {
		window.addEventListener("change", () => {
			breakpoint("mobile") ?
			setCountOfColumns(sm):
			breakpoint("tab") ? 
			setCountOfColumns(md):
			setCountOfColumns(lg);
		});
	}, [breakpoint, lg, md, sm]);
	return (
		<div
			className="masonry"
			style={{
				columnCount: countOfColumns,
			}}
		>
			{children}
		</div>
	);
};

export const MasonryBox = ({ children }) => (
	<div className="masonry-box">{children}</div>
);


