// '=============================================================================================================
// '*********************** PRÓBA UTWORZENIA KOMPONENTU Z OCENY RATEPART ****************************************
// '=============================================================================================================
'use client'
import { valueOfRatePartCC } from '@/app/global';
import { getWagRateCC } from '@/app/globalKeys';
import React, { useEffect, useState } from 'react'
import { RatePart } from '@/app/classes/rates/ratePart';

interface Props {
    title: string;
    ratePart: RatePart;
    previewMode: boolean;
    description: string;
    onChange: (updatedRatePart: RatePart) => RatePart; 
}

export function RatePartComponent(props: Props) {

    const [score, setScore] = useState(0);

    return (
        <div>
            <h5 className='text-center my-3 text-green-500'>{props.title}</h5>
            <div className='grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 2xl:grid-rows-1 items-center justify-center border'>
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
                                value={score}
                                disabled={props.previewMode}
                                onChange={e => {
                                    const newScore = parseInt(e.target.value);
                                    const updatedRatePart = { ...props.ratePart, ocena: newScore }; // Aktualizacja oceny w RatePart
                                    setScore(newScore); // Ustawienie nowej oceny w stanie lokalnym komponentu
                                    props.onChange(updatedRatePart); // Wywołanie funkcji zwrotnej zaktualizowanym RatePart
                                }}>
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
                    <textarea defaultValue={props.ratePart.nieprawidlowosci}
                        className="textarea textarea-bordered h-1/2 w-full"
                        disabled={props.previewMode}
                        onChange={e => props.ratePart.nieprawidlowosci = e.target.value} />
                </div>
                <div className='md:col-span-5 2xl:col-span-3 gap-5 p-2 h-full '>
                    <label className="label">
                        <span className="label-text">Uwagi</span>
                    </label>
                    <textarea defaultValue={props.ratePart.uwagi}
                        className="textarea textarea-bordered h-1/2 w-full"
                        disabled={props.previewMode}
                        onChange={e => props.ratePart.uwagi = e.target.value} />
                </div>
                <div className='md:col-span-12 2xl:md:col-span-4 gap-5 p-2 items-center justify-center'>
                    <div className='flex flex-col'>
                        <h5 className='text-center'>Opis wskaźnika</h5>
                        <hr className='opacity-50 m-1'></hr>
                        <p className='text-sm text-justify'>{props.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


