'use client';
import React, {SyntheticEvent, useEffect, useState} from 'react';
import {VideoMapWithMappings} from "@/components/Viewer/AirspaceViewer";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {Autocomplete, Box, Chip, TextField, Typography} from "@mui/material";
import {getConditionChips} from "@/lib/chips";

export default function VideoMapSelector({allVideoMaps}: { allVideoMaps: VideoMapWithMappings[], }) {

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [selectedVideoMaps, setSelectedVideoMaps] = useState<VideoMapWithMappings[]>([]);

    useEffect(() => {
        const selectedVideoMapIds = searchParams.get('videoMaps')?.split(',').filter(Boolean) || [];
        const selectedVideoMaps = allVideoMaps.filter(videoMap => selectedVideoMapIds.includes(videoMap.id));
        setSelectedVideoMaps(selectedVideoMaps);
    }, [allVideoMaps, searchParams]);

    const handleChange = (e: SyntheticEvent, v: VideoMapWithMappings[]) => {
        setSelectedVideoMaps(v);
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete('videoMap');
        newSearchParams.set('videoMaps', v.map(videoMap => videoMap.id).join(','));
        router.push(`${pathname}?${newSearchParams.toString()}`);
    }

    return (
        <Autocomplete
            multiple
            fullWidth
            options={allVideoMaps}
            limitTags={3}
            renderTags={(values, getTagProps) => values.map((value, index) => (
                // eslint-disable-next-line react/jsx-key
                <Chip size="small" label={value.name} {...getTagProps({index,})} />
            ))}
            onChange={handleChange}
            value={selectedVideoMaps}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => <TextField {...params} label="Video Map(s)" variant="filled"/>}
            renderOption={(props, option: VideoMapWithMappings) => {
                const {key, ...optionProps} = props;
                return (
                    <Box
                        component="li"
                        key={key}
                        {...optionProps}>
                        <Typography sx={{mr: 1,}}>{option.name}</Typography>
                        {getConditionChips(option.mappings.flatMap(mapping => mapping.airspaceCondition).filter((ac) => !!ac))}
                    </Box>
                )
            }}
        />
    );
}