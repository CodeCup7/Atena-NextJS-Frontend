// '=========================================================================
// '*********************** C_RateCC CLASS **********************************
// '=========================================================================
import { CreateNewEmptyRatePart } from "../factory/factory_ratePart";
import { key_k, key_k1, key_k2, key_k3, key_o, key_o1, key_s, key_s1, key_s2, key_s3, key_s4, key_t, key_t1, key_t2, key_t3, key_t4, key_w, key_w1 } from "../globalKeys";
import { Rate_Mode, Type_RateCC } from "./enums";
import { Queue } from "./queue";
import { RateBlock } from "./rateBlock";
import { User } from "./user";

export class RateCC {

	private typeRate: Type_RateCC = Type_RateCC.RATTING_;
	private mode: Rate_Mode = Rate_Mode.NEW_;

	private id_note: number = 0;
	private id: number = 0;
	private rate: number = 0;
	private agent: User = new User();
	private coach: User = new User();
	private dateRate: string = "";
	private dateCall: string = "";
	private dateShare: string = "";
	private idCall: string = "";
	private queue: Queue = new Queue();
	private topic: string = "";
	private extraScore: number = 0;
	private extraScoreTxt: string = "";
	private ratePartJSON: string = "";

	private wiedzaBlock: RateBlock = new RateBlock(key_w);
	private obslugaBlock: RateBlock = new RateBlock(key_o);
	private technikaBlock: RateBlock = new RateBlock(key_t);
	private komunikacjaBlock: RateBlock = new RateBlock(key_k);
	private standardBlock: RateBlock = new RateBlock(key_s);

	private allBlockCol: Array<RateBlock> = [this.wiedzaBlock, this.obslugaBlock, this.technikaBlock, this.komunikacjaBlock, this.standardBlock];

	constructor() {

		this.wiedzaBlock.$ratePartCol.push(CreateNewEmptyRatePart(key_w1));
		this.obslugaBlock.$ratePartCol.push(CreateNewEmptyRatePart(key_o1));
		this.technikaBlock.$ratePartCol.push(CreateNewEmptyRatePart(key_t1));
		this.technikaBlock.$ratePartCol.push(CreateNewEmptyRatePart(key_t2));
		this.technikaBlock.$ratePartCol.push(CreateNewEmptyRatePart(key_t3));
		this.technikaBlock.$ratePartCol.push(CreateNewEmptyRatePart(key_t4));
		this.komunikacjaBlock.$ratePartCol.push(CreateNewEmptyRatePart(key_k1));
		this.komunikacjaBlock.$ratePartCol.push(CreateNewEmptyRatePart(key_k2));
		this.komunikacjaBlock.$ratePartCol.push(CreateNewEmptyRatePart(key_k3));
		this.standardBlock.$ratePartCol.push(CreateNewEmptyRatePart(key_s1));
		this.standardBlock.$ratePartCol.push(CreateNewEmptyRatePart(key_s2));
		this.standardBlock.$ratePartCol.push(CreateNewEmptyRatePart(key_s3));
		this.standardBlock.$ratePartCol.push(CreateNewEmptyRatePart(key_s4));

	}

	public getRate(): number {

		let rate: number = 0;

		this.allBlockCol.forEach(e => {
			rate = rate + e.getRate();
		});

		rate = rate + (this.extraScore / 100);
		rate = rate > 1 ? 1 : rate < 0 ? 0 : rate;

		return rate;
	}

	public getRateAs100(): number {

		const rate = this.getRate() * 100;
		return Math.round(rate);
	}


	/**
	 * Getter $typeRate
	 * @return {Type_RateCC }
	 */
	public get $typeRate(): Type_RateCC {
		return this.typeRate;
	}

	/**
	 * Setter $typeRate
	 * @param {Type_RateCC } value
	 */
	public set $typeRate(value: Type_RateCC) {
		this.typeRate = value;
	}

	/**
	 * Getter $mode
	 * @return {Rate_Mode}
	 */
	public get $mode(): Rate_Mode {
		return this.mode;
	}

	/**
	 * Getter $id_note
	 * @return {number}
	 */
	public get $id_note(): number {
		return this.id_note;
	}

	/**
	 * Getter $id
	 * @return {number}
	 */
	public get $id(): number {
		return this.id;
	}

	/**
	 * Getter $rate
	 * @return {number}
	 */
	public get $rate(): number {
		return this.rate;
	}

	/**
	 * Getter $agent
	 * @return {User}
	 */
	public get $agent(): User {
		return this.agent;
	}

	/**
	 * Getter $coach
	 * @return {User}
	 */
	public get $coach(): User {
		return this.coach;
	}

	/**
	 * Getter $dateRate
	 * @return {string}
	 */
	public get $dateRate(): string {
		return this.dateRate;
	}

	/**
	 * Getter $dateCall
	 * @return {string}
	 */
	public get $dateCall(): string {
		return this.dateCall;
	}

	/**
	 * Getter $dateShare
	 * @return {string}
	 */
	public get $dateShare(): string {
		return this.dateShare;
	}

	/**
	 * Getter $idCall
	 * @return {string}
	 */
	public get $idCall(): string {
		return this.idCall;
	}

	/**
	 * Getter $Queue
	 * @return {Queue}
	 */
	public get $queue(): Queue {
		return this.queue;
	}

	/**
	 * Getter $topic
	 * @return {string}
	 */
	public get $topic(): string {
		return this.topic;
	}

	/**
	 * Getter $extraScore
	 * @return {number}
	 */
	public get $extraScore(): number {
		return this.extraScore;
	}

	/**
	 * Getter $extraScoreTxt
	 * @return {string}
	 */
	public get $extraScoreTxt(): string {
		return this.extraScoreTxt;
	}

	/**
	 * Getter $ratePartJSON
	 * @return {string}
	 */
	public get $ratePartJSON(): string {
		return this.ratePartJSON;
	}

	/**
	 * Getter $wiedzaBlock
	 * @return {RateBlock}
	 */
	public get $wiedzaBlock(): RateBlock {
		return this.wiedzaBlock;
	}

	/**
	 * Getter $obslugaBlock
	 * @return {RateBlock}
	 */
	public get $obslugaBlock(): RateBlock {
		return this.obslugaBlock;
	}

	/**
	 * Getter $technikaBlock
	 * @return {RateBlock}
	 */
	public get $technikaBlock(): RateBlock {
		return this.technikaBlock;
	}

	/**
	 * Getter $komunikacjaBlock
	 * @return {RateBlock}
	 */
	public get $komunikacjaBlock(): RateBlock {
		return this.komunikacjaBlock;
	}

	/**
	 * Getter $standardBlock
	 * @return {RateBlock}
	 */
	public get $standardBlock(): RateBlock {
		return this.standardBlock;
	}

	/**
	 * Getter $allBlockCol
	 * @return {Array<RateBlock> }
	 */
	public get $allBlockCol(): Array<RateBlock> {
		return this.allBlockCol;
	}

	/**
	 * Setter $mode
	 * @param {Rate_Mode} value
	 */
	public set $mode(value: Rate_Mode) {
		this.mode = value;
	}

	/**
	 * Setter $id_note
	 * @param {number} value
	 */
	public set $id_note(value: number) {
		this.id_note = value;
	}

	/**
	 * Setter $id
	 * @param {number} value
	 */
	public set $id(value: number) {
		this.id = value;
	}

	/**
	 * Setter $rate
	 * @param {number} value
	 */
	public set $rate(value: number) {
		this.rate = value;
	}

	/**
	 * Setter $agent
	 * @param {User} value
	 */
	public set $agent(value: User) {
		this.agent = value;
	}

	/**
	 * Setter $coach
	 * @param {User} value
	 */
	public set $coach(value: User) {
		this.coach = value;
	}

	/**
	 * Setter $dateRate
	 * @param {string} value
	 */
	public set $dateRate(value: string) {
		this.dateRate = value;
	}

	/**
	 * Setter $dateCall
	 * @param {string} value
	 */
	public set $dateCall(value: string) {
		this.dateCall = value;
	}

	/**
	 * Setter $dateShare
	 * @param {string} value
	 */
	public set $dateShare(value: string) {
		this.dateShare = value;
	}

	/**
	 * Setter $idCall
	 * @param {string} value
	 */
	public set $idCall(value: string) {
		this.idCall = value;
	}

	/**
	 * Setter $Queue
	 * @param {Queue} value
	 */
	public set $queue(value: Queue) {
		this.queue = value;
	}

	/**
	 * Setter $topic
	 * @param {string} value
	 */
	public set $topic(value: string) {
		this.topic = value;
	}

	/**
	 * Setter $extraScore
	 * @param {number} value
	 */
	public set $extraScore(value: number) {
		this.extraScore = value;
	}

	/**
	 * Setter $extraScoreTxt
	 * @param {string} value
	 */
	public set $extraScoreTxt(value: string) {
		this.extraScoreTxt = value;
	}

	/**
	 * Setter $ratePartJSON
	 * @param {string} value
	 */
	public set $ratePartJSON(value: string) {
		this.ratePartJSON = value;
	}

	/**
	 * Setter $wiedzaBlock
	 * @param {RateBlock} value
	 */
	public set $wiedzaBlock(value: RateBlock) {
		this.wiedzaBlock = value;
	}

	/**
	 * Setter $obslugaBlock
	 * @param {RateBlock} value
	 */
	public set $obslugaBlock(value: RateBlock) {
		this.obslugaBlock = value;
	}

	/**
	 * Setter $technikaBlock
	 * @param {RateBlock} value
	 */
	public set $technikaBlock(value: RateBlock) {
		this.technikaBlock = value;
	}

	/**
	 * Setter $komunikacjaBlock
	 * @param {RateBlock} value
	 */
	public set $komunikacjaBlock(value: RateBlock) {
		this.komunikacjaBlock = value;
	}

	/**
	 * Setter $standardBlock
	 * @param {RateBlock} value
	 */
	public set $standardBlock(value: RateBlock) {
		this.standardBlock = value;
	}

	/**
	 * Setter $allBlockCol
	 * @param {Array<RateBlock> } value
	 */
	public set $allBlockCol(value: Array<RateBlock>) {
		this.allBlockCol = value;
	}

}


