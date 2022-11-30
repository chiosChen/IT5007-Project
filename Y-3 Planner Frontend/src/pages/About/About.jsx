import React from "react";
import favicon from "../../utils/images";
import "./about.css";

export default function About() {

	return (
		<main className="about">
			<section className="about-head">
				<div className="about-head-image">
					<img src={favicon} alt="Planner" />
				</div>
				<div className="about-head-content">
					<span className="about-head-content__title">Y^3 Planner</span>
					<span className="about-head-content__p">
						Privacy first, simple and elegant follow
					</span>
				</div>
			</section>
			<section className="about-body">
				<span>
					Y^3 Planner is a web application by Y^3 Group committed to make your 
					life and work easily!
				</span>
			</section>
			<section className="about-body">
				<span>
					This is prototype is for the submission of the final project for IT5007 
					at National University of Singapore by Y^3 Group.
				</span>
				<span>
					We are still working on the App and will keep updating in the future.
				</span>
				<span>
					Y^3 Planner is open-sourced and shared on Github.
				</span>
			</section>
		</main>

	);
};

