import React from 'react';
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";
import {Container, Grid2, Typography} from "@mui/material";
import AdminMenu from "@/components/Admin/AdminMenu";
import {Metadata} from "next";

const {IS_STAFF_ENDPOINT} = process.env;

export const metadata: Metadata = {
    title: 'Admin | vZJX Airspace Explorer',
    description: 'vZJX Airspace Explorer admin',
};

export default async function Layout({children}: { children: React.ReactNode }) {

    const session = await getServerSession(authOptions);

    if (!session) {
        return <Typography>Only members of the ARTCC can access the ASX. Login to continue.</Typography>
    }

    const res = await fetch(IS_STAFF_ENDPOINT?.replace('{cid}', session.user.cid) || '');
    const isStaff: boolean = await res.json();
    if (!isStaff) {
        return <Typography>Only staff members of the ARTCC can access the admin section</Typography>
    }

    return (
        <Container maxWidth="xl">
            <Grid2 container columns={9} spacing={2} sx={{mt: 2,}}>
                <Grid2 size={{xs: 9, lg: 2,}}>
                    <AdminMenu/>
                </Grid2>
                <Grid2 size="grow">
                    {children}
                </Grid2>
            </Grid2>
        </Container>
    );
}