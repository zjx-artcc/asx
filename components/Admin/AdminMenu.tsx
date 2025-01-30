import {Card, CardContent, List, ListItemButton, ListItemIcon, ListItemText, Typography} from '@mui/material';
import Link from 'next/link';
import React from 'react';
import {
    AirplanemodeActive,
    Home,
    ListAlt,
    Radar,
    Wallpaper,
} from "@mui/icons-material";

export default function AdminMenu() {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" textAlign="center">I.D.S. Management</Typography>
                <List>
                    <Link href="/admin" style={{textDecoration: 'none', color: 'inherit',}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <Home/>
                            </ListItemIcon>
                            <ListItemText primary="Overview"/>
                        </ListItemButton>
                    </Link>
                    <Link href="/admin/airports" style={{textDecoration: 'none', color: 'inherit',}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <AirplanemodeActive />
                            </ListItemIcon>
                            <ListItemText primary="Airports"/>
                        </ListItemButton>
                    </Link>
                    <Link href="/admin/facilities" style={{textDecoration: 'none', color: 'inherit',}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <Radar />
                            </ListItemIcon>
                            <ListItemText primary="Radar Facilities"/>
                        </ListItemButton>
                    </Link>
                    <Link href="/admin/video-maps" style={{textDecoration: 'none', color: 'inherit',}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <Wallpaper />
                            </ListItemIcon>
                            <ListItemText primary="Video Maps"/>
                        </ListItemButton>
                    </Link>

                    <Link href="/admin/logs" style={{textDecoration: 'none', color: 'inherit',}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <ListAlt/>
                            </ListItemIcon>
                            <ListItemText primary="Logs"/>
                        </ListItemButton>
                    </Link>
                </List>
            </CardContent>
        </Card>
    );
}