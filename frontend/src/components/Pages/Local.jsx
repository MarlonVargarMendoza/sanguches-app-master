import React from 'react'
import Map from '../Map'
import Navbar from '../Navbar/Navbar'

const Local = () => {
    return (
        <>
            <Navbar />
            <div className='text-center pt-60'>Encuentranos </div>
            <div  className='bg'>
            <Map />

            </div>
        </>
    )
}

export default Local