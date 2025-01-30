'use client';
import { Alert, Autocomplete, Box, Button, Card, CardActions, CardContent, Stack, TextField, Typography } from "@mui/material";
import { Airport, AirportCondition, MappingJson, SectorMapping, VideoMap } from "@prisma/client";
import Form from "next/form";
import { useState } from "react";
import FormSaveButton from "../Form/FormSaveButton";
import { toast } from "react-toastify";
import { updateSectorMappingJsons } from "@/actions/sectorMapping";
import { updateVideoMapJsons, updateVideoMapOrder } from "@/actions/videoMap";
import { useRouter } from "next/navigation";

export type AirportConditionWithAirport = AirportCondition & { airport: Airport };
export type MappingJsonWithCondition = MappingJson & { airportCondition?: AirportConditionWithAirport };

export type NewMapping = {
    airportConditionId?: string;
    videoMapId?: string;
    sectorMappingId?: string;
    file: File;
};

export default function MappingJsonForm({ parent, mappings: existingMappings = [], allConditions }: { parent: VideoMap | SectorMapping, mappings?: MappingJsonWithCondition[], allConditions: AirportConditionWithAirport[], }) {

    const [mappings, setMappings] = useState<MappingJsonWithCondition[]>(existingMappings);
    const [newMappings, setNewMappings] = useState<NewMapping[]>([]);

    const [selectedCondition, setSelectedCondition] = useState<AirportConditionWithAirport | null>(null);

    const addNewMapping = async (formData: FormData) => {
        const airportConditionId = selectedCondition?.id;
        let videoMapId;
        let sectorMappingId;

        if ('idsRadarSectorId' in parent) {
            sectorMappingId = parent.id;
        } else {
            videoMapId = parent.id;
        }

        const file = formData.get('file') as File;

        if (!selectedCondition) {
            setMappings([]);
            setNewMappings([{ airportConditionId, videoMapId, sectorMappingId, file }]);

            toast.warning('All existing mappings deleted.');
        } else {
            setNewMappings([...newMappings, { airportConditionId, videoMapId, sectorMappingId, file }]);
        }

        toast.success('New mapping added. Make sure to save your changes at the end.');

        setSelectedCondition(null);
    }

    const submitChanges = async () => {
        const isSectorMapping = 'idsRadarSectorId' in parent;

        const conditionIds = mappings.map(m => m.airportConditionId);
        const newConditionIds = newMappings.map(m => m.airportConditionId);

        if (newConditionIds.some(id => conditionIds.includes(id || null))) {
            toast.error('You have added a condition that already exists in the mappings.  Please remove the duplicates.');
            return;
        }

        if (isSectorMapping) {
            await submitSectorMappingChanges();
        } else {
            await submitVideoMapChanges();
        }
    }

    const submitSectorMappingChanges = async () => {
        const mappingsToDelete = existingMappings.map(m => m.id).filter(id => !mappings.find(m => m.id === id));

        const res = await updateSectorMappingJsons(mappingsToDelete, newMappings);

        if (res) {
            toast.success('Changes saved.');

            setNewMappings([]);
            window.location.reload();
        } else {
            toast.error('There was an error saving the changes.');
        }
    }

    const submitVideoMapChanges = async () => {
        const mappingsToDelete = existingMappings.map(m => m.id).filter(id => !mappings.find(m => m.id === id));

        const res = await updateVideoMapJsons(mappingsToDelete, newMappings);

        if (res) {
            toast.success('Changes saved.');

            setNewMappings([]);
            window.location.reload();
        } else {
            toast.error('There was an error saving the changes.');
        }
    }

    return (
        <Stack direction="column" spacing={1}>
            {mappings.map(mapping => (
                <Card key={mapping.id} variant="outlined">
                    <CardContent>
                        <Typography variant="h6">{mapping.jsonKey}</Typography>
                        { mapping.airportCondition ? <Typography>Condition: {mapping.airportCondition.airport.icao}/{mapping.airportCondition.name}</Typography> : <Typography>Condition: N/A</Typography> }
                    </CardContent>
                    <CardActions>
                        <Button variant="outlined" color="inherit" onClick={() => {
                            setMappings(mappings.filter(m => m.id !== mapping.id));
                            toast.success('Mapping removed');
                        }}>Delete</Button>
                    </CardActions>
                </Card>
            ))}
            {newMappings.map((mapping, index) => (
                <Card key={index} variant="outlined">
                    <CardContent>
                        <Typography variant="h6">NEW - File Upload</Typography>
                        {mapping.airportConditionId ? <Typography>Condition: {allConditions.find(c => c.id === mapping.airportConditionId)?.airport.icao}/{allConditions.find(c => c.id === mapping.airportConditionId)?.name}</Typography> : <Typography>Condition: N/A</Typography>}
                    </CardContent>
                    <CardActions>
                    <Button variant="outlined" color="inherit" onClick={() => {
                        setNewMappings(newMappings.filter((_, i) => i !== index));
                        toast.success('Mapping removed');
                    }}>Delete</Button>
                    </CardActions>
                </Card>
            ))}
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h6">New Mapping</Typography>
                    <Form action={addNewMapping}>
                        <Stack direction="column" spacing={1}>
                            <Typography variant="subtitle2">JSON file</Typography>
                            <input type="hidden" name="parentId" value={parent.id} />
                            <input type="file" name="file" accept="application/json" />
                            <Autocomplete 
                                options={allConditions}
                                getOptionLabel={(option) => `${option.airport.icao}/${option.name}`}
                                onChange={(e, value) => {
                                    setSelectedCondition(value);
                                }}
                                value={selectedCondition}
                                renderInput={(params) => <TextField {...params} label="Condition (optional)" variant="filled" />}
                            />
                            { !selectedCondition && <Alert severity="warning">You have not selected a condition for this mapping.  This will delete all the other new and existing mappings.</Alert> }
                            <Box>
                                <FormSaveButton />
                            </Box>
                        </Stack>
                    </Form>
                </CardContent>
            </Card>
            <Button variant="contained" size="large" onClick={submitChanges}>Submit Changes</Button>
        </Stack>
    )
}