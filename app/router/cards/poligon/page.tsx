'use client'
import React, { useState } from 'react'

const Poligon = () => {
  const [rate, setRate] = useState(1);

  return (
    <div className="w-full flex flex-col justify-center items-center gap-2">
      <span className='text-lg'>Ocena</span>
      <input
        type="range"
        min="0"
        max="1"
        value={rate}
        className="range range-info"
        step="1"
        onChange={e => {
          setRate(parseInt(e.target.value));
        }}
      />
      <div className="w-full flex justify-between text-xs px-2">

        <span className={`text-2xl ${rate === 0 ? 'text-red-600' : 'text-white'}`}>0</span>
        <span className={`text-2xl ${rate === 1 ? 'text-green-600' : 'text-white'}`}>1</span>
      </div>
    </div>
  )
}

export default Poligon