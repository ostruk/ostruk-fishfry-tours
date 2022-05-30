import React, { useState } from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Icon from '@mui/material/Icon';

function Header(props){
      
    return <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
            <Toolbar>
                <Icon
                style={{"fontSize":"3.2em"}}
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                >
                sailing
                </Icon>
                <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
                Fishfry Tours
                </Typography>
            </Toolbar>
            </AppBar>
        </Box>;
}

export default Header;