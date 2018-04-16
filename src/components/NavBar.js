import React from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink } from 'react-router-dom';
import { Menu, Container, Dropdown, Image } from 'semantic-ui-react';
import logo from '../images/logo.png';

const Navbar = ({ username, onLogout }) => (
  <Menu fixed borderless stackable size="huge" color="blue" inverted>
    <Container>
      <Menu.Item>
        <Image src={logo} size="tiny" />
      </Menu.Item>
      <Menu.Item as={NavLink} to="/timesheet" name="timesheet">
      Timesheet
      </Menu.Item>
      <Menu.Item as={NavLink} to="/leave-request" name="leaveRequest">
      Leave Request
      </Menu.Item>
      <Menu.Item as={NavLink} to="/project" name="project">
      Project
      </Menu.Item>
      <Menu.Item as={NavLink} to="/report" name="report">
      Report
      </Menu.Item>
      <Menu.Menu position="right">
        <Dropdown item pointing text={username}>
          <Dropdown.Menu>
            <Dropdown.Item text="Profile" as={Link} to="/profile" />
            <Dropdown.Item text="Log out" onClick={onLogout} />
          </Dropdown.Menu>
        </Dropdown>
      </Menu.Menu>
    </Container>
  </Menu>
);

Navbar.propTypes = {
  username: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired
};

export default Navbar;
