import React from "react";
import { Link } from "react-router-dom";
import { Row, Col } from "../../layout/Responsive";
import modules from "../../modules";
import MaterialIcons from "../MaterialIcons";
import "./app-box.css";


export default function AppBox({ close }) {
	return (
		<section className="app-box">
			<div className="app-box-cover" onClick={close}></div>
			<div className="app-box-container" data-aos="zoom-in">
				<Row>
					{modules.map((module, index) => (
						<Col lg={50} md={50} sm={50} key={index}>
							<Link to={module.route} className="app-box-link">
								<MaterialIcons>{module.icon}</MaterialIcons>
								<span>{module.title}</span>
							</Link>
						</Col>
					))}
				</Row>
			</div>
		</section>
	);
};


