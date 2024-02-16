// '=========================================================================
// '*********************** RATECC CLASS ************************************
// '=========================================================================
import { key_k, key_o, key_s, key_t, key_w, } from "../../globalKeys";
import { Rate_Mode, Type_RateCC } from "../enums";
import { Queue } from "../queue";
import { RateBlock } from "./rateBlock";
import { User } from "../user";
import 'reflect-metadata';
export class RateCC {

	public typeRate: Type_RateCC = Type_RateCC.RATTING_;
	public mode: Rate_Mode = Rate_Mode.NEW_;

	public id: number = 0;
	public agent: User = new User();
	public coach: User = new User();
	public dateRate: string = "";
	public dateCall: string = "";
	public dateShare: string = "";
	public idCall: string = "";
	public queue: Queue = new Queue();
	public topic: string = "";
	public extraScore: number = 0;
	public extraScoreTxt: string = "";

	public wiedzaBlock: RateBlock = new RateBlock(key_w);
	public obslugaBlock: RateBlock = new RateBlock(key_o);
	public technikaBlock: RateBlock = new RateBlock(key_t);
	public komunikacjaBlock: RateBlock = new RateBlock(key_k);
	public standardBlock: RateBlock = new RateBlock(key_s);


}


