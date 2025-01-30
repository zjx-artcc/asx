import React from 'react';
import {Card, CardContent, Typography} from "@mui/material";
import OrderList from "@/components/Admin/Order/OrderList";
import prisma from "@/lib/db";
import { updateAirportOrder } from '@/actions/airport';

export default async function Page() {

    const airports = await prisma.airport.findMany({
        select: {
            id: true,
            icao: true,
            order: true,
        },
        orderBy: {
            order: 'asc',
        },
    })

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>Airport Order</Typography>
                <OrderList items={airports.map((a) => ({id: a.id, name: a.icao, order: a.order,}))}
                           onSubmit={updateAirportOrder}/>
            </CardContent>
        </Card>
    );
}