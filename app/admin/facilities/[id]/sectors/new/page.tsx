import SectorMappingForm from "@/components/Admin/SectorMapping/SectorMappingForm";
import prisma from "@/lib/db";
import { Card, CardContent, Typography } from "@mui/material";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ id: string, }>}) {

    const { id } = await params;

    const facility = await prisma.radarFacility.findUnique({
        where: {
            id,
        },
        include: {
            sectors: true,
        },
    });

    if (!facility) {
        notFound();
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>New Sector Mapping</Typography>
                <SectorMappingForm radarFacility={facility} />
            </CardContent>
        </Card>
    );
}