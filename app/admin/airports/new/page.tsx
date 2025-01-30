import AirportForm from "@/components/Admin/Airport/AirportForm";
import { Card, CardContent, Typography } from "@mui/material";

export default async function Page() {
    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>New Airport</Typography>
                <AirportForm />
            </CardContent>
        </Card>
    );
}