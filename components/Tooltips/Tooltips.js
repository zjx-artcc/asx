'use client'
import dynamic from 'next/dynamic';

const DynamicTooltips = dynamic(() => import('./DynamicTooltips'), {
  ssr: false
});



const Sectors = (props) => {
  return (
    <div>
      <DynamicTooltips {...props} />
    </div>
  )
}

export default Sectors;