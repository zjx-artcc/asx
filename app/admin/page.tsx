import React from 'react';
import {Card, CardContent, Stack, Typography} from "@mui/material";
import prisma from "@/lib/db";

export default async function Page() {

    const mappings = await prisma.sectorMapping.count();
    const jsonFiles = await prisma.mappingJson.count();
    const airports = await prisma.airport.count();
    const airportConditions = await prisma.airportCondition.count();

    return (
        <Stack direction="column" spacing={2}>
            <Card>
                <CardContent>
                    <Typography variant="h4">ASX Management</Typography>
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <Typography variant="h6">{mappings} sector mapping(s) configured.</Typography>
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <Typography variant="h6">{jsonFiles} JSON file(s) configured.</Typography>
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <Typography variant="h6">{airports} airport(s) configured.</Typography>
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <Typography variant="h6">{airportConditions} airport condition(s) configured.</Typography>
                </CardContent>
            </Card>
        </Stack>
    );
}