'use client'
import dynamic from 'next/dynamic';

const DynamicGeoJSON = dynamic(() => import('./DynamicGeoJSON'), {
  ssr: false
});



const Geojson = (props) => {
  return (
    <div>
      <DynamicGeoJSON {...props} />
    </div>
  )
}

export default Geojson;