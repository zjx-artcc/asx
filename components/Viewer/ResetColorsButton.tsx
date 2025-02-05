'use client';
import React from 'react';
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {toast} from "react-toastify";
import {IconButton, Tooltip} from "@mui/material";
import {Palette} from "@mui/icons-material";

export default function ResetColorsButton() {

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleClick = () => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete('colors');
        router.push(`${pathname}?${newSearchParams.toString()}`);
        toast.success(`Colors reset!`);
    }

    return (
        <Tooltip title="Randomize Colors">
            <IconButton onClick={handleClick}>
                <Palette/>
            </IconButton>
        </Tooltip>
    );
}