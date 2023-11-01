import { Type_RateCC, Rate_Mode } from "../classes/enums";
import { Queue } from "../classes/queue";
import { RateBlock } from "../classes/rateBlock";
import { RateCC } from "../classes/rateCC";
import { User } from "../classes/user";
import { getRateBlock } from "./factory_rateBlock";


export function CreateNewEmptyRateCC() {

    let rateCC = new RateCC();
    return rateCC;

}

export function CreateNoteCC(typeRate: Type_RateCC, mode: Rate_Mode, id_note: number, id: number, rate: number, agent: User, coach: User, dateRate: string, dateCall: string,
    dateShare: string, idCall: string, queue: Queue, topic: string, extraScore: number, extraScoreTxt: string, ratePartJSON: string,
    wiedzaBlock: RateBlock, obslugaBlock: RateBlock, technikaBlock: RateBlock, komunikacjaBlock: RateBlock, standardBlock: RateBlock, allBlockCol: Array<RateBlock>) {

    let rateCC = new RateCC();

    rateCC.$typeRate = typeRate;
    rateCC.$mode = mode;
    rateCC.$id_note = id_note;
    rateCC.$id = id;
    rateCC.$rate = rate;
    rateCC.$agent = agent;
    rateCC.$coach = coach;
    rateCC.$dateRate = dateRate;
    rateCC.$dateCall = dateCall;
    rateCC.$dateShare = dateShare;
    rateCC.$idCall = idCall;
    rateCC.$queue = queue;
    rateCC.$topic = topic;
    rateCC.$extraScore = extraScore;
    rateCC.$extraScoreTxt = extraScoreTxt;
    rateCC.$ratePartJSON = ratePartJSON;
    rateCC.$wiedzaBlock = wiedzaBlock;
    rateCC.$obslugaBlock = obslugaBlock;
    rateCC.$technikaBlock = technikaBlock;
    rateCC.$komunikacjaBlock = komunikacjaBlock;
    rateCC.$standardBlock = standardBlock;
    rateCC.$allBlockCol = allBlockCol;

}

export function getRate(rateCC: RateCC): number {

    let rate: number = 0;

    rateCC.$allBlockCol.forEach(e => {
        rate = rate + getRateBlock(e);
    });

    rate = rate + (rateCC.$extraScore / 100);
    rate = rate > 1 ? 1 : rate < 0 ? 0 : rate;

    return rate;
}

export function getRateAs100(rateCC: RateCC): number {

    const rate = getRate(rateCC) * 100;
    return Math.round(rate);
}



