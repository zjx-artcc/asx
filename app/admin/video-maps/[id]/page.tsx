import MappingJsonForm, {MappingJsonWithCondition} from "@/components/Admin/MappingJson/MappingJsonForm";
import VideoMapForm from "@/components/Admin/VideoMap/VideoMapForm";
import prisma from "@/lib/db";
import {Box, Card, CardContent, Typography} from "@mui/material";
import {notFound} from "next/navigation";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;

    const vm = await prisma.videoMap.findUnique({
        where: {
            id,
        },
        include: {
            mappings: {
                include: {
                    airportCondition: {
                        include: {
                            airport: true,
                        },
                    },
                },
            },
        },
    });
    
    if (!vm) {
        notFound();
    }

    const allConditions = await prisma.airportCondition.findMany({
        include: {
            airport: true,
        },
        orderBy: {
            airport: {
                order: 'asc',
            },
        },
    });

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>Video Map - {vm.name}</Typography>
                <VideoMapForm videoMap={vm} />
                <Box sx={{ mt: 2, }}>
                    <MappingJsonForm parent={vm} allConditions={allConditions} mappings={vm.mappings as MappingJsonWithCondition[]} />
                </Box>
            </CardContent>
        </Card>
    );
}