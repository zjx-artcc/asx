'use client';
import React from 'react';
import {IconButton, Tooltip} from "@mui/material";
import {Share} from "@mui/icons-material";
import {toast} from "react-toastify";

export default function ActiveConsolidationsCopyButton() {

    const handleClick = async () => {
        await navigator.clipboard.writeText('https://asx.zjxartcc.org/active-consolidations');

        toast.success('Active consolidations link copied to clipboard');
    }

    return (
        <Tooltip title="Copy Active Consolidations Link">
            <IconButton sx={{mr: 1,}} onClick={handleClick} color="inherit">
                <Share/>
            </IconButton>
        </Tooltip>
    );
}