'use client';
import React from 'react';
import {Card, CardContent, Typography} from "@mui/material";

export default function Map({videoMapKey, sectorKeys}: { videoMapKey: string, sectorKeys: string[] }) {


    return (
        <Card sx={{height: '100%',}}>
            <CardContent>
                <Typography variant="h5" gutterBottom>RENDER MAP HERE</Typography>
                <Typography variant="subtitle1">VIDEO MAP KEY: {videoMapKey}</Typography>
                <Typography variant="subtitle2">SECTOR KEY(S): {sectorKeys.join('\n')}</Typography>
            </CardContent>
        </Card>
    );

}