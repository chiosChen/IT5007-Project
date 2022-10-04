import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import { Input } from "../../components/Input/Input";
import MaterialIcons from "../../components/MaterialIcons";
import GlobalContext from "../../context/GlobalContext";
import { Row, Col } from "../../layout/Responsive";
import { registerBg, welcome } from "../../utils/images";
import "./register.css";

export default function Register() {
	const { setSnackMsg, setShowSnackBar, setIsLoading, axiosIns } = useContext(GlobalContext);
	const navigate = useNavigate();
	const [registerUser, setRegisterUser] = useState({
		fname: "",
		lname: "",
		email: "",
		username: "",
		password: "",
		confirmPassword: "",
		avatar: "",
	});
	const handleChange = e => {
		const { name, value } = e.target;
		setRegisterUser( cur => ({
			...cur,
			[name]: value,
		}));
	};
	const handleSubmit = async e => {
		e?.preventDefault();
		if (registerUser.password !== registerUser.confirmPassword) {
			setSnackMsg({
				text: "Passwords do not match!",
				bgColor: "var(--red)",
				color: "var(--white)",
			});
			setShowSnackBar(true);
			setTimeout(() => {
				setShowSnackBar(false);
			}, 3000);
		} else {
			try {
				setIsLoading(true);
				const res = await axiosIns.post("/api/auth/register", {...registerUser});
				if (res.status === 200) {
					setSnackMsg({
						text: res?.data.message,
						bgColor: "var(--green)",
						color: "var(--white)",
					});
					setShowSnackBar(true);
					setTimeout(() => {
						setShowSnackBar(false);
					}, 3000);
					setIsLoading(false);
					navigate("/profile");
				}
			} catch (error) {
				setSnackMsg({
					text: error?.response?.data?.message,
					bgColor: "var(--red)",
					color: "var(--white)",
				});
				setShowSnackBar(true);
				setTimeout(() => {
					setShowSnackBar(false);
				}, 3000);
				setIsLoading(false);
			}
		}
	};
	return (
		<section
			className="register"
			style={{
				backgroundImage: `url(${welcome})`,
			}}
		>
			<div className="register-container" data-aos="zoom-in">
				<div className="register-left">
					<div className="legin-left-top">
						<div className="register-left-title">Your privacy is our first concern!</div>
						<form
							className="register-left-form"
							onSubmit={handleSubmit}
						>
							<Row>
								<Col lg={50} md={50}>
									<Input
										value={registerUser.fname}
										name="fname"
										type="text"
										placeholder="First Name"
										icon="person"
										onChange={handleChange}
										required
									/>
								</Col>
								<Col lg={50} md={50}>
									<Input
										value={registerUser.lname}
										name="lname"
										type="text"
										placeholder="Last Name"
										icon="person"
										onChange={handleChange}
										required
									/>
								</Col>
								<Col lg={50} md={50}>
									<Input
										value={registerUser.username}
										name="username"
										type="text"
										placeholder="Username"
										icon="account_circle"
										onChange={handleChange}
										required
									/>
								</Col>
								<Col lg={50} md={50}>
									<Input
										value={registerUser.email}
										name="email"
										type="email"
										placeholder="Email"
										icon="mail"
										onChange={handleChange}
										required
									/>
								</Col>
								<Col lg={50} md={50}>
									<Input
										value={registerUser.password}
										name="password"
										type="password"
										placeholder="Password"
										icon="key"
										onChange={handleChange}
										required
									/>
								</Col>
								<Col lg={50} md={50}>
									<Input
										value={registerUser.confirmPassword}
										name="confirmPassword"
										type="password"
										placeholder="Confirm Password"
										icon="lock"
										onChange={handleChange}
										required
									/>
								</Col>
								<Col lg={100} md={100} sm={100}>
									<Input
										value={registerUser.avatar}
										name="avatar"
										type="url"
										placeholder="Profile Photo"
										icon="photo_camera"
										onChange={handleChange}
										style={{
											width: "100%",
										}}
									/>
								</Col>
							</Row>
							<div className="register-left-form-group">
								<span></span>
								<Button
									type="submit"
									text="Register"
									color="brown"
								/>
							</div>
						</form>
					</div>
					<div className="register-left-bottom">
						<span>Already have an account? </span>
						<Link to="/login"> Log In</Link>
					</div>
				</div>
				<div
					className="register-right"
					style={{
						backgroundImage: `url(${registerBg})`,
					}}
				>
					<button className="icon" onClick={() => navigate("/")}>
						<MaterialIcons>close</MaterialIcons>
					</button>
				</div>
			</div>
		</section>
	);
};
