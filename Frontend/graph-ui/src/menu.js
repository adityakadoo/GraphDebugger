
//import './menu.css';
//import React,{useState,useEffect,Component} from 'react';



import React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";

const App = () => {
const [anchorEl, setAnchorEl] = React.useState(null);

const handleClose = () => {
	setAnchorEl(null);
};

const handleClick = (event) => {
	setAnchorEl(event.currentTarget);
};

return (
	<div
	style={{
		marginLeft: "40%",
	}}
	>
	<h2>How to use Menu Component in ReactJS?</h2>
	<Button
		aria-controls="simple-menu"
		aria-haspopup="true"
		onClick={handleClick}
	>
		Open Menu List
	</Button>
	<Menu
		keepMounted
		anchorEl={anchorEl}
		onClose={handleClose}
		open={Boolean(anchorEl)}
	>
		<MenuItem onClick={handleClose}>My Account</MenuItem>
		<MenuItem onClick={handleClose}>Settings</MenuItem>
		<MenuItem onClick={handleClose}>Profile</MenuItem>
		<MenuItem onClick={handleClose}>Logout</MenuItem>
	</Menu>
	</div>
);
};

export default App;
