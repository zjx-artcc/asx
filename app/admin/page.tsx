import React from 'react';
import {Card, CardContent, Stack, Typography} from "@mui/material";
import prisma from "@/lib/db";

export default async function Page() {

    const videoMaps = await prisma.videoMap.count();
    const mappings = await prisma.sectorMapping.count();
    const jsonFiles = await prisma.mappingJson.count();
    const containers = await prisma.airspaceConditionContainer.count();
    const airspaceConditions = await prisma.airspaceCondition.count();

    return (
        <Stack direction="column" spacing={2}>
            <Card>
                <CardContent>
                    <Typography variant="h4">ASX Management</Typography>
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <Typography variant="h6">{videoMaps} video map(s) configured.</Typography>
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
                    <Typography variant="h6">{containers} airspace condition container(s) configured.</Typography>
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <Typography variant="h6">{airspaceConditions} airspace condition(s) configured.</Typography>
                </CardContent>
            </Card>
        </Stack>
    );
}