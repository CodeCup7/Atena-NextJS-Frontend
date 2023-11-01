// '===============================================================
// '*********************** RateM CLASS ***************************
// '===============================================================
import { Rate_Mode, Type_RateCC } from "./enums";
import { RateBlock } from "./rateBlock";
import { User } from "./user";


export class RateM {

    private mode: Rate_Mode = Rate_Mode.NEW_;

    private id_note: number = 0;
    private id: number = 0;
    private rate: number = 0;
    private agent: User = new User();
    private coach: User = new User();
    private dateRate: string = "";
    private dateCall: string = "";
    private dateShare: string = "";
    private extraScore: number = 0;
    private extraScoreTxt: string = "";
    private ratePartJSON: string = "";
    private attachmentPath: string = "";

    private wiedzaBlock: RateBlock = new RateBlock();
    private obslugaBlock: RateBlock = new RateBlock();
    private technikaBlock: RateBlock = new RateBlock();
    private komunikacjaBlock: RateBlock = new RateBlock();
    private standardBlock: RateBlock = new RateBlock();

    private allBlockCol: Array<RateBlock> = [this.wiedzaBlock, this.obslugaBlock, this.technikaBlock, this.komunikacjaBlock, this.standardBlock];


    constructor($mode: Rate_Mode, $id_note: number, $id: number, $rate: number, $agent: User, $coach: User, $dateRate: string, $dateCall: string, $dateShare: string, $extraScore: number, $extraScoreTxt: string, $ratePartJSON: string,
        $attachmentPath: string, $wiedzaBlock: RateBlock, $obslugaBlock: RateBlock, $technikaBlock: RateBlock, $komunikacjaBlock: RateBlock, $standardBlock: RateBlock, $allBlockCol: Array<RateBlock>) {
        this.mode = $mode;
        this.id_note = $id_note;
        this.id = $id;
        this.rate = $rate;
        this.agent = $agent;
        this.coach = $coach;
        this.dateRate = $dateRate;
        this.dateCall = $dateCall;
        this.dateShare = $dateShare;
        this.extraScore = $extraScore;
        this.extraScoreTxt = $extraScoreTxt;
        this.ratePartJSON = $ratePartJSON;
        this.attachmentPath = $attachmentPath;
        this.wiedzaBlock = $wiedzaBlock;
        this.obslugaBlock = $obslugaBlock;
        this.technikaBlock = $technikaBlock;
        this.komunikacjaBlock = $komunikacjaBlock;
        this.standardBlock = $standardBlock;
        this.allBlockCol = $allBlockCol;
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
     * Getter $attachmentPath
     * @return {string}
     */
    public get $attachmentPath(): string {
        return this.attachmentPath;
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
     * Setter $attachmentPath
     * @param {string} value
     */
    public set $attachmentPath(value: string) {
        this.attachmentPath = value;
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
