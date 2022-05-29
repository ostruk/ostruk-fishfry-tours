import React, { useState } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Icon from '@mui/material/Icon';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { IconButton } from '@mui/material';

function MyCard(props){
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleDelete = ()=>{
        handleClose();
        props.handleCardRemove({id:props.title,status:props.status});
    }
    const handleEdit = ()=>{
        handleClose();
        props.handleCardEdit({id:props.title,status:props.status});
    }


   

    return <div>
                <Box sx={{ width: 1 }}>
                    <Card>
                        <CardContent>
                            <Grid container direction="row" alignItems="left" spacing={1}>
                                <Grid item>
                                    <Icon>directions_boat</Icon>
                                </Grid>
                                <Grid item style={{ flex: 1 }}>
                                    <Typography variant="h6" component="div">{props.title}</Typography>
                                </Grid>
                                <Grid item >
                                    <IconButton onClick={handleClick}>
                                        <Icon >more_vert</Icon>
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Box>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleDelete}>Delete</MenuItem>
                    <MenuItem onClick={handleEdit}>Edit</MenuItem>
                </Menu>

                
            </div>;
}

export default MyCard;