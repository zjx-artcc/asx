import MappingJsonForm, {MappingJsonWithCondition} from "@/components/Admin/MappingJson/MappingJsonForm";
import SectorMappingForm from "@/components/Admin/SectorMapping/SectorMappingForm";
import prisma from "@/lib/db";
import {Box, Card, CardContent, Typography} from "@mui/material";
import {notFound} from "next/navigation";

export default async function Page({ params }: { params: Promise<{ id: string, sectorId: string }>}) {

    const { sectorId } = await params;

    const sector = await prisma.sectorMapping.findUnique({
        where: {
            id: sectorId,
        },
        include: {
            radarFacility: true,
            mappings: {
                include: {
                    airspaceCondition: {
                        include: {
                            container: true,
                        },
                    },
                },
            },
        },
    });

    if (!sector) {
        notFound();
    }

    const allConditions = await prisma.airspaceCondition.findMany({
        include: {
            container: true,
        },
        orderBy: {
            container: {
                order: 'asc',
            },
        },
    });


    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>Sector Mapping - {sector.radarFacility.name} - {sector.name}</Typography>
                <SectorMappingForm sectorMapping={sector} radarFacility={sector.radarFacility} />
                <Box sx={{ mt: 2}}>
                    <MappingJsonForm parent={sector} mappings={sector.mappings as MappingJsonWithCondition[]} allConditions={allConditions} />
                </Box>
            </CardContent>
        </Card>
    );

}