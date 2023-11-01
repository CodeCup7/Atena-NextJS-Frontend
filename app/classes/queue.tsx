// '=======================================================
// '*********************** Queue CLASS *******************
// '=======================================================

export class Queue {
    private id: number = 0;
    private nameQueue: string = "";
    private available: boolean = true;

    /**
     * Getter $id
     * @return {number}
     */
    public get $id(): number {
        return this.id;
    }

    /**
     * Getter $nameQueue
     * @return {string}
     */
    public get $nameQueue(): string {
        return this.nameQueue;
    }

    /**
     * Getter $available
     * @return {boolean}
     */
    public get $available(): boolean {
        return this.available;
    }

    /**
     * Setter $id
     * @param {number} value
     */
    public set $id(value: number) {
        this.id = value;
    }

    /**
     * Setter $nameQueue
     * @param {string} value
     */
    public set $nameQueue(value: string) {
        this.nameQueue = value;
    }

    /**
     * Setter $available
     * @param {boolean} value
     */
    public set $available(value: boolean) {
        this.available = value;
    }


}


