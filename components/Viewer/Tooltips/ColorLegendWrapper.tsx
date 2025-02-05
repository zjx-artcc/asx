'use client'
import dynamic from 'next/dynamic';

const ColorLegend = dynamic(() => import('./ColorLegend'), {
    ssr: false
});

const AltitudeInformationWrapper = ({colorLegend}: {
    colorLegend: { color: string, name: string, frequency: string, }[]
}) => {
    return <ColorLegend colorLegend={colorLegend}/>
}

export default AltitudeInformationWrapper;