import React, { useContext, useEffect, useState } from "react";
import "./login.css";
import Button from "../../components/Button/Button";
import { Link, useNavigate } from "react-router-dom";
import GlobalContext from "../../context/GlobalContext";
import MaterialIcons from "../../components/MaterialIcons";
import { Input } from "../../components/Input/Input";
import { loginBg, welcome } from "../../utils/images";

export default function Login() {

	const navigate = useNavigate();
	const {
		isAuthenticated,
		setIsAuthenticated,
		updateUser,
		graphQLFetch,
		setIsLoading,
		setSnackMsg,
		setShowSnackBar,
	} = useContext(GlobalContext);

	const [userInfo, setUserInfo] = useState({
		username: "",
		password: "",
	});

	const handleChange = e => {
		const { name, value } = e.target;
		setUserInfo( cur => ({
			...cur,
			[name]: value,
		}));
	};
	const handleSubmit = async e => {
		e?.preventDefault();
		setIsLoading(true);
		const query = `mutation login($userInfo: userInfoInputs!) {
			login(userInfo: $userInfo){
				_id, fname, lname, email, bio, avatar, username, message, createDate
			}
		}`;
		const res = await graphQLFetch(query, {userInfo});
		if (res) {
			if (res.data.login.message) {
				setSnackMsg({
					text: res.data.login.message,
					bgColor: "var(--red)",
					color: "var(--white)",
				});
				setShowSnackBar(true);
				setTimeout(() => {
					setShowSnackBar(false);
				}, 3000);
			}else {
				setSnackMsg({
					text: "Welcome Back",
					bgColor: "var(--green)",
					color: "var(--white)",
				});
				setShowSnackBar(true);
				setTimeout(() => {
					setShowSnackBar(false);
				}, 3000);
				setTimeout(() => {
					setIsAuthenticated(true);
				}, 1000);
				//localStorage.setItem("token", res.data.token);
				localStorage.setItem("isAuthenticated", true);
				delete res.data.login.message;
				updateUser({ ...res.data.login });
			}
		}
			
		setIsLoading(false);

	};

	useEffect(() => {
		if (isAuthenticated) navigate('/');
	}, [isAuthenticated, navigate]);

	return (
		<section
			className="login"
			style={{
				backgroundImage: `url(${welcome})`,
			}}
		>
			<div className="login-container" data-aos="zoom-in">
				<div className="login-left">
					<div className="legin-left-top">
						<div className="login-left-title">We have been waiting for you!</div>
						<form
							className="login-left-form"
							onSubmit={handleSubmit}
						>
							<Input
								icon="person"
								type="text"
								name="username"
								value={userInfo.username}
								onChange={handleChange}
								placeholder="Username"
							/>
							<Input
								icon="lock"
								type="password"
								name="password"
								value={userInfo.password}
								onChange={handleChange}
								placeholder="Password"
							/>
							<div className="login-left-form-group">
								<span></span>
								<Button
									type="submit"
									text="Login"
									color="brown"
								/>
							</div>
						</form>
					</div>
					<div className="login-left-bottom">
						<span> No account yet? <Link to="/register">Register now</Link></span>
						<p>It won't take you too long !</p>
					</div>
				</div>
				<div
					className="login-right"
					style={{
						backgroundImage: `url(${loginBg})`,
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

