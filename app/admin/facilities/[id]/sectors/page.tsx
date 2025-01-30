import SectorMappingTable from "@/components/Admin/SectorMapping/SectorMappingTable";
import prisma from "@/lib/db";
import { Reorder } from "@mui/icons-material";
import { Add } from "@mui/icons-material";
import { Button, Box, Card, CardContent, Link, Stack, Typography } from "@mui/material";
import { RadarFacility } from "@prisma/client";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {

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
                <Stack direction="row" spacing={1} justifyContent="space-between">
                    <Typography variant="h5">{facility.name} - Sectors</Typography>
                    <Box>
                        <Link href={`/admin/facilities/${facility.id}/sectors/new`} style={{color: 'inherit',}}>
                            <Button variant="contained" startIcon={<Add/>}>New Sector Mapping</Button>
                        </Link>
                    </Box>
                </Stack>
                <SectorMappingTable facility={facility} />
            </CardContent>
        </Card>
    )
}