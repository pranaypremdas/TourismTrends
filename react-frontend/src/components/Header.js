import React, { useContext } from "react";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";

import { UserContext } from "../contexts/UserContext";

const Header = () => {
	const { user } = useContext(UserContext);

	return (
		<Navbar bg="primary" variant="dark" expand="lg" sticky="top">
			<Container>
				<Navbar.Brand href="#home">Tourism Trends</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="ml-auto justify-content-end">
						<Nav.Link href="/">Home</Nav.Link>
						<Nav.Link href="/dashboard">Dashboard</Nav.Link>
						{!user && <Nav.Link href="/contact">Pricing</Nav.Link>}

						{!user && <Nav.Link href="/login">Login</Nav.Link>}
						{user && user.role === "user" && (
							<Nav.Link href="profile">My Profile</Nav.Link>
						)}
						{user && user.role === "client_admin" && (
							<NavDropdown title="Client Admin" id="admin-nav-dropdown">
								<NavDropdown.Item href="/admin/users">
									Manage Users
								</NavDropdown.Item>
								{user.client.type !== "Government" && (
									<NavDropdown.Item href="/admin/data">
										Manage Data
									</NavDropdown.Item>
								)}
								<NavDropdown.Divider />
								<NavDropdown.Item href="/user/profile">
									My Profile
								</NavDropdown.Item>
							</NavDropdown>
						)}
						{user && user.role === "admin" && (
							<NavDropdown title="Site Admin" id="admin-nav-dropdown">
								<NavDropdown.Item href="/admin/users">
									Manage Users
								</NavDropdown.Item>
								<NavDropdown.Item href="/admin/data">
									Manage Data
								</NavDropdown.Item>
								<NavDropdown.Divider />
								<NavDropdown.Item href="/admin/reports">
									Reports
								</NavDropdown.Item>
								<NavDropdown.Divider />
								<NavDropdown.Item href="/user/profile">
									My Profile
								</NavDropdown.Item>
							</NavDropdown>
						)}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default Header;
