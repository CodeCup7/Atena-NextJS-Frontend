import { Type_Rate } from "./classes/enums";

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

export const blockData = [];

export function getWagRate(key: string, typeRate: Type_Rate) {


    switch (key) {
        case key_w1: {
            return typeRate === Type_Rate.CC_ ? 20 : 25;
        }
        case key_o1: {
            return typeRate === Type_Rate.CC_ ? 8 : 10;
        }
        case key_t1: {
            return typeRate === Type_Rate.CC_ ? 15 : 20;
        }
        case key_t2: {
            return typeRate === Type_Rate.CC_ ? 8 : 15;
        }
        case key_t3: {
            return typeRate === Type_Rate.CC_ ? 7 : 0;
        }
        case key_t4: {
            return typeRate === Type_Rate.CC_ ? 5 : 0;
        }
        case key_k1: {
            return typeRate === Type_Rate.CC_ ? 6 : 0;
        }
        case key_k2: {
            return typeRate === Type_Rate.CC_ ? 7 : 0;
        }
        case key_k3: {
            return typeRate === Type_Rate.CC_ ? 6 : 0;
        }
        case key_s1: {
            return typeRate === Type_Rate.CC_ ? 2 : 10;
        }
        case key_s2: {
            return typeRate === Type_Rate.CC_ ? 7 : 10;
        }
        case key_s3: {
            return typeRate === Type_Rate.CC_ ? 7 : 10;
        }
        case key_s4: {
            return typeRate === Type_Rate.CC_ ? 2 : 0;
        }
        default: {
            return typeRate === Type_Rate.CC_ ? 0 : 0;
        }
    }
}

export function getKeyTitle(key: string, typeRate: Type_Rate):string {

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
            return typeRate === Type_Rate.CC_ ?
                "znajomość produktów i usług świadczonych oraz aktów prawnych, przepisów, wytycznych" :
                "znajomość produktów i usług świadczonych oraz aktów prawnych, przepisów, wytycznych";
        }
        case key_o1: {
            return typeRate === Type_Rate.CC_ ?
                "umiejętność korzystania z aplikacji i systemów oraz właściwe wprowadzanie danych pozyskanych podczas rozmowy" :
                "umiejętność korzystania oraz poruszania się w aplikacjach i systemach";
        }
        case key_t1: {
            return typeRate === Type_Rate.CC_ ?
                "rozpoznawanie potrzeb" :
                "Rozpoznanie potrzeb klienta i zaproponowanie właściwego rozwiązania";
        }
        case key_t2: {
            return typeRate === Type_Rate.CC_ ?
                "praca z objekcjami" :
                "Praca z obiekcjami, reagowanie na uwagi Klienta - w tym trudny Klient";

        }
        case key_t3: {
            return typeRate === Type_Rate.CC_ ?
                "dbałość o wizerunek firmy" :
                "";
        }
        case key_t4: {
            return typeRate === Type_Rate.CC_ ?
                "kontrola rozmowy, właściwe zarządzanie czasem i przebiegiem rozmowy" :
                "";
        }
        case key_k1: {
            return typeRate === Type_Rate.CC_ ?
                "forma wypowiedzi" :
                "";
        }
        case key_k2: {
            return typeRate === Type_Rate.CC_ ?
                "brak negatywnych emocji w rozmowie" :
                "";
        }
        case key_k3: {
            return typeRate === Type_Rate.CC_ ?
                "aktywne słuchanie" :
                "";
        }
        case key_s1: {
            return typeRate === Type_Rate.CC_ ?
                "powitanie i zakończenie rozmowy" :
                "znajomość procesu";
        }
        case key_s2: {
            return typeRate === Type_Rate.CC_ ?
                "znajomość procesu kampanii" :
                "Jakość korespondencji. Poprawność pisowni i styl wypowiedzi";
        }
        case key_s3: {
            return typeRate === Type_Rate.CC_ ?
                "język wypowiedzi" :
                "Forma korespondencji/ Prawidłowy wygląd dokumentu";
        }
        case key_s4: {
            return typeRate === Type_Rate.CC_ ?
                "brak wtrętów językowych" :
                "";
        }
        default: {
            return "";
        }
    }
}

export function getKeyDiscription(key: string, typeRate: Type_Rate) {

    switch (key) {
        case key_w1: {
            return typeRate === Type_Rate.CC_ ?
                "Agent prowadzi dialog zgodnie z aktualnymi źródłami wiedzy (przepisami, wytycznymi, instrukcjami, bazą informacji," +
                "aktualnościami, treściami na stronach internetowych), dostosowując się do potrzeb Klienta." +
                "Agent odpowiada na pytania Klienta udzielając precyzyjnych informacji dotyczących oferowanych produktów/usług/procedur." +
                "W przypadku samodzielnej korekty błędu przez Agenta - oznaczona zostanie ocena - 1," +
                "natomiast w przypadku poprawy błędu na skutek interwencji Klienta - ocena zostanie oznaczona jako 0."
                :
                "Agent udziela poprawnej merytorycznie odpowiedzi na pytania Klienta zgodnie z obowiązującymi źródłami wiedzy, takimi jak rozporządzenia," +
                "regulaminy, instrukcje, baza wiedzy, oraz informacje zawarte na stronach internetowych firmy. Dodatkowo, agent kieruje się obowiązującymi" +
                "przepisami prawa dotyczącymi dziedziny działalności przedsiębiorstwa.";
        }
        case key_o1: {
            typeRate === Type_Rate.CC_ ?
                "Sprawne wykorzystanie dostępnych narzędzi i aplikacji, odnajdywanie trafnych informacji w sieci, wyszukiwanie" +
                "konkretnych przepisów w aktach prawnych, oraz asystowanie Klientowi w poruszaniu się po stronach internetowych." +
                "Precyzyjne zarejestrowanie zgłoszeń, zleceń, wniosków, notatek, incydentów, oraz reakcja na interwencje" +
                "Klientów zgodnie z obowiązującymi procedurami."
                :
                "Agent wykazuje umiejętność sprawnego posługiwania się dostępnymi programami, aplikacjami oraz stronami internetowymi." +
                "Potrafi skutecznie wyszukiwać potrzebne i poprawne informacje, korzystając z różnorodnych zasobów online, takich jak bazy danych, portale branżowe," +
                "czy oficjalne strony internetowe firm. Dodatkowo, agent potrafi wykorzystać funkcje programów i aplikacji w celu efektywnego zarządzania danymi oraz" +
                "dokumentacją potrzebną do udzielania wsparcia lub rozwiązania problemu Klienta.";
        }
        case key_t1: {
            typeRate === Type_Rate.CC_ ?
                "Zadawanie pytań w celu ustalenia potrzeb Klienta oraz klarowne wyjaśnianie niejasności," +
                "włączając w to stosowanie parafrazy do potwierdzenia zrozumienia jego wypowiedzi." +
                "Pozyskiwanie istotnych informacji związanych z problemem Klienta, które mogą mieć wpływ na efektywną realizację usługi." +
                "Dostosowanie propozycji do indywidualnych potrzeb Klienta, przekazywanie kluczowych informacji dotyczących jego sprawy." +
                "Proponowanie rozwiązań zgodnych z procedurami."
                :
                "Agent dokonuje rozpoznania sprawy Klienta poprzez analizę przesłanego zapytania. Sprawdza ciągłość wcześniejszej korespondencji," +
                "aby lepiej zrozumieć kontekst oraz ewentualne wcześniejsze rozwiązania.W przypadku korespondencji dotyczącej cennika lub propozycji" +
                "skorzystania z usług, agent wykorzystuje język korzyści, prezentując ofertę w sposób korzystny dla Klienta";
        }
        case key_t2: {
            typeRate === Type_Rate.CC_ ?
                "Prezentowanie się jako profesjonalista poprzez unikanie sformułowań o negatywnym wydźwięku " +
                "oraz eliminowanie zwrotów, które mogą budzić niepewność lub podważać kompetencje, takich jak:" +
                " \"niestety\", \"nie pomogę\", \"nie wiem\", \"nie da się\", \"nie mogę\", \"nie mamy możliwości\", \"musi Pan/Pani\"," +
                " \"moim zdaniem\", \"podejrzewam\", \"z doświadczenia wiem\", \"mogę tylko\", \"nie jestem w stanie\", \"obawiam się\", " +
                " \"myślę że\", \"prawdopodobnie\", \"ewentualnie mogę\", \"w ostateczności\", \"w razie czego\", \"tylko...\", \"być może\"."
                :
                "Agent udziela wyczerpującej odpowiedzi, która jest adekwatna do zapytania Klienta. Wiadomość jest napisana w sposób konkretny," +
                "dostosowany do odbiorcy i charakteru sprawy. Odpowiedź jest skoncentrowana na treści przesłanego zapytania, aby zapewnić kompleksowe" +
                "rozwiązanie problemu lub udzielenie potrzebnych informacji. W przypadku rozwiązywania wątpliwości Klienta, agent korzysta z właściwej argumentacji.";
        }
        case key_t3: {
            typeRate === Type_Rate.CC_ ?
                "Rozpoznawanie i zrozumienie motywacji, które skłaniają Klientów do wyrażania zastrzeżeń dotyczących realizowanych " +
                "zadań w obszarze przetwarzania danych osobowych.Skupianie uwagi Klienta na faktach oraz kształtowanie pozytywnego wizerunku," +
                "przy jednoczesnym unikaniu negatywnych wypowiedzi na temat polityki prywatności lub konkurencji."
                :
                "";
        }
        case key_t4: {
            typeRate === Type_Rate.CC_ ?
                "Agent odpowiednio kieruje przebiegiem rozmowy, udzielając konkretnej, rzeczowej i zrozumiałej odpowiedzi na pytania Klienta, z" +
                "godnie z ich potrzebami. Sprawnie operuje aplikacjami i nie odchodzi od tematu, trzymając się głównego wątku rozmowy i unikając" +
                "zbędnych dyskusji. W przypadku konieczności weryfikacji informacji, informuje Klienta o zawieszeniu rozmowy (hold)," +
                "tłumacząc powód, i dba o minimalizację czasu oczekiwania. Po podjęciu rozmowy ponownie dziękuje za cierpliwość" +
                "i informuje o ewentualnym wydłużeniu przerwy z uzasadnieniem. Konsultant witając się z  Klientem po połączeniu" +
                "i rozłączając się po zakończeniu rozmowy (jeśli przerwa trwa dłużej niż 10 sekund),dba o profesjonalizm w komunikacji."
                :
                "";
        }
        case key_k1: {
            typeRate === Type_Rate.CC_ ?
                "Agent mówi głośno, wyraźnie i płynnie. Agent stosuje odpowiednie tempo wypowiedzi. Zbyt szybkie mówienie może powodować" +
                "trudności zrozumienia komunikatu, zbyt wolne może być denerwujące dla odbiorcy. Poprawna dykcja. Brak: połykania końcówek," +
                "skracania słów, przerw pomiędzy słowami a nawet zdaniami. Odpowiedni ton głosu, w którym słychać entuzjazm i pozytywne nastawienie." +
                "Brak monotonii. W rozmowie akcentowane są najważniejsze kwestie. Agent stosuje odpowiednie pauzy." +
                "Brak wypowiedzi „na jednym wdechu”. Brak: przeciągania wyrazów/końcówek, przesadnego akcentowania."
                :
                "";
        }
        case key_k2: {
            typeRate === Type_Rate.CC_ ?
                "Agent rozmawia uprzejmie, nie przenosząc negatywnych emocji z poprzednich interakcji." +
                "Nie reaguje śmiechem na zachowanie, problemy, ton głosu lub sposób mówienia Klienta. Jest opanowany nawet w sytuacjach," +
                "gdy Klient jest zirytowany lub niezrozumiały. Nie atakuje Klienta, unika traktowania go z wyższością, jak również nie okazuje" +
                "zdenerwowania, zirytowania, arogancji czy znudzenia. Unika wypowiedzi w tonie ironicznym, sarkastycznym czy cynicznym." +
                "Nie daje Klientowi wrażenia, że zależy mu na szybkim zakończeniu rozmowy."
                :
                "";
        }
        case key_k3: {
            typeRate === Type_Rate.CC_ ?
                "Agent skupia się na wypowiedzi Klienta poprzez uważne słuchanie, unikając wielokrotnego dopytywania o to samo," +
                "nie przerywając mu ani nie mówiąc równocześnie. W przypadku, gdy wypowiedź Klienta jest niespójna lub odchodzi od tematu rozmowy," +
                "Agent może w sposób uprzejmy przerwać, ale dba o zachowanie kultury w komunikacji. Reaguje na monolog Klienta oraz" +
                "akceptuje milczenie, pozwalając Klientowi dokończyć wypowiedź. Jeśli Klient przerywa Agentowi, ten zawiesza głos," +
                "umożliwiając mu dokończenie wypowiedzi."
                :
                "";
        }
        case key_s1: {
            typeRate === Type_Rate.CC_ ?
                "Powitanie zgodnie ze standardem : \"Dzień dobry, tutaj agent Anna Kowalska. W czym mogę pomóc?\" Pożegnanie zgodnie ze standardem: " +
                " \"Dziękuję za rozmowę, jeśli jeszcze czegoś potrzebujesz, proszę śmiało się zgłosić. Miłego dnia i do usłyszenia!\""
                :
                "Agent proponuje rozwiązanie zgodne z obowiązującymi procedurami, które zostały ustalone w firmie. Propozycja uwzględnia wszystkie wymogi" +
                "i kroki niezbędne do skutecznego rozwiązania problemu lub realizacji żądanej usługi. Działanie jest zgodne z przyjętymi standardami działania" +
                "firmy oraz zapewnia zgodność z obowiązującymi przepisami i regulacjami..";
        }
        case key_s2: {
            typeRate === Type_Rate.CC_ ?
                "W przypadku kampanii, gdzie został wdrożony skrypt rozmowy lub proces kampanii, istotne jest przestrzeganie określonej" +
                "kolejności i stałości elementów dla poszczególnych kampanii. Weryfikacja Klientów odbywa się zgodnie z ustalonymi procedurami," +
                "aby potwierdzić ich tożsamość oraz prawo do realizacji żądanych usług."
                :
                "Poprawność stylistyczna, gramatyczna, ortograficzna oraz interpunkcyjna. Ustosunkowanie się z szacunkiem poprzez stosowanie właściwej" +
                "formy grzecznościowej (Pan/Pani/Państwu). Agent wystrzega się użycia wyrażeń o negatywnym wydźwięku, unika też formułujących wątpliwości" +
                "lub podważających jego zdolności (np. niestety, nie zdołam, nie posiadam informacji, nie da się, nie mam możliwości, musi Pan/Pani, moim zdaniem," +
                "przypuszczam, na podstawie doświadczenia wiem, potrafię jedynie, nie potrafię, mam obawy, rozważam, prawdopodobnie," +
                "w razie potrzeby, wyłącznie..., być może).";
        }
        case key_s3: {
            typeRate === Type_Rate.CC_ ?
                "Agent posługuje się poprawną polszczyzną, unikając błędów językowych, takich jak \"włańczać\", \"bede\"," +
                "\"proszę Panią\", \"te pismo\", \"te upoważnienie\", \"se napisze\". Nie stosuje niestosownych, potocznych słów czy zwrotów," +
                "takich jak \"fajnie\", \"ok\", \"od ręki\", \"super\", \"wie Pan co\", \"system na mnie wymusza\", \"wyskoczyły mi pytania\"," +
                "\"aplikacja wyrzuciła mi informacje\", \"niech Pan powie\", \"tu widzę\", \"zaraz\", \"w takim razie\", \"jakaś/jakiś\"." +
                "Unika także żargonu firmowego. Nie używa zdrobnień, jak \"chwileczkę\", \"pieniążki\", \"sekundkę\", \"paczuszka\", \"fakturka\"." +
                "Konsultant utrzymuje profesjonalny dystans w relacji z Klientem, stosując odpowiednie zwroty grzecznościowe w sposób umiarkowany." +
                "Udziela informacji w pierwszej osobie, co zapewnia jasność i bezpośredniość w komunikacji."
                :
                "";

        }
        case key_s4: {
            typeRate === Type_Rate.CC_ ?
                "Agent unika wtrętów językowych, takich jak \"yyy\", \"eee\", \"mhm\", \"aha\", \"prawda\", \"dobrze\", \"tutaj\", \"tak\"," +
                "\"yhy\", \"no tak\", \"znaczy się\", \"no\", \"proszę mi powiedzieć\", \"właśnie\"." +
                "Dodatkowo, unika zbędnych powtórzeń tych samych słów w celu utrzymania płynności i klarowności komunikacji."
                :
                "";
        }
        default: {
            return 0;
        }
    }
}