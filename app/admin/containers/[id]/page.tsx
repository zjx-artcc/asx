import AirspaceContainerForm from "@/components/Admin/AirspaceContainer/AirspaceContainerForm";
import prisma from "@/lib/db";
import {Card, CardContent, Typography} from "@mui/material";
import {notFound} from "next/navigation";

export default async function Page({params}: { params: Promise<{ id: string, }> }) {

    const {id} = await params;

    const container = await prisma.airspaceConditionContainer.findUnique({
        where: {
            id,
        },
        include: {
            conditions: true,
        },
    });

    if (!container) {
        notFound();
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>Airspace Condition Container - {container.name}</Typography>
                <AirspaceContainerForm container={container} conditions={container.conditions}/>
            </CardContent>
        </Card>
    );

}