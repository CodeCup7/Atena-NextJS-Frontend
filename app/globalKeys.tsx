
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

export function getKeyTitle(key: string) {

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
        case key_k: {
            return "Komunikacja";
        }
        case key_s: {
            return "Standard obsługi rozmowy";
        }
        case key_e: {
            return "Dodatkowe punkty";
        }
        case key_w1: {
            return "znajomość produktów i usług świadczonych oraz aktów prawnych, przepisów, wytycznych";
        }
        case key_o1: {
            return "umiejętność korzystania z aplikacji i systemów oraz właściwe wprowadzanie danych pozyskanych podczas rozmowy";
        }
        case key_t1: {
            return "rozpoznawanie potrzeb";
        }
        case key_t2: {
            return "praca z objekcjami";
        }
        case key_t3: {
            return "dbałość o wizerunek firmy";
        }
        case key_t4: {
            return "kontrola rozmowy, właściwe zarządzanie czasem i przebiegiem rozmowy";
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
            return "brak wtrętów językowych";
        }
        default: {
            return 0;
        }
    }
}

export function getKeyDiscription(key: string) {

    switch (key) {
        case key_w1: {
            return "Agent prowadzi dialog zgodnie z aktualnymi źródłami wiedzy (przepisami, wytycznymi, instrukcjami, bazą informacji," +
                "aktualnościami, treściami na stronach internetowych), dostosowując się do potrzeb Klienta." +
                "Agent odpowiada na pytania Klienta udzielając precyzyjnych informacji dotyczących oferowanych produktów/usług/procedur." +
                "W przypadku samodzielnej korekty błędu przez Agenta - oznaczona zostanie ocena - 1," +
                "natomiast w przypadku poprawy błędu na skutek interwencji Klienta - ocena zostanie oznaczona jako 0.";
        }
        case key_o1: {
            return "Sprawne wykorzystanie dostępnych narzędzi i aplikacji, odnajdywanie trafnych informacji w sieci, wyszukiwanie" +
                "konkretnych przepisów w aktach prawnych, oraz asystowanie Klientowi w poruszaniu się po stronach internetowych." +
                "Precyzyjne zarejestrowanie zgłoszeń, zleceń, wniosków, notatek, incydentów, oraz reakcja na interwencje" +
                "Klientów zgodnie z obowiązującymi procedurami.";
        }
        case key_t1: {
            return "Zadawanie pytań w celu ustalenia potrzeb Klienta oraz klarowne wyjaśnianie niejasności," +
                "włączając w to stosowanie parafrazy do potwierdzenia zrozumienia jego wypowiedzi." +
                "Pozyskiwanie istotnych informacji związanych z problemem Klienta, które mogą mieć wpływ na efektywną realizację usługi." +
                "Dostosowanie propozycji do indywidualnych potrzeb Klienta, przekazywanie kluczowych informacji dotyczących jego sprawy." +
                "Proponowanie rozwiązań zgodnych z procedurami.";
        }
        case key_t2: {
            return "Prezentowanie się jako profesjonalista poprzez unikanie sformułowań o negatywnym wydźwięku " +
                "oraz eliminowanie zwrotów, które mogą budzić niepewność lub podważać kompetencje, takich jak:" +
                " \"niestety\", \"nie pomogę\", \"nie wiem\", \"nie da się\", \"nie mogę\", \"nie mamy możliwości\", \"musi Pan/Pani\"," +
                " \"moim zdaniem\", \"podejrzewam\", \"z doświadczenia wiem\", \"mogę tylko\", \"nie jestem w stanie\", \"obawiam się\", " +
                " \"myślę że\", \"prawdopodobnie\", \"ewentualnie mogę\", \"w ostateczności\", \"w razie czego\", \"tylko...\", \"być może\"."
        }
        case key_t3: {
            return "Rozpoznawanie i zrozumienie motywacji, które skłaniają Klientów do wyrażania zastrzeżeń dotyczących realizowanych " +
                "zadań w obszarze przetwarzania danych osobowych.Skupianie uwagi Klienta na faktach oraz kształtowanie pozytywnego wizerunku," +
                "przy jednoczesnym unikaniu negatywnych wypowiedzi na temat polityki prywatności lub konkurencji.";
        }
        case key_t4: {
            return "Agent odpowiednio kieruje przebiegiem rozmowy, udzielając konkretnej, rzeczowej i zrozumiałej odpowiedzi na pytania Klienta, z" +
                "godnie z ich potrzebami. Sprawnie operuje aplikacjami i nie odchodzi od tematu, trzymając się głównego wątku rozmowy i unikając" +
                "zbędnych dyskusji. W przypadku konieczności weryfikacji informacji, informuje Klienta o zawieszeniu rozmowy (hold)," +
                "tłumacząc powód, i dba o minimalizację czasu oczekiwania. Po podjęciu rozmowy ponownie dziękuje za cierpliwość" +
                "i informuje o ewentualnym wydłużeniu przerwy z uzasadnieniem. Konsultant witając się z  Klientem po połączeniu" +
                "i rozłączając się po zakończeniu rozmowy (jeśli przerwa trwa dłużej niż 10 sekund),dba o profesjonalizm w komunikacji.";
        }
        case key_k1: {
            return "Agent mówi głośno, wyraźnie i płynnie. Agent stosuje odpowiednie tempo wypowiedzi. Zbyt szybkie mówienie może powodować" +
                "trudności zrozumienia komunikatu, zbyt wolne może być denerwujące dla odbiorcy. Poprawna dykcja. Brak: połykania końcówek," +
                "skracania słów, przerw pomiędzy słowami a nawet zdaniami. Odpowiedni ton głosu, w którym słychać entuzjazm i pozytywne nastawienie." +
                "Brak monotonii. W rozmowie akcentowane są najważniejsze kwestie. Agent stosuje odpowiednie pauzy." +
                "Brak wypowiedzi „na jednym wdechu”. Brak: przeciągania wyrazów/końcówek, przesadnego akcentowania.";
        }
        case key_k2: {
            return "Agent rozmawia uprzejmie, nie przenosząc negatywnych emocji z poprzednich interakcji." +
                "Nie reaguje śmiechem na zachowanie, problemy, ton głosu lub sposób mówienia Klienta. Jest opanowany nawet w sytuacjach," +
                "gdy Klient jest zirytowany lub niezrozumiały. Nie atakuje Klienta, unika traktowania go z wyższością, jak również nie okazuje" +
                "zdenerwowania, zirytowania, arogancji czy znudzenia. Unika wypowiedzi w tonie ironicznym, sarkastycznym czy cynicznym." +
                "Nie daje Klientowi wrażenia, że zależy mu na szybkim zakończeniu rozmowy.";
        }
        case key_k3: {
            return "Agent skupia się na wypowiedzi Klienta poprzez uważne słuchanie, unikając wielokrotnego dopytywania o to samo," +
                "nie przerywając mu ani nie mówiąc równocześnie. W przypadku, gdy wypowiedź Klienta jest niespójna lub odchodzi od tematu rozmowy," +
                "Agent może w sposób uprzejmy przerwać, ale dba o zachowanie kultury w komunikacji. Reaguje na monolog Klienta oraz" +
                "akceptuje milczenie, pozwalając Klientowi dokończyć wypowiedź. Jeśli Klient przerywa Agentowi, ten zawiesza głos," +
                "umożliwiając mu dokończenie wypowiedzi.";
        }
        case key_s1: {
            return "Powitanie zgodnie ze standardem : \"Dzień dobry, tutaj agent Anna Kowalska. W czym mogę pomóc?\" Pożegnanie zgodnie ze standardem: " +
                " \"Dziękuję za rozmowę, jeśli jeszcze czegoś potrzebujesz, proszę śmiało się zgłosić. Miłego dnia i do usłyszenia!\"";
        }
        case key_s2: {
            return "W przypadku kampanii, gdzie został wdrożony skrypt rozmowy lub proces kampanii, istotne jest przestrzeganie określonej" +
                "kolejności i stałości elementów dla poszczególnych kampanii. Weryfikacja Klientów odbywa się zgodnie z ustalonymi procedurami," +
                "aby potwierdzić ich tożsamość oraz prawo do realizacji żądanych usług.";
        }
        case key_s3: {
            return "Agent posługuje się poprawną polszczyzną, unikając błędów językowych, takich jak \"włańczać\", \"bede\"," +
                "\"proszę Panią\", \"te pismo\", \"te upoważnienie\", \"se napisze\". Nie stosuje niestosownych, potocznych słów czy zwrotów," +
                "takich jak \"fajnie\", \"ok\", \"od ręki\", \"super\", \"wie Pan co\", \"system na mnie wymusza\", \"wyskoczyły mi pytania\"," +
                "\"aplikacja wyrzuciła mi informacje\", \"niech Pan powie\", \"tu widzę\", \"zaraz\", \"w takim razie\", \"jakaś/jakiś\"." +
                "Unika także żargonu firmowego. Nie używa zdrobnień, jak \"chwileczkę\", \"pieniążki\", \"sekundkę\", \"paczuszka\", \"fakturka\"." +
                "Konsultant utrzymuje profesjonalny dystans w relacji z Klientem, stosując odpowiednie zwroty grzecznościowe w sposób umiarkowany." +
                "Udziela informacji w pierwszej osobie, co zapewnia jasność i bezpośredniość w komunikacji.";

        }
        case key_s4: {
            return "Agent unika wtrętów językowych, takich jak \"yyy\", \"eee\", \"mhm\", \"aha\", \"prawda\", \"dobrze\", \"tutaj\", \"tak\"," +
                "\"yhy\", \"no tak\", \"znaczy się\", \"no\", \"proszę mi powiedzieć\", \"właśnie\"." +
                "Dodatkowo, unika zbędnych powtórzeń tych samych słów w celu utrzymania płynności i klarowności komunikacji.";
        }
        default: {
            return 0;
        }
    }
}