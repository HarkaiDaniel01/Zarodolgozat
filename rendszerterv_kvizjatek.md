# Rendszerterv

## 1. Bevezetés
A rendszer egy webes felületen elérhető kvízjáték, amelyben a felhasználó próbára teheti tudását és bővítheti ismereteit.


## 2. Architektúra
- Adatbázis: Mysql, phpmyamin
- Backend: Express.js
- Frontend: React

## 3. Funkcionális követelmények
Fő funkciók: 
- regisztráció és bejelentkezés
- kérdések kiválasztása témakör szerint
- kérdések megválaszolása
- segítségek használata
- ranglista megjelenítése

Távlati tervek:
- új kérdés felvitele
- kérdés módosítása
- kérdés törlése
- játékos törlése

## 4. Nem funkcionális követelmények
1. Frontend és Backend JSON-ben kommunikál
2. Hibakezelés...
3. Reszponzív
4. Jól áttekinthető kód

## 5. Adatbázis terv

###  5.1 Táblák
jatekos tábla:
- jatekos_id: PK (Primary Key)
- jatekos_nev
- jatekos_jelszo
- jatekos_pontszam
- jatekos_admin

kerdesek tabla:
- kerdesek_id: PK
- kerdesek_kerdes
- kerdesek_helyesValasz
- kerdesek_helytelenValasz1
- kerdesek_helytelenValasz2
- kerdesek_helytelenValasz3
- kerdesek_leiras
- kerdesek_kategoria: IK (Idegen kulcs)
- kerdesek_nehezseg: IK

kategoria tabla:
- kategoria_id: PK
- kategoria_nev

nehezseg tabla:
- nehezseg_id: PK
- nehezseg_szint

### 5.2 Kapcsolatok
- A kategoria tábla kapcsolatban áll a kerdesek táblával, a kerdesek_kategoria mezőn keresztül. A kérdések kategória alapján csoportosíthatóak.
- A nehezseg tabla kapcsolatban áll a kerdesek táblával, a kerdesek_nehezseg mezőn keresztül. A felhasználó különböző nehézségű kérdéseket fog kapni a játék során.

## 6. Adatáramlás

Játékos regisztrálásának folyamata:
1. felhasználó beírja a játékosnevét
2. felh. beír egy jelszót
3. felh. megint beírja a jelszót
4. felh. megnyomja a regisztráció gombot
5. ellenőrzésre kerül, hogy a felh. mind a kétszer ugyanazt a jelszót adta-e meg és a jelszó megfelel-e a követelményeknek
6. POST-os kérdés indul a backendre
7. ha a felh. által megadott játékosnév még nem szerepel az adatbázisban, akkor az adatok rögzítésre kerülnek
8. a játékos automatikusan bejelentkezik

Játékos bejelentkezésének folyamata:
1. felh. megadja a játékosnevet
2. a játékos megadja a jelszót
3. POST-os lekérdezés indul a megadott adatokkal
4. ha a megadott adatok egyeznek, akkor a játékos bejelentkezik és a következő oldalra lép, ellenkező esetben hiba üzenetet kap

A játék indítása:
1. a játékos a játék indítása gombra kattint
2. GET-es lekérdezés indul a backendre
3. a frontend visszakapja a kategóriákat
4. az oldalon megjelennek a kategóriák

Kategória kiválasztása:
1. a játékos kiválaszt egy kategóriát
2. három db POST-os lekérdezés indul a backendre, amely átadja a választott kategóriát és a kérdések nehézsgéi szintjét (könnyű, közepes és nehéz)
3. a frontendre 10 véletlenszerűen kiválasztott kérdés jön vissza (3 könnyű, 3 közepes, 4 nehéz)
4. a válaszlehetőségek véletlenszerűen rendeződnek
5. megjelenik az első kérdés, a négy válaszlehetőség és a három segítség

Kérdések helyes megválaszolása:
1. a játékos megadja a helyes választ
2. a játékos megkapja az adott szinthez tartozó nyereményt
3. megjelenik a következő kérdés (A kérdések fokozatosan nehezednek)
4. ha a játékos mind a 10 kérdést helyesen megválaszolja, akkor megnyerte a játékot
5. PUT lekérdezés indul a backendre, a felhasználó pontszámának módosításával
6. Get lekérdezés indul a backendre
7. megjelenik a ranglista

Kérdések helytelen megválaszolása:
1. a játékos helytelen választ ad meg
2. megjelenik, hogy mi lett volna a helyes válasz és egy rövid leírás
3. a játék véget ér

Felező használata:
1. a játékos kiválasztja a felező segítséget
2. két helytelen válaszlehetőség eltűnik
3. a felező segítség inaktívvá válik, és később nem használható fel

Telefon használata:
1. a játékos kiválasztja a telefon segítséget
2. mind a három helytelen válaszlehetőség eltűnik
3. a telefonos segítség inaktívvá válik, és később nem használható fel

Közönség segítség használata:
1. a játékos kiválasztja a közönség segítséget
2. a válaszlehetőségek véletlenszerű értéket kapnak. A helyes válasz valószínűleg nagyobb értéket fog kapni
3. a válaszlehetőségek mellett megjelenik, hogy hány %-ban gondolta azokat a közönség helyesnek
4. a közönség segítség inaktívvá válik, és később nem használható fel
