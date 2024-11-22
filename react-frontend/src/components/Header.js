import React, { useContext } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";

import { UserContext } from "../contexts/UserContext";

const Header = () => {
	const { user } = useContext(UserContext);

	return (
		<Navbar bg="primary" variant="dark" expand="lg" sticky="top">
			<Container>
				<Navbar.Brand href="#home">Tourism Trends</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="ml-auto">
						<Nav.Link href="/">Home</Nav.Link>
						<Nav.Link href="dashboard">Dashboard</Nav.Link>
						<Nav.Link href="contact">Contact</Nav.Link>

						{!user && <Nav.Link href="login">Login</Nav.Link>}
						{user && <Nav.Link href="profile">Profile</Nav.Link>}
						{user && user.role === "admin" && (
							<Nav.Link href="admin">Admin</Nav.Link>
						)}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default Header;
