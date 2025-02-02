import AirspaceContainerForm from "@/components/Admin/AirspaceContainer/AirspaceContainerForm";
import {Card, CardContent, Typography} from "@mui/material";

export default async function Page() {
    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>New Airspace Condition Container</Typography>
                <AirspaceContainerForm/>
            </CardContent>
        </Card>
    );
}