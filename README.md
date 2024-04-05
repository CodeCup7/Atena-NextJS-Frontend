<div align="center">
<img width=200px height=200px src="https://github.com/CodeCup7/CodeCup7/blob/main/assets/atena/logo.png" alt="Project logo">
</div>

<h1 align="center">:star:Atena - Front</h1>
<h3 align="center">Ocenianie i Monitorowanie Jakości Pracy Agentów Contact Center</h3> 
<hr />

<div align="center">
<img src="https://img.shields.io/badge/next%20js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white">
<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white">
<img src="https://img.shields.io/badge/daisyUI-1ad1a5?style=for-the-badge&logo=daisyui&logoColor=white">
<img src="https://img.shields.io/badge/Chart%20js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white">
</div>

<div align="left">
	<h2>:memo:O projekcie</h2>
 	:small_orange_diamond: Repozytorium zawiera przepisany w ramach nauki NextJS i Sprinboot front projekt <a href="https://github.com/CodeCup7/Atena-Excel-Full"><b>Atena-Excel</b></a> i do działania wymaga repozytorium backendu 	<a href="https://github.com/CodeCup7/Atena-SpringBoot-Backend"><b>Atena-SpringBoot-Backend</b></a><br>
	<br>:small_orange_diamond:Aplikacja w wersji Excel działa w organizacji już ponad rok i do tej pory umożliwniła ocenienie ponad :headphones:10k rozmów i :email:1k maili. 
	<br>Obecnie ocenia prace ponad 150 agentów i jest głównym narzędziem pracy dla kilku trenerów.
	<br>:small_orange_diamond: Specyfika procesu jest tutaj nieco zmieniona - dostep do aplikacji uzyskują wszyscy użytkownicy, a system udostępnienia danych poprzez mail zastąpiłem powiadomieniami w aplikacji.
</div>
<br>

<table>
  <tr align="center">
    <td>Strona startowa</td>
     <td>Karta oceny rozmowy</td>
     <td>Dashboard Agenta</td>
  </tr>
  <tr align="center">
    <td><img src="https://github.com/CodeCup7/CodeCup7/blob/main/assets/atena-nextjs/start.png"></td>
    <td><img src="https://github.com/CodeCup7/CodeCup7/blob/main/assets/atena-nextjs/karta-oceny.png"></td>
    <td><img src="https://github.com/CodeCup7/CodeCup7/blob/main/assets/atena-nextjs/dashboard.png"></td>
  </tr>
 </table>
 
## :bulb: Główne Cechy

:diamond_shape_with_a_dot_inside: 1. Ocena jakości rozmów i korespondencji mail / social
<br>:diamond_shape_with_a_dot_inside: 2. Przeprowadzanie comiesięcznych coachingów
<br>:diamond_shape_with_a_dot_inside: 3. Monitorowanie jakości (Dashboard, Statystyki)
<br>:diamond_shape_with_a_dot_inside: 4. Ocena bieżącego odsłuchu
<br>:diamond_shape_with_a_dot_inside: 5. Ocena tajemniczego klienta
<br>:diamond_shape_with_a_dot_inside: 6. Agregowanie wyników testów wiedzy
<br>:diamond_shape_with_a_dot_inside: 7. Agregowanie informacji zwrotnej "feedback" - pochwał i skarg
<br>:diamond_shape_with_a_dot_inside: 8. Wyszukiwanie informacji po kryteriach
<br>:diamond_shape_with_a_dot_inside: 9. Dashboard kolejek, trenerów oraz rankingi
<br>:diamond_shape_with_a_dot_inside: 10. Powiadomienia o nowych ocenach, odwołaniach ...
<br>:diamond_shape_with_a_dot_inside: 11. Generowanie ocen i kart oraz ich export do pliku
<br>:diamond_shape_with_a_dot_inside: 12. Generowanie raportów z błędów agentów
<br>:diamond_shape_with_a_dot_inside: 13. Pełna administracja użytkownikami, kolejkami i danymi

## :computer:Technologia
:small_blue_diamond: 1. Pełna aplikacja w React NextJS
<br>:small_blue_diamond: 2. Style - Tailwind CSS
<br>:small_blue_diamond: 3. Biblioteka Tailwinda - DaisyUI
<br>:small_blue_diamond: 4. Wykresy Chart.js oraz use-gauge
<br>:small_blue_diamond: 5. Autoryzacja domenowa
<br>:small_blue_diamond: 6. Backend - Spring Boot
<br>:small_blue_diamond: 6. Baza danych - SQLite

## :rocket:Instalacja

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Otwórz przeglądarkę [http://localhost:3000](http://localhost:3000) 

<b> Do działania wymaga repozytorium backendu <a href="https://github.com/CodeCup7/Atena-SpringBoot-Backend"><b>Atena-SpringBoot-Backend</b></a><br> </b>

## :dart:Przykładowy proces:
### :point_right: 1. Oceń rozmowę lub wiadomość:
Używając karty oceny lub karty mail. Wybierz agenta, daty, kolejkę tam gdzie wymagane. Następnie możesz wybrać oceny poszczególnych bloków jak wiedza czy technika obsługi. Przykładową ocenę pokazano poniżej:

https://github.com/CodeCup7/Atena-NextJS-Frontend/assets/97393786/aba00277-92f4-4487-a036-12c5491d7392

### :point_right: 2. Przeprowadź coaching:
Po ocenie jednej lub wielu rozmów / mailu przejdź do menu monitoringu. Wybierz miesiąc i pobierz dane. Wybierze agenta którego rozmowy oceniono
i jego rozmowy zaznaczając je. Wybierz rozpocznij coaching. Na karcie coacha możesz zatwierdzić coaching lub wpisać dodatkowe uwagi. Po zatwierdzeniu możesz wygenerować dashboard dla ocenionego agenta.

https://github.com/CodeCup7/Atena-NextJS-Frontend/assets/97393786/61d750df-e93c-46df-b8d6-8651993773c1

### :point_right: 3. Sprawdź postępy:
Na końcu możesz wygenerować Dashboard Agenta i sprawdzić jego postępy. 

https://github.com/CodeCup7/Atena-NextJS-Frontend/assets/97393786/d2724e6a-8356-4212-ac00-3fcd3801b34e

### :point_right: 4. Logowanie:
W wersji demonstracyjnej można poprzez plik <b>auth</b> zmienić logowanie z admin/coucha na użytkownika. Na produkcji jest logowanie domenowe.

## :art: Layout
Tailwind CSS, DaisyUI, AI, heroicons, Chart.js, use-gauge, 

## ✍️Autor
Szymon Kawa

 ##  :telephone: Kontakt
:link: [@github](https://github.com/CodeCup7) 
