import React, { useState } from "react";
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Icon from '@mui/material/Icon';

function ColumnTitle(props){
    let icon;
    switch (props.title){
        case "Docked":
            icon = <Icon>anchor</Icon>
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