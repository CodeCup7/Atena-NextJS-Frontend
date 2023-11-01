// '===============================================================
// '*********************** NoteCC CLASS ***************************
// '===============================================================

import { Rate_Mode, Status_Note } from "./enums";
import { RateCC } from "./rateCC";
import { RateM } from "./rateM";
import { User } from "./user";

export class NoteCC {

    private id: number = 0;
    private status: Status_Note = Status_Note.NO_START_;
    private agent: User = new User();
    private coach: User = new User();
    private score: number = 0;
    private coachDate: string = ""
    private appliesDate: string = ""
    private zalecenia: string = ""
    private odwolanie: string = ""

    private rateCC_Col: Array<RateCC> = [];
    private rateM_Col: Array<RateM> = [];
    private mode: Rate_Mode = Rate_Mode.NEW_;

    /**
     * Getter $id
     * @return {number}
     */
    public get $id(): number {
        return this.id;
    }

    /**
     * Getter $status
     * @return {Status_Note}
     */
    public get $status(): Status_Note {
        return this.status;
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
     * Getter $score
     * @return {number}
     */
    public get $score(): number {
        return this.score;
    }

    /**
     * Getter $coachDate
     * @return {string}
     */
    public get $coachDate(): string {
        return this.coachDate;
    }

    /**
     * Getter $appliesDate
     * @return {string}
     */
    public get $appliesDate(): string {
        return this.appliesDate;
    }

    /**
     * Getter $zalecenia
     * @return {string}
     */
    public get $zalecenia(): string {
        return this.zalecenia;
    }

    /**
     * Getter $odwolanie
     * @return {string}
     */
    public get $odwolanie(): string {
        return this.odwolanie;
    }

    /**
     * Getter $rateCC_Col
     * @return {Array<RateCC>}
     */
    public get $rateCC_Col(): Array<RateCC> {
        return this.rateCC_Col;
    }

    /**
     * Getter $rateM_Col
     * @return {Array<RateM>}
     */
    public get $rateM_Col(): Array<RateM> {
        return this.rateM_Col;
    }

    /**
     * Getter $mode
     * @return {Rate_Mode}
     */
    public get $mode(): Rate_Mode {
        return this.mode;
    }

    /**
     * Setter $id
     * @param {number} value
     */
    public set $id(value: number) {
        this.id = value;
    }

    /**
     * Setter $status
     * @param {Status_Note} value
     */
    public set $status(value: Status_Note) {
        this.status = value;
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
     * Setter $score
     * @param {number} value
     */
    public set $score(value: number) {
        this.score = value;
    }

    /**
     * Setter $coachDate
     * @param {string} value
     */
    public set $coachDate(value: string) {
        this.coachDate = value;
    }

    /**
     * Setter $appliesDate
     * @param {string} value
     */
    public set $appliesDate(value: string) {
        this.appliesDate = value;
    }

    /**
     * Setter $zalecenia
     * @param {string} value
     */
    public set $zalecenia(value: string) {
        this.zalecenia = value;
    }

    /**
     * Setter $odwolanie
     * @param {string} value
     */
    public set $odwolanie(value: string) {
        this.odwolanie = value;
    }

    /**
     * Setter $rateCC_Col
     * @param {Array<RateCC>} value
     */
    public set $rateCC_Col(value: Array<RateCC>) {
        this.rateCC_Col = value;
    }

    /**
     * Setter $rateM_Col
     * @param {Array<RateM>} value
     */
    public set $rateM_Col(value: Array<RateM>) {
        this.rateM_Col = value;
    }

    /**
     * Setter $mode
     * @param {Rate_Mode} value
     */
    public set $mode(value: Rate_Mode) {
        this.mode = value;
    }

}
