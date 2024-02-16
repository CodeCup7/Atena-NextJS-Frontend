// '===============================================================
// '*********************** RATEN CLASS ***************************
// '===============================================================
import { key_w, key_o, key_t, key_k, key_s } from "../../globalKeys";
import { Rate_Mode } from "../enums";
import { RateBlock } from "./rateBlock";
import { User } from "../user";

export class RateM {

    public mode: Rate_Mode = Rate_Mode.NEW_;

    public id: number = 0;
    public agent: User = new User();
    public coach: User = new User();
    public dateRate: string = "";
    public dateShare: string = "";
    public extraScore: number = 0;
    public extraScoreTxt: string = "";
    public attachmentPath: string = "";

	public wiedzaBlock: RateBlock = new RateBlock(key_w);
	public obslugaBlock: RateBlock = new RateBlock(key_o);
	public technikaBlock: RateBlock = new RateBlock(key_t);
	public standardBlock: RateBlock = new RateBlock(key_s);

}