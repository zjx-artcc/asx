import FacilityForm from "@/components/Admin/Facility/FacilityForm";
import { Card, CardContent, Typography } from "@mui/material";

export default async function Page() {
    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>New Radar Facility</Typography>
                <FacilityForm />
            </CardContent>
        </Card>
    )
}