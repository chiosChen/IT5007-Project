import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/Input/Input";
import MaterialIcons from "../../components/MaterialIcons";
import GlobalContext from "../../context/GlobalContext";
import { Row, Col } from "../../layout/Responsive";
import "./profile.css";
import Button from "../../components/Button/Button";
import { userFallBackImg } from "../../utils/images";

export default function Profile() {

	const navigate = useNavigate();
	const {
		user,
		setIsLoading,
		axiosIns,
		updateUser,
		setSnackMsg,
		setShowSnackBar,
	} = useContext(GlobalContext);
	const [profileUser, setProfileUser] = useState({
		...user,
	});
	const [edit, setEdit] = useState(false);
	const [userImage, setUserImage] = useState(user?.avatar);
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const handleChange = e => {
		const { name, value } = e?.target;
		if (name === "name") {
			let arr = value.split(" ");
			let f = arr[0];
			arr.shift();
			let l = arr.join(" ");
			setProfileUser((p) => ({
				...p,
				fname: f,
				lname: l,
			}));
		} else setProfileUser( cur => ({ ...cur, [name]: value }));
	};
	const handleSubmit = async e => {
		e?.preventDefault();
		let editedUser = { username: user.username };
		for (let i in profileUser)
			if (profileUser[i] !== user[i])
				editedUser = { ...editedUser, [i]: profileUser[i] };
		try {
			setIsLoading(true);
			const res = await axiosIns.put("/api/auth/edit", {...editedUser});
			if (res.status === 200) {
				setSnackMsg({
					text: res.data.message,
					bgColor: "var(--green)",
					color: "var(--white)",
				});
				setShowSnackBar(true);
				setTimeout(() => {
					setShowSnackBar(false);
				}, 3000);
				updateUser({ ...res.data.user });
				setProfileUser({ ...profileUser, ...res.data.user });
				setUserImage(res.data.user?.avatar);
			} else {
				setSnackMsg({
					text: res.data.message,
					bgColor: "var(--yellow)",
					color: "var(--white)",
				});
				setShowSnackBar(true);
				setTimeout(() => {
					setShowSnackBar(false);
				}, 3000);
			}
			setIsLoading(false);
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
	};
	return (
		<>
			<main className="profile">
				<form onSubmit={handleSubmit}>
					<div className="profile-buttons">
						<button
							className="icon profile-edit"
							onClick={ e => {
								e.preventDefault();
								if (edit) handleSubmit();
								setEdit( p => !p );
							}}
						>
							<MaterialIcons>
								{edit ? "save" : "edit"}
							</MaterialIcons>
						</button>
						<button
							className="icon profile-close"
							onClick={(e) => {
								e.preventDefault();
								if (edit) setEdit((p) => !p);
								else navigate(-1);
							}}
						>
							<MaterialIcons>close</MaterialIcons>
						</button>
					</div>
					<div className="profile-head">
						<div className="profile-head-image">
							<img
								src={userImage}
								alt={user?.name}
								onError={() => setUserImage(userFallBackImg)}
							/>
						</div>
						<div className="profile-head-name">
							<input
								type="text"
								name="name"
								readOnly={!edit}
								value={
									profileUser?.fname +
									" " +
									profileUser?.lname
								}
								onChange={handleChange}
								placeholder="Your Name"
								title="Your Name"
							/>
						</div>
					</div>
					<div className="profile-body">
						<Row>
							<Col lg={50} md={50} sm={100}>
								<Input
									type="text"
									name="username"
									icon="account_circle"
									disabled
									value={profileUser?.username}
									onChange={handleChange}
									placeholder="Username"
									title="Username is not editable"
								/>
							</Col>
							<Col lg={50} md={50} sm={100}>
								<Input
									type="text"
									name="bio"
									icon="tips_and_updates"
									readOnly={!edit}
									value={profileUser?.bio}
									onChange={handleChange}
									placeholder="Bio."
								/>
							</Col>
							<Col lg={50} md={50} sm={100}>
								<Input
									type="email"
									name="email"
									icon="mail"
									readOnly={!edit}
									value={profileUser?.email}
									onChange={handleChange}
									placeholder="Email Address"
								/>
							</Col>
							<Col lg={50} md={50} sm={100}>
								<Input
									type="tel"
									name="phone"
									icon="call"
									readOnly={!edit}
									value={profileUser?.phone}
									onChange={handleChange}
									placeholder="Phone Number"
								/>
							</Col>
							<Col lg={edit ? 50 : 100} md={50} sm={100}>
								<Input
									type="url"
									name="avatar"
									icon="image"
									readOnly={!edit}
									value={profileUser?.avatar}
									onChange={handleChange}
									placeholder="Avatar"
								/>
							</Col>
							{edit && (
								<Col lg={50} md={50} sm={100}>
									<Input
										type="password"
										name="password"
										icon="lock"
										readOnly={!edit}
										value={profileUser?.password}
										onChange={handleChange}
										placeholder="Password"
									/>
								</Col>
							)}
						</Row>
						<Button className="dispn" title='save' type="submit" />
					</div>
				</form>
			</main>
		</>
	);
};

