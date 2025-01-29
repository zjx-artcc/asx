import {Card, CardContent, List, ListItemButton, ListItemIcon, ListItemText, Typography} from '@mui/material';
import Link from 'next/link';
import React from 'react';
import {
    Home,
    ListAlt,
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