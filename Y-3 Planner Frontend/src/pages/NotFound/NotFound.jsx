import React from "react";
import Button from "../../components/Button/Button";
import { blueSky, tourist } from "../../utils/images";
import "./not-found.css";

export default function NotFound() {
	return (
		<main
			className="not-found"
			style={{ backgroundImage: `url(${blueSky})` }}
		>
			<div className="not-found-image">
				<img src={tourist} alt="Tourist 404" />
			</div>
			<div className="not-found-content">
				<h1 className="not-found-content__h1">Oops! Error 404</h1>
				<p className="not-found-content__p">
					The page you are looking for is missing...
				</p>
				<div className="not-found-content__buttons">
					<Button
						text="Back to Home"
						link="/"
						variant="fill"
						icon="home"
					/>
					<Button
						text="Send Us a feedback"
						link="/contact"
						variant="outline"
						icon="chat"
					/>
				</div>
			</div>
		</main>
	);
};

