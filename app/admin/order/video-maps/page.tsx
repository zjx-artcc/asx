import React from 'react';
import {Card, CardContent, Typography} from "@mui/material";
import OrderList from "@/components/Admin/Order/OrderList";
import prisma from "@/lib/db";
import { updateVideoMapOrder } from '@/actions/videoMap';

export default async function Page() {

    const airports = await prisma.videoMap.findMany({
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
                <Typography variant="h5" gutterBottom>Video Map Order</Typography>
                <OrderList items={airports.map((a) => ({id: a.id, name: a.name, order: a.order,}))}
                           onSubmit={updateVideoMapOrder}/>
            </CardContent>
        </Card>
    );
}