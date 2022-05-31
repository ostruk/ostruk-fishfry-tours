import React, { useState } from "react";
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Icon from '@mui/material/Icon';
import Fab from '@mui/material/Fab';

function ColumnTitle(props){
    let icon;
    let addButton=null;
    switch (props.title){
        case "Docked":
            icon = <Icon>anchor</Icon>
            addButton = <Fab color="warning" aria-label="add" id="add-button" onClick={props.handleAddClick}>
                            <Icon>add</Icon>
                        </Fab>
            break;
        case "Outbound to Sea":
            icon = <Icon>waves</Icon>
            break;
        case "Inbound to Harbor":
            icon = <Icon>landscape</Icon>
            break;
        case "Maintenance":
            icon = <Icon>build</Icon>
            break;
    }
    return <div className="column-title">
            {addButton}
            <Grid container direction="row" alignItems="center" justifyContent="center" spacing={1}>
                <Grid item style={{color:"#ffff"}}>
                    {icon}
                </Grid>
                <Grid item>
                    <Typography variant="h5" component="div" style={{color:"#ffff"}}>{props.title}</Typography>
                </Grid>
            </Grid>
            </div>;
}

export default ColumnTitle;