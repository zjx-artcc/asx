import React from 'react';
import prisma from "@/lib/db";
import {Card, CardContent, Typography} from "@mui/material";
import DefaultConditionsSelector from "@/components/Admin/Defaults/DefaultConditionsSelector";

export default async function Page() {

    const defaultActiveConditions = await prisma.activeConsolidationsDefaultConditions.findFirst({
        include: {
            conditions: {
                include: {
                    container: true,
                },
            },
        },
    });

    const allConditions = await prisma.airspaceCondition.findMany({
        orderBy: {
            container: {
                order: 'asc',
            },
        },
        include: {
            container: true,
        },
    });

    const conditions = defaultActiveConditions?.conditions || [];

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>Default Active Conditions</Typography>
                <Typography gutterBottom>These conditions will be active automatically in the active consolidations
                    window.</Typography>
                <DefaultConditionsSelector active={conditions} allConditions={allConditions}/>
            </CardContent>
        </Card>
    );
}