// '========================================================
// '*********************** RatePart CLASS *****************
// '========================================================
export class RatePart {

    private key: string = ""
    private ocena: number = 0;
    private waga: number = 0;
    private nieprawidlowosci: string = ""
    private opis: string = ""
    private uwagi: string = ""
    private used: boolean = true; // 'Flaga użycia (zawsze true dla RATTING_ ale dla CURRENT i MYSTERY tylko dla bloku który został wykorzystany w ocenie)

    /**
     * Getter $key
     * @return {string}
     */
    public get $key(): string {
        return this.key;
    }

    /**
     * Getter $ocena
     * @return {number}
     */
    public get $ocena(): number {
        return this.ocena;
    }

    /**
     * Getter $waga
     * @return {number}
     */
    public get $waga(): number {
        return this.waga;
    }

    /**
     * Getter $nieprawidlowosci
     * @return {string}
     */
    public get $nieprawidlowosci(): string {
        return this.nieprawidlowosci;
    }

    /**
     * Getter $opis
     * @return {string}
     */
    public get $opis(): string {
        return this.opis;
    }

    /**
     * Getter $uwagi
     * @return {string}
     */
    public get $uwagi(): string {
        return this.uwagi;
    }

    /**
     * Getter $used
     * @return {boolean}
     */
    public get $used(): boolean {
        return this.used;
    }

    /**
     * Setter $key
     * @param {string} value
     */
    public set $key(value: string) {
        this.key = value;
    }

    /**
     * Setter $ocena
     * @param {number} value
     */
    public set $ocena(value: number) {
        this.ocena = value;
    }

    /**
     * Setter $waga
     * @param {number} value
     */
    public set $waga(value: number) {
        this.waga = value;
    }

    /**
     * Setter $nieprawidlowosci
     * @param {string} value
     */
    public set $nieprawidlowosci(value: string) {
        this.nieprawidlowosci = value;
    }

    /**
     * Setter $opis
     * @param {string} value
     */
    public set $opis(value: string) {
        this.opis = value;
    }

    /**
     * Setter $uwagi
     * @param {string} value
     */
    public set $uwagi(value: string) {
        this.uwagi = value;
    }

    /**
     * Setter $used
     * @param {boolean} value
     */
    public set $used(value: boolean) {
        this.used = value;
    }

}




