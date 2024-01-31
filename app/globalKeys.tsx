
export const key_w: string = "key_w";
export const key_o: string = "key_o";
export const key_t: string = "key_t";
export const key_k: string = "key_k";
export const key_s: string = "key_s";
export const key_e: string = "key_e";

export const key_w1: string = "key_w1";
export const key_o1: string = "key_o1";
export const key_t1: string = "key_t1";
export const key_t2: string = "key_t2";
export const key_t3: string = "key_t3";
export const key_t4: string = "key_t4";
export const key_k1: string = "key_k1";
export const key_k2: string = "key_k2";
export const key_k3: string = "key_k3";
export const key_s1: string = "key_s1";
export const key_s2: string = "key_s2";
export const key_s3: string = "key_s3";
export const key_s4: string = "key_s4";

export function getWagRateCC(key: string) {

    switch (key) {
        case key_w1: {
            return 20;
        }
        case key_o1: {
            return 8;
        }
        case key_t1: {
            return 15;
        }
        case key_t2: {
            return 8;
        }
        case key_t3: {
            return 7;
        }
        case key_t4: {
            return 5;
        }
        case key_k1: {
            return 6;
        }
        case key_k2: {
            return 7;
        }
        case key_k3: {
            return 6;
        }
        case key_s1: {
            return 2;
        }
        case key_s2: {
            return 7;
        }
        case key_s3: {
            return 7;
        }
        case key_s4: {
            return 2;
        }
        default: {
            return 0;
        }
    }
}
export function getWagRateM(key: string) {

    switch (key) {
        case key_w1: {
            return 25;
        }
        case key_o1: {
            return 10;
        }
        case key_t1: {
            return 20;
        }
        case key_t2: {
            return 15;
        }
        case key_s1: {
            return 10;
        }
        case key_s2: {
            return 10;
        }
        case key_s3: {
            return 10;
        }
        default: {
            return 0;
        }
    }
}

export function getKeyAsName(key: string) {

    switch (key) {
        case key_w: {
            return "Wiedza";
        }
        case key_o: {
            return "Obsługa aplikacji / systemów";
        }
        case key_t: {
            return "Techniki Obsługi";
        }
        case key_k2: {
            return "Komunikatywność";
        }
        case key_s: {
            return "Standard obsługi rozmowy";
        }
        case key_e: {
            return "Dodatkowe punkty";
        }
        case key_w1: {
            return "znajomość produktów/usług świadczonych przez PP oraz aktów prawnych / przepisów / wytycznych";
        }
        case key_o1: {
            return "umiejętność korzystania z aplikacji / systemów oraz właściwe wprowadzanie danych pozyskanych podczas rozmowy";
        }
        case key_t1: {
            return "rozpoznawanie potrzeb";
        }
        case key_t2: {
            return "praca z objekcjami";
        }
        case key_t3: {
            return "dbałość o wizerunek Poczty Polskiej";
        }
        case key_t4: {
            return "kontrola rozmowy, właściwe zarządzanie czasem i przebiegiem rozmowy ";
        }
        case key_k1: {
            return "forma wypowiedzi";
        }
        case key_k2: {
            return "brak negatywnych emocji w rozmowie";
        }
        case key_k3: {
            return "aktywne słuchanie";
        }
        case key_s1: {
            return "powitanie i zakończenie rozmowy";
        }
        case key_s2: {
            return "znajomość procesu kampanii";
        }
        case key_s3: {
            return "język wypowiedzi";
        }
        case key_s4: {
            return "brak wtrętów językowychy ";
        }
        default: {
            return 0;
        }
    }
}


