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
		graphQLFetch,
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

	return (
		<>
			<main className="profile">
				<form >
					<div className="profile-buttons">
						
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
									readOnly={!edit}
									value={profileUser?.username}
									placeholder="Username"
									title="Username is not editable"
								/>
							</Col>
							{/* <Col lg={50} md={50} sm={100}>
								<Input
									type="text"
									name="bio"
									icon="tips_and_updates"
									readOnly={!edit}
									value={profileUser?.bio}
									onChange={handleChange}
									placeholder="Bio."
								/>
							</Col> */}
							<Col lg={50} md={50} sm={100}>
								<Input
									type="email"
									name="email"
									icon="mail"
									readOnly={!edit}
									value={profileUser?.email}
									
									placeholder="Email Address"
								/>
							</Col>
							{/* <Col lg={50} md={50} sm={100}>
								<Input
									type="tel"
									name="phone"
									icon="call"
									readOnly={!edit}
									value={profileUser?.phone}
									onChange={handleChange}
									placeholder="Phone Number"
								/>
							</Col> */}
							{/* <Col lg={edit ? 50 : 100} md={50} sm={100}>
								<Input
									type="url"
									name="avatar"
									icon="image"
									readOnly={!edit}
									value={profileUser?.avatar}
									placeholder="Avatar"
								/>
							</Col> */}
						</Row>
						<Button className="dispn" title='save' type="submit" />
					</div>
				</form>
			</main>
		</>
	);
};

