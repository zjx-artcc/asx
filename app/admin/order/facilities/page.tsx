import React from 'react';
import {Card, CardContent, Typography} from "@mui/material";
import OrderList from "@/components/Admin/Order/OrderList";
import prisma from "@/lib/db";
import { updateFacilityOrder } from '@/actions/facility';

export default async function Page() {

    const facilities = await prisma.radarFacility.findMany({
        select: {
            id: true,
            name: true,
            order: true,
        },
        orderBy: {
            order: 'asc',
        },
    })

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>Radar Facility Order</Typography>
                <OrderList items={facilities.map((a) => ({id: a.id, name: a.name, order: a.order,}))}
                           onSubmit={updateFacilityOrder}/>
            </CardContent>
        </Card>
    );
}