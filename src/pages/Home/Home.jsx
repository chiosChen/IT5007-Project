import React, { useContext, useEffect, useState } from "react";
import "./home.css";
import MaterialIcons from "../../components/MaterialIcons";
import LinkButton from "../../components/Button/LinkButton";
import modules from "../../modules";
import { homeNavLinks } from "../../utils/navigation";
import GlobalContext from "../../context/GlobalContext";
import favicon, { homeCardImg, peopleImg } from "../../utils/images";

export default function Home() {

	const [scrolled, setScrolled] = useState(false);
	const vh = window.innerHeight / 100;
	const { theme, setSideBarLinks, breakpoint } = useContext(GlobalContext);

	useEffect(() => {
		window.scrollTo(0, 0);
		document.addEventListener("scroll", () => {
			if (window.scrollY > 25 * vh) setScrolled(true);
			else setScrolled(false);
		});
		setSideBarLinks(homeNavLinks);
		return () => {
			document.removeEventListener("scroll", () => {});
		};
	}, [setSideBarLinks, vh]);

	return (
		<main className="home">
			<div className="card">
				<div
					className="card-frame"
					style={{
						padding: scrolled
							? "0"
							: breakpoint("mobile")
							? "0.5rem 0.65rem"
							: "0.5rem 0.25rem",
					}}
					data-aos="fade-in"
					data-aos-duration={2000}
				>
					<div
						className="card-box"
						style={{
							width: !scrolled ? "99%" : "100%",
							height: !scrolled ? "99%" : "100%",
						}}
					>
						<div className="home-box-head" data-aos="zoom-out">
							<div
								className="home-box-image"
								style={{
									backgroundImage: `url("${homeCardImg}")`
								}}
							>
								<img
									className="home-box-image__img"
									src={favicon}
									alt="favicon"
								/>
							</div>
							<div 
								className="home-box-title"
								style={{
									backgroundImage: `url("${peopleImg}")`
								}}
							>
								<span className="home-box-title__text">
									Planner
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="home-navigation">
				<div className="row">
					{modules.map((module, index) => (
						<div
							className="col-lg-100 col-md-100 col-sm-100"
							key={index}
						>
							<div
								className="home-navigation-card"
								style={{
									flexFlow: breakpoint("mobile")
										? "column"
										: index % 2
										? "row-reverse"
										: "row",
									backgroundColor: `var(--${module.color}-${
										theme === "light" ? "100" : "700"
									})`,
								}}
							>
								<div
									className="home-navigation-card-image"
									style={{
										backgroundImage: `url(${module.poster})`,
									}}
								></div>
								<div className="home-navigation-card-content">
									<span className="home-navigation-card-content__title">
										{module.title}
									</span>
									<span className="home-navigation-card-content__about">
										{module.about}
									</span>
									<LinkButton to={module.route}>
										<span>{module.navTitle}</span>
										<MaterialIcons>
											north_east
										</MaterialIcons>
									</LinkButton>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</main>
	);
};

