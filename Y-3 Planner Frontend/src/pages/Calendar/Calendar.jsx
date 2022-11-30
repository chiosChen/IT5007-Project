/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import _ from "lodash";
import "./calendar.css";
import IconButton from "../../components/Button/IconButton";
import MonthDialogBox from "./MonthDialogBox";
import GlobalContext from "../../context/GlobalContext";
import { calendarImages } from "../../utils/images";
import moment from "moment";

export default function Calendar() {

	const { theme, setCalendarDate, events } = useContext(GlobalContext);

	const days = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];

	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	const colors = [
		"indigo",
		"purple",
		"dark-purple",
		"pink",
		"orange",
		"red",
		"light-green",
		"green",
		"light-blue",
		"blue",
		"cyan",
		"brown",
	];

	const backgroundImgs = calendarImages;

	const [month, setMonth] = useState(1);
	const [year, setYear] = useState(2022);
	const [eventDates, setEventDates] = useState(new Set());


	const [datesToDisplay, setDatesToDisplay] = useState(Array(35).fill(null));
	const [rowsToDisplay, setRowsToDisplay] = useState([...Array(5).keys()]);
	const colsToDisplay = [...Array(7).keys()];




	let currentDate = parseInt(Date().substring(8, 10));
	let currentMonth = new Date().getMonth() + 1;

	const handleDatesToDisplay = (m, y) => {
		let numDays = 31;
		let startDay = new Date(`${m} 1 ${y}`).getDay();
		let isLeapYear = (y % 4 !== 0 || (y % 100 === 0 && y % 400 !== 0)) ? false : true;
		if (m === 4 || m === 6 || m === 9 || m === 11) --numDays;
		else if (m === 2 && isLeapYear) numDays -= 2;
		else if (m === 2 && !isLeapYear) numDays -= 3;
		let r = parseInt((numDays - 7 + startDay) / 7);
		r += (numDays - 7 + startDay) % 7 > 0 ? 2 : 1;
		setRowsToDisplay([...Array(r).keys()]);
		let Dates = Array(7 * r).fill(null);
		let cur = 1;
		for (let i = startDay; i < Dates.length; i++) {
			if (numDays < cur) break;
			Dates[i] = cur++;
		}
		return Dates;
	};

	const handleBackButton = e => {
		e.preventDefault();
		if (month === 1) {
			setMonth(12);
			handleDatesToDisplay(12, year - 1);
			setYear( cur => cur - 1 );
		} else {
			handleDatesToDisplay(month - 1, year);
			setMonth( cur => cur - 1);
		}
	};

	const handleForwardButton = e => {
		e.preventDefault();
		if (month === 12) {
			setMonth(1);
			handleDatesToDisplay(1, year + 1);
			setYear( cur => cur + 1 );
		} else {
			handleDatesToDisplay(month + 1, year);
			setMonth( cur => cur + 1 );
		}
	};

	const handleChangeYear = e => {
		setYear( e.target.value );
		handleDatesToDisplay(month, e.target.value);
	};

	const handleClick = e => {
		const { value }  = e.target.attributes.value;
		let m = month < 10 ? `0${month}` : month;
		let d = value < 10 ? `0${value}` : value;
		setCalendarDate(year + '-' + m + '-' + d);
	}

	useEffect(() => {
		document.title = "Calendar";
		window.scrollTo(0, 0);
		let today = new Date();
		setMonth(today.getMonth()+1);
		setYear(today.getFullYear());
		setDatesToDisplay(
			handleDatesToDisplay(
				today.getMonth() + 1,
				today.getFullYear()
			)
		);
		
	}, []);

	useEffect(() => {
		let allEvents = [...events];
		let dates = new Set();
		for (let event of allEvents) {
			if (!event.trashed) {
				dates.add(event.date)
			}
		}
		setEventDates(dates);
	}, [events]);

	

	useEffect(() => {
		setDatesToDisplay(handleDatesToDisplay(month, year));
	}, [month, year]);

	const [openMonthDialogBox, setOpenMonthDialogBox] = useState(false);

	return (
		<main className="calendar">
			<section
				className="calendar-head"
				style={{
					backgroundColor: `var(--${colors[month-1]}-${
						theme === "light" ? "100" : "700"
					})`,
				}}
			>
				<div className="calendar-head-labels">
					<div
						className="calendar-head-month"
						onClick={() =>
							setOpenMonthDialogBox(!openMonthDialogBox)
						}
						style={{
							width: `calc(${
								months[month-1].length
							}ch + 40px)`,
						}}
					>
						<div className="calendar-head-month-current">
							{months[month-1]}
							<IconButton
								icon={
									openMonthDialogBox
										? "arrow_drop_up"
										: "arrow_drop_down"
								}
								fill={`var(--${colors[month-1]}-400)`}
							/>
						</div>
						{openMonthDialogBox && (
							<MonthDialogBox
								months={months}
								handle={ m => {
									setMonth(m+1);
									handleDatesToDisplay(m+1, year);
								}}
							/>
						)}
					</div>
					<div className="calendar-head-year">
						<input
							name="year"
							value={year}
							onChange={handleChangeYear}
							className="calendar-head-year-input"
						/>
					</div>
				</div>
				<div className="calendar-head-buttons">
					
					<IconButton
						icon="arrow_back"
						fill={`var(--${colors[month-1]}-400)`}
						onClick={handleBackButton}
					/>
					<IconButton
						icon="arrow_forward"
						fill={`var(--${colors[month-1]}-400)`}
						onClick={handleForwardButton}
					/>
				</div>
			</section>
			<section
				className="calendar-body"
				style={{ backgroundImage: `url(${backgroundImgs[month-1]})` }}
			>
				<table className="calendar-table">
					<thead
						style={{
							backgroundColor: `var(--${colors[month-1]}-${
								theme === "light" ? "100" : "700"
							})`
						}}
					>
						<tr>
							{days.map((day, index) => (
								<th key={index}>
									{_.upperCase(day.slice(0, 3))}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{rowsToDisplay.map((row, i) => (
							<tr style={{height:`${100/rowsToDisplay.length}%`}} key={i}>
								{colsToDisplay.map((col, j) => (
									<td
										style={{
											backgroundColor:
												(datesToDisplay[i * 7 + j] === currentDate && month === currentMonth) ? `var(--${colors[month-1]}-100)`: "transparent"
										}}
										key={j}
									>
										
										{
											(datesToDisplay[i * 7 + j] ? 
											 <Link target={'_self'} onClick={handleClick} to='/events' value={datesToDisplay[i * 7 + j]}>{datesToDisplay[i * 7 + j]}</Link>
											: null)
							
										}
										{
											(
												(datesToDisplay[i * 7 + j] && datesToDisplay[i * 7 + j] >= 10 && eventDates.has(moment(`${year}-${month}-${datesToDisplay[i * 7 + j]}`).format("YYYY-MM-DD")))
												|| (datesToDisplay[i * 7 + j] && datesToDisplay[i * 7 + j] < 10 && eventDates.has(moment(`${year}-${month}-0${datesToDisplay[i * 7 + j]}`).format("YYYY-MM-DD")))
												 ? <div style={{'fontSize': 25}} >.</div> : null
												
											)
										}
							
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</section>
		</main>
	);
};

