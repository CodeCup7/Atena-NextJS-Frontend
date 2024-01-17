// '=========================================================================
// '*********************** C_RateCC CLASS **********************************
// '=========================================================================
import { key_k, key_k1, key_k2, key_k3, key_o, key_o1, key_s, key_s1, key_s2, key_s3, key_s4, key_t, key_t1, key_t2, key_t3, key_t4, key_w, key_w1 } from "../globalKeys";
import { Rate_Mode, Type_RateCC } from "./enums";
import { Queue } from "./queue";
import { RateBlock } from "./rateBlock";
import { RatePart } from "./ratePart";
import { User } from "./user";
import 'reflect-metadata';
export class RateCC {

	public typeRate: Type_RateCC = Type_RateCC.RATTING_;
	public mode: Rate_Mode = Rate_Mode.NEW_;

	public id_note: number = 0;
	public id: number = 0;
	public rate: number = 0;
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

	public ratePart: Array<RatePart> = [];

	toJSON() {
		return {
			typeRate: Object.keys(Type_RateCC).find(e => this.typeRate), // Zamiana stringa enum na value enum
			id_note: this.id_note,
			id: this.id,
			agent: this.agent,
			coach: this.coach,
			dateRate: this.dateRate,
			dateCall: this.dateCall,
			dateShare: this.dateShare,
			idCall: this.idCall,
			queue: this.queue,
			topic: this.topic,
			extraScore: this.extraScore,
			extraScoreTxt: this.extraScoreTxt,
			ratePart: this.ratePart,

			wiedzaBlock: this.wiedzaBlock,
			obslugaBlock: this.obslugaBlock,
			technikaBlock: this.technikaBlock,
			komunikacjaBlock: this.komunikacjaBlock,
			standardBlock: this.standardBlock,

		};
	}
}


