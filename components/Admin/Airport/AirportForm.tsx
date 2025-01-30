'use client';
import { Alert, Box, Stack, TextField } from "@mui/material";
import { Airport, AirportCondition } from "@prisma/client";
import Form from "next/form";
import FormSaveButton from "../Form/FormSaveButton";
import { createOrUpdateAirport } from "@/actions/airport";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function AirportForm({ airport, conditions = [], }: { airport?: Airport, conditions?: AirportCondition[], }) {

    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {

        const {errors, airport: newAirport} = await createOrUpdateAirport(formData);

        if (errors) {
            toast.error(errors.map(e => e.message).join('. '));
            return;
        }

        toast.success(`Airport ${airport ? 'updated' : 'created'}.`);
        if (!airport) {
            router.push('/admin/airports');
        }
    }

    return (
        <Form action={handleSubmit}>
            <input type="hidden" name="id" value={airport?.id || ''} />
            <Stack direction="column" spacing={2}>
                <TextField name="icao" label="ICAO *" variant="filled" defaultValue={airport?.icao} fullWidth />
                <TextField name="conditions" label="Conditions *" placeholder="Seperate with a comma (,)" variant="filled" defaultValue={conditions.map(c => c.name).join(',')} fullWidth />
                <Box>
                    <FormSaveButton />
                </Box>
            </Stack>
        </Form>
    )
}