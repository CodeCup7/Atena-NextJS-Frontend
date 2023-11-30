// '========================================================
// '*********************** User CLASS *****************
// '========================================================

export enum Role {
    ADMIN_ = "Admin",
    AGENT_ = "Agent",
    COACH_ = "Trener",
    BOSS_ = "Kierownik",
    LEADER_ = "Lider",
    SUPERVISOR_ = "Superwajzor",
}

export class User {

    // Wspólne
    public id: number = 0;
    public login: string = "";
    public nameUser: string = "";
    public role: Role = Role.AGENT_;
    public available: boolean = true;
    public mail: string = "";

    // Tylko agent
    public coachId: number = 0;
    public bossId: number = 0;
    public leaderId: number = 0;
    
}


