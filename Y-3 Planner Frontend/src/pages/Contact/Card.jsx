import React, { useContext } from "react";
import { GitHub, Linkedin, Mail, Phone, Twitter } from "react-feather";
import GlobalContext from "../../context/GlobalContext";

export default function Card({ name, about, image, socials, color }) {
	const getIcon = e => {
		switch (e) {
			case "github":
				return <GitHub />;
			case "mail":
				return <Mail />;
			case "phone":
				return <Phone />;
			default:
				break;
		}
	};
	const { accentColor, theme } = useContext(GlobalContext);

	return (
		<div
			className="contact-card"
			style={{
				backgroundColor: `var(--${(color ? color : accentColor)}-${
					theme === "light" ? 100 : 700
				})`
			}}
		>
			<div className="contact-card-content">
				<div className="contact-card-content__name">{name}</div>
				<div className="contact-card-content__about">{about}</div>
				<div className="contact-card-content__socials">
					{socials?.map((social, index) => (
						<a
							key={index}
							href={social.link}
							target="_blank"
							title={social.username}
							className="icon"
							rel="noreferrer"
						>
							{getIcon(social.service)}
						</a>
					))}
				</div>
			</div>
			<div
				style={{ backgroundImage: `url(${image})` }}
				className="contact-card-image"
			></div>
		</div>
	);
};

