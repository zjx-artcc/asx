import FacilityForm from "@/components/Admin/Facility/FacilityForm";
import prisma from "@/lib/db";
import { Card, CardContent, Typography } from "@mui/material";
import { notFound } from "next/navigation";

export default async function Page({params}: {params: Promise<{id: string}>}) {

    const { id } = await params;

    const facility = await prisma.radarFacility.findUnique({
        where: {
            id,
        },
    });

    if (!facility) {
        notFound();
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>Radar Facility - {facility.name}</Typography>
                <FacilityForm facility={facility} />
            </CardContent>
        </Card>
    );
}