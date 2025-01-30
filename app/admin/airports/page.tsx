import AirportTable from "@/components/Admin/Airport/AirportTable";
import { Add } from "@mui/icons-material";
import { Reorder } from "@mui/icons-material";
import { Button, Box, Card, Stack, Typography, CardContent } from "@mui/material";
import Link from "next/link";

export default async function Page() {

    return (
        <Card>
            <CardContent>
                <Stack direction="row" spacing={1} justifyContent="space-between">
                    <Typography variant="h5">Airports</Typography>
                    <Box>
                        <Link href="/admin/order/airports" style={{color: 'inherit',}}>
                            <Button variant="outlined" color="inherit" size="small" startIcon={<Reorder />}
                                    sx={{mr: 1,}}>Order</Button>
                        </Link>
                        <Link href="/admin/airports/new">
                            <Button variant="contained" startIcon={<Add/>}>New Airport</Button>
                        </Link>
                    </Box>
                </Stack>
                <AirportTable />
            </CardContent>
        </Card>
    );
}