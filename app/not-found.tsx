import React from 'react'
import Image from 'next/image'

const Custom404 = () => {
  return (
    <div className="container mx-auto w-full items-center justify-center 2xl:border-x-8 2xl:border-neutral-focus">

      <div className="flex flex-row items-center justify-center m-10">
        <Image className='items-center' src={'/404.png'} alt="Logo" width={600} height={600} priority />
      </div>

      <h1 className="text-center text-2xl text-error m-10">Błąd 404 - strona nie została odnaleziona</h1>
    </div>
  )
}

export default Custom404