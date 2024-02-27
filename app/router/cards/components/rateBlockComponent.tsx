
import React from 'react';

import { RateBlock } from '@/app/classes/rates/rateBlock';
import { getRateBlock_MaxRate, getRateBlock_Rate } from '@/app/factory/factory_rateBlock';

interface RateBlockProps {
    title: string;
    score: number
    rateBlock: RateBlock;
}

function rateBlockColor(rateBlock: RateBlock, border: boolean) {

    const score = getRateBlock_Rate(rateBlock);
    const maxRate = getRateBlock_MaxRate(rateBlock)

    if (score === maxRate) {
        if (border) {
            return 'border-info'
        } else {
            return 'bg-info'
        }
    } else if (score < maxRate && score > (maxRate * 60 / 100)) {
        if (border) {
            return 'border-warning'
        } else {
            return 'bg-warning'
        }
    } else {
        if (border) {
            return 'border-error'
        } else {
            return 'bg-error'
        }
    }
}

const RateBlockComponent = (props: RateBlockProps) => {

    return (
        <div className={`flex flex-col border-2 rounded-lg items-center w-full h-20 gap-2 ${rateBlockColor(props.rateBlock, true)}`}>
            <h6 className='text-center text-sm bg-slate-700 w-full rounded-t'>{props.title}</h6>
            <label className='text-2xl'>{props.score} %</label>
            <div className={`w-full h-full rounded-b ${rateBlockColor(props.rateBlock, false)}`}></div>
        </div>
    );

}

export default RateBlockComponent