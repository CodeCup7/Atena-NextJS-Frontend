// '========================================================
// '*********************** User CLASS *****************
// '========================================================

export enum Role { ADMIN_, AGENT_, COACH_, BOSS_, LEADER_, SUPERVISOR_ }

export class User {
    // Wspólne
    private id: number = 0;
    private login: string = "";
    private nameUser: string = "";
    private role: Role = Role.AGENT_;
    private available: boolean = true;

    // Tylko agent
    private area: string = "";
    private coachId: number = 0;
    private bossId: number = 0;
    private leaderId: number = 0;
    private comments: string = "";
    private mail: string = "";

    /**
     * Getter $id
     * @return {number}
     */
    public get $id(): number {
        return this.id;
    }

    /**
     * Getter $login
     * @return {string}
     */
    public get $login(): string {
        return this.login;
    }

    /**
     * Getter $nameUser
     * @return {string}
     */
    public get $nameUser(): string {
        return this.nameUser;
    }

    /**
     * Getter $role
     * @return {Role}
     */
    public get $role(): Role {
        return this.role;
    }

    /**
     * Getter $available
     * @return {boolean}
     */
    public get $available(): boolean {
        return this.available;
    }

    /**
     * Getter $area
     * @return {string}
     */
    public get $area(): string {
        return this.area;
    }

    /**
     * Getter $coachId
     * @return {number}
     */
    public get $coachId(): number {
        return this.coachId;
    }

    /**
     * Getter $bossId
     * @return {number}
     */
    public get $bossId(): number {
        return this.bossId;
    }

    /**
     * Getter $leaderId
     * @return {number}
     */
    public get $leaderId(): number {
        return this.leaderId;
    }

    /**
     * Getter $comments
     * @return {string}
     */
    public get $comments(): string {
        return this.comments;
    }

    /**
     * Getter $mail
     * @return {string}
     */
    public get $mail(): string {
        return this.mail;
    }

    /**
     * Setter $id
     * @param {number} value
     */
    public set $id(value: number) {
        this.id = value;
    }

    /**
     * Setter $login
     * @param {string} value
     */
    public set $login(value: string) {
        this.login = value;
    }

    /**
     * Setter $nameUser
     * @param {string} value
     */
    public set $nameUser(value: string) {
        this.nameUser = value;
    }

    /**
     * Setter $role
     * @param {Role} value
     */
    public set $role(value: Role) {
        this.role = value;
    }

    /**
     * Setter $available
     * @param {boolean} value
     */
    public set $available(value: boolean) {
        this.available = value;
    }

    /**
     * Setter $area
     * @param {string} value
     */
    public set $area(value: string) {
        this.area = value;
    }

    /**
     * Setter $coachId
     * @param {number} value
     */
    public set $coachId(value: number) {
        this.coachId = value;
    }

    /**
     * Setter $bossId
     * @param {number} value
     */
    public set $bossId(value: number) {
        this.bossId = value;
    }

    /**
     * Setter $leaderId
     * @param {number} value
     */
    public set $leaderId(value: number) {
        this.leaderId = value;
    }

    /**
     * Setter $comments
     * @param {string} value
     */
    public set $comments(value: string) {
        this.comments = value;
    }

    /**
     * Setter $mail
     * @param {string} value
     */
    public set $mail(value: string) {
        this.mail = value;
    }


}

