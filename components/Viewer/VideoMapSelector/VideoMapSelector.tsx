'use client';
import React, {SyntheticEvent, useEffect, useState} from 'react';
import {VideoMapWithMappings} from "@/components/Viewer/AirspaceViewer";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {Autocomplete, Box, TextField, Typography} from "@mui/material";
import {getConditionChips} from "@/lib/chips";

export default function VideoMapSelector({allVideoMaps}: { allVideoMaps: VideoMapWithMappings[], }) {

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [selectedVideoMap, setSelectedVideoMap] = useState<VideoMapWithMappings | undefined | null>(null);

    useEffect(() => {
        const selectedVideoMapId = searchParams.get('videoMap');
        const selectedVideoMap = allVideoMaps.find(videoMap => videoMap.id === selectedVideoMapId);
        setSelectedVideoMap(selectedVideoMap);
    }, [allVideoMaps, searchParams]);

    const handleChange = (e: SyntheticEvent, v: VideoMapWithMappings | null) => {
        setSelectedVideoMap(v ?? undefined);
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('videoMap', v?.id ?? '');
        router.push(`${pathname}?${newSearchParams.toString()}`);
    }


    return (
        <Autocomplete
            fullWidth
            options={allVideoMaps}
            onChange={handleChange}
            value={selectedVideoMap}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => <TextField {...params} label="Video Map" variant="filled"/>}
            renderOption={(props, option: VideoMapWithMappings) => {
                const {key, ...optionProps} = props;
                return (
                    <Box
                        component="li"
                        key={key}
                        {...optionProps}>
                        <Typography sx={{mr: 1,}}>{option.name}</Typography>
                        {getConditionChips(option.mappings.flatMap(mapping => mapping.airportCondition).filter((ac) => !!ac))}
                    </Box>
                )
            }}
        />
    );
}