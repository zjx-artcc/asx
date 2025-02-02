import React from 'react';
import {Card, CardContent, Typography} from "@mui/material";
import OrderList from "@/components/Admin/Order/OrderList";
import prisma from "@/lib/db";
import {updateAirspaceContainerOrder} from '@/actions/airspace';

export default async function Page() {

    const containers = await prisma.airspaceConditionContainer.findMany({
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
                <Typography variant="h5" gutterBottom>Airspace Condition Container Order</Typography>
                <OrderList items={containers.map((a) => ({id: a.id, name: a.name, order: a.order,}))}
                           onSubmit={updateAirspaceContainerOrder}/>
            </CardContent>
        </Card>
    );
}