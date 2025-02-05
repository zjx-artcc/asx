'use client';
import React, {useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import {Add} from "@mui/icons-material";
import {addFromIds} from "@/actions/sectorMapping";
import {toast} from "react-toastify";

export default function SectorMappingIdsAddButton({facilityId}: { facilityId: string }) {

    const [open, setOpen] = useState(false);
    const [idsSectorId, setIdsSectorId] = useState('');

    const submit = async () => {
        const error = await addFromIds(facilityId, idsSectorId);
        if (error) {
            toast.error(error);
            return;
        }

        setOpen(false);
        toast.success('Sector mapping created.');
    }

    return (
        <>
            <Button variant="contained" startIcon={<Add/>} onClick={() => setOpen(true)} sx={{mr: 2,}}>Add from
                I.D.S</Button>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>
                    Add Sector Mapping from I.D.S.
                </DialogTitle>
                <DialogContent>
                    <TextField
                        label="IDS Radar Sector ID *"
                        placeholder="This must be EXACTLY the ID displayed in the IDS."
                        variant="filled"
                        value={idsSectorId}
                        onChange={e => setIdsSectorId(e.target.value)}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={submit}>Add</Button>
                </DialogActions>
            </Dialog>
        </>
    );

}