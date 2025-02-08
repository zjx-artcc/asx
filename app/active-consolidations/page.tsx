import React from 'react';
import AirspaceViewer from "@/components/Viewer/AirspaceViewer";
import {Button, Card, CardContent, Container, Stack, Typography} from "@mui/material";
import {Home, Info} from "@mui/icons-material";
import Link from "next/link";
import prisma from "@/lib/db";

const {IDS_CONSOLIDATIONS_URL} = process.env;

export type IdsConsolidation = {
    primarySectorId: string;
    secondarySectorIds: string[];
};

export default async function Page() {

    const res = await fetch(IDS_CONSOLIDATIONS_URL || '', {
        next: {
            revalidate: 10,
        },
    });

    if (!res.ok) {
        return (
            <Container maxWidth="lg" sx={{mt: 2,}}>
                <Card>
                    <CardContent>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{mb: 1,}}>
                            <Info color="error"/>
                            <Typography variant="h5">Unable to Load Active Consolidations</Typography>
                        </Stack>
                        <Typography gutterBottom>We could not communicate with the I.D.S. properly in order to fetch the
                            most up to date radar consolidations.</Typography>
                        <Typography gutterBottom>If this problem persists, inform the Webmaster or the web
                            team.</Typography>
                        <Link href="/" style={{color: 'inherit', textDecoration: 'none',}}>
                            <Button variant="contained" size="large" startIcon={<Home/>}>
                                Home
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </Container>
        );
    }

    const data: IdsConsolidation[] = await res.json();

    const defaultConditions = await prisma.activeConsolidationsDefaultConditions.findFirst({
        include: {
            conditions: true,
        },
    });

    return (
        <AirspaceViewer idsConsolidations={data} defaultConditions={defaultConditions?.conditions || []}/>
    );
}