import React, { useContext } from "react";
import GlobalContext from "../../context/GlobalContext";
import MaterialIcons from "../MaterialIcons";
import "./input.css";

export const Input = ({
	name,
	placeholder,
	type,
	autoFocus,
	readOnly,
	icon,
	...rest
}) => {
	const { accentColor } = useContext(GlobalContext);
	return (
		<div className="form-group">
			<label
				style={{
					color: document.body.classList.contains("dark")
						? `var(--${accentColor}-100)`
						: `var(--${accentColor})`,
				}}
			>
				<MaterialIcons>{icon}</MaterialIcons>
			</label>
			<input
				name={name}
				placeholder={placeholder}
				type={type}
				autoFocus={autoFocus}
				readOnly={readOnly}
				{...rest}
			/>
		</div>
	);
};

export const TextArea = ({
	name,
	placeholder,
	type,
	autoFocus,
	readOnly,
	icon,
	...rest
}) => {
	const { accentColor } = useContext(GlobalContext);
	return (
		<div className="form-group">
			<label
				style={{
					top: 0,
					transform: "translate(50%, 25%)",
					color: document.body.classList.contains("dark")
						? `var(--${accentColor}-100)`
						: `var(--${accentColor})`,
				}}
			>
				<MaterialIcons>{icon}</MaterialIcons>
			</label>
			<textarea
				name={name}
				placeholder={placeholder}
				type={type}
				autoFocus={autoFocus}
				readOnly={readOnly}
				{...rest}
			></textarea>
		</div>
	);
};

export const Select = ({ icon, options, disabled, ...rest }) => {
	const { accentColor } = useContext(GlobalContext);
	return (
		<div className="form-group">
			<label
				style={{
					color: document.body.classList.contains("dark")
						? `var(--${accentColor}-100)`
						: `var(--${accentColor})`,
				}}
			>
				<MaterialIcons>{icon}</MaterialIcons>
			</label>
			<select disabled={disabled} {...rest}>
				{options.map((option, index) => (
					<option key={index} value={option}>
						{option}
					</option>
				))}
			</select>
		</div>
	);
};

