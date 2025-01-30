import VideoMapForm from "@/components/Admin/VideoMap/VideoMapForm";
import { Card, CardContent, Typography } from "@mui/material";

export default async function Page() {
    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>New Video Map</Typography>
                <VideoMapForm />
            </CardContent>
        </Card>
    );
}