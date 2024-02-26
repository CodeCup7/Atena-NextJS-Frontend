'use client'
import { RateCC } from '@/app/classes/rates/rateCC';
import { RatePart } from '@/app/classes/rates/ratePart';
import { valueOfRatePartCC } from '@/app/global';
import { getKeyDiscription, getKeyTitle, getWagRateCC } from '@/app/globalKeys';
import React, { useState } from 'react'

interface RateBlockProps {
    rateCC: RateCC;
    ratePart: RatePart
    prewievMode: boolean;
    updateRateCC: (rateCC: RateCC) => void;
}

const RatePartComponent = (props: RateBlockProps) => {

    const [ocena, setOcena] = useState(props.ratePart.ocena);
    const [nieprawidlowosci, setNieprawidlowosci] = useState(props.ratePart.nieprawidlowosci);
    const [uwagi, setUwagi] = useState(props.ratePart.uwagi);

    return (
        <div>
            <h5 className='text-center my-3 text-green-500'>{getKeyTitle(props.ratePart.key)}</h5>

            <div className={`grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 2xl:grid-rows-1 items-center justify-center border
                    ${props.ratePart.ocena ?? 0 > 0 ? '' : 'border-red-600'}`}>

                {/* WAGA i OCENA */}
                <div className='md:col-span-2 md:flex md:flex-row gap-5 h-full ' >
                    <div className='flex flex-col xl:flex-row w-full '>

                        <div className='flex flex-col items-center justify-start w-full mt-5' >
                            <label className="label">
                                <span className="label-text text-center xl:text-2xl">Waga</span>
                            </label>
                            <label className="label xl:h-16 xl:mt-2">
                                <span className="label-text text-center xl:text-4xl">{getWagRateCC(props.ratePart.key)}%</span>
                            </label>
                        </div>

                        <div className='flex flex-col items-center justify-start w-full xl:mt-5'>
                            <label className="label">
                                <span className="label-text xl:text-2xl">Ocena</span>
                            </label>
                            <select className="select select-bordered xl:select-lg text-center m-2"
                                value={ocena}
                                disabled={props.prewievMode}
                                onChange={e => setOcena(parseInt(e.target.value))}>
                                {valueOfRatePartCC().map((value, index) => (
                                    <option key={index} value={value}>{value}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className='md:col-span-5 2xl:col-span-3 gap-5 p-2 h-full'>
                    <label className="label">
                        <span className="label-text">Nieprawidłowości</span>
                    </label>
                    <textarea value={nieprawidlowosci}
                        className="textarea textarea-bordered h-1/2 w-full"
                        disabled={props.prewievMode}
                        onChange={e => setNieprawidlowosci(e.target.value)} />
                </div>

                <div className='md:col-span-5 2xl:col-span-3 gap-5 p-2 h-full '>

                    <label className="label">
                        <span className="label-text">Uwagi</span>
                    </label>
                    <textarea value={uwagi}
                        className="textarea textarea-bordered h-1/2 w-full"
                        disabled={props.prewievMode}
                        onChange={e => setUwagi(e.target.value)} />
                </div>

                <div className='md:col-span-12 2xl:md:col-span-4 gap-5 p-2 items-center justify-center'>
                    <div className='flex flex-col'>
                        <h5 className='text-center'>Opis wskaźnika</h5>
                        <hr className='opacity-50 m-1'></hr>
                        <p className='text-sm text-justify'>{getKeyDiscription(props.ratePart.key)}</p>
                    </div>
                </div>
            </div></div>
    )
}

export default RatePartComponent