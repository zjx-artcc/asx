import React from 'react';
import {AppBar, Box, Button, Toolbar, Typography} from "@mui/material";
import LoginButton from "@/components/Navbar/LoginButton";
import {Session} from "next-auth";
import Link from "next/link";
import getConfig from 'next/config';
import ColorModeSwitcher from "@/components/Navbar/ColorModeSwitcher";
import Logo from "@/components/Navbar/Logo";
import ActiveConsolidationsCopyButton from "@/components/Navbar/ActiveConsolidationsCopyButton";

const {IS_STAFF_ENDPOINT} = process.env;

export default async function Navbar({session}: { session: Session | null, }) {

    const res = await fetch(IS_STAFF_ENDPOINT?.replace('{cid}', session?.user.cid || 'null') || '');
    const isStaff: boolean = await res.json();
    const {publicRuntimeConfig} = getConfig();

    return (
        <AppBar position="sticky">
            <Toolbar>
                <Box sx={{display: {xs: 'none', sm: 'flex',},}}>
                    <Logo/>
                </Box>
                <Link href="/" style={{textDecoration: 'none', color: 'inherit',}}>
                    <Typography variant="h6" sx={{ml: 2,}}>A.S.X. v{publicRuntimeConfig.version}</Typography>
                </Link>
                <span style={{flexGrow: 1,}}></span>
                <ActiveConsolidationsCopyButton/>
                <ColorModeSwitcher/>
                {session && isStaff && <Link href="/admin" style={{color: 'inherit',}}>
                    <Button variant="outlined" color="inherit" sx={{ml: 1,}}>ADMIN</Button>
                </Link>}
                <LoginButton session={session}/>
            </Toolbar>
        </AppBar>
    );
}