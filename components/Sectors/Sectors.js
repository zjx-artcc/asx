'use client'
import dynamic from 'next/dynamic';

// const DynamicSectors = dynamic(() => import('./DynamicSectors'), {
//   ssr: false
// });


// const DynamicChpSectors = dynamic(() => import('./ChpSectors'), {
//   ssr: false
// });

const DynamicShdSectors = dynamic(() => import('./ShdSectors'), {
  ssr: false
});

// const DynamicMtvSectors = dynamic(() => import('./MtvSectors'), {
//   ssr: false
// });

// const DynamicJrvSectors = dynamic(() => import('./JrvSectors'), {
//   ssr: false
// });



// export const ChpSectors = (props) => {
//   return (
//     <DynamicChpSectors {...props} />

//   )
// }

export const ShdSectors = (props) => {
  return (
    <DynamicShdSectors {...props} />

  )
}

// export const MtvSectors = (props) => {
//   return (
//     <DynamicMtvSectors {...props} />

//   )
// }

// export const JrvSectors = (props) => {
//   return (
//     <DynamicJrvSectors {...props} />

//   )
// }

