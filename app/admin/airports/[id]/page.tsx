import AirportForm from "@/components/Admin/Airport/AirportForm";
import prisma from "@/lib/db";
import { Card, CardContent, Typography } from "@mui/material";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ id: string, }>}) {

    const { id } = await params;

    const airport = await prisma.airport.findUnique({
        where: {
            id,
        },
        include: {
            conditions: true,
        },
    });

    if (!airport) {
        notFound();
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>Airport - {airport.icao}</Typography>
                <AirportForm airport={airport} conditions={airport.conditions} />
            </CardContent>
        </Card>
    );

}