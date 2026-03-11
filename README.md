# A Tudás Torna! – Kvíz Játék

---

## Bevezetés

A **„Tudás Torna"** egy webalapú kvíz játék alkalmazás, amely lehetővé teszi a felhasználóknak, hogy teszteljék tudásukat és bővítsék ismereteiket. Az alkalmazás célja egy könnyen használható felület biztosítása, amely játékos formában segíti a tudás felmérését és fejlesztését. A játék során a felhasználók különböző témakörök – például történelem, földrajz, irodalom, sport, zene stb. – kérdéseire válaszolhatnak, miközben egyre nagyobb virtuális nyereményt és pontokat gyűjthetnek össze. A kérdések nehézségi szintje fokozatosan nő. Az alkalmazás ranglistán keresztül lehetővé teszi a játékosok számára a versenyzést, az Eredmények oldalon pedig mindenki nyomon követheti saját fejlődését és korábbi eredményeit. A projekt részeként egy mobilalkalmazás is készült, amely hasonló élményt nyújt a felhasználó számára, azonban a felhasználói felület és egyes funkciók eltérnek.

---

## Készítők

| Név | Szerep |
|---|---|
| **Harkai Dániel** | Backend (játéklogika, kategóriák, kérdések és eredmények lekérése, eredmények felvitele), React webes frontend |
| **Daróczi Gergő** | Backend (admin panel, játékos kezelés, kategória/kérdés CRUD),React Native mobilapp ,React webes admin  |

---

## Fő funkciók

### Nem bejelentkezett felhasználó
- Regisztráció
- Bejelentkezés
- Kategória választás
- Kérdések megválaszolása
- Segítségek használata (telefon, közönség, felező)
- Kilépés az adott kvízből

### Bejelentkezett felhasználó
A nem bejelentkezett felhasználók összes funkcióját elérik és az alábbi kiegészítő lehetőségekkel rendelkeznek:

- Eredmények elmentése
- Eredmények megtekintése és törlése
- Statisztikák megtekintése grafikon formájában
- Részvétel az eredménytáblán (ranglistán)

### Admin
- Összes játékos listájának kezelése (szerep adása/elvétele, törlés)
- Kérdések hozzáadása, szerkesztése, törlése
- Kategóriák hozzáadása, szerkesztése, törlése
- Admin webes panel elérése

---

## Architektúra

```
┌─────────────────────┐     HTTP/JSON      ┌──────────────────────┐
│  React Native App   │ ◄────────────────► │  Express.js Backend  │ 
│  (Expo / Mobile)    │                    │ (Node.js, port 3000) │
└─────────────────────┘                    └──────────┬───────────┘
                                                      │ mysql
┌─────────────────────┐     HTTP/JSON                 ▼
│  React Web Admin    │ ◄────────────────► ┌──────────────────────┐
│  (Frontend Admin)   │                    │   MySQL Adatbázis    │
└─────────────────────┘                    │     (phpMyAdmin)     │
                                           └──────────────────────┘
```

| Réteg | Technológia |
|---|---|
| Frontend webes felület | React |
| Mobilalkalmazás | React Native + Expo (TypeScript) |
| Webes admin felület | React |
| Backend API | Node.js + Express.js |
| Adatbázis | MySQL (phpMyAdmin) |
| Authentikáció | JWT (JSON Web Token) + bcrypt |

---

## Telepítés és futtatás

### Előfeltételek
- [Node.js](https://nodejs.org/) (LTS ajánlott)
- [XAMPP](https://www.apachefriends.org/) vagy MySQL szerver
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (mobilapp esetén)
- [Git](https://git-scm.com/)

### 1. Repository klónozása

```bash
git clone https://github.com/felhasznalonev/zarodolgozat.git
cd zarodolgozat
```

### 2. Adatbázis beállítása

1. Indítsd el a MySQL szervert (pl. XAMPP-on keresztül)
2. phpMyAdminban hozz létre egy `zarodolgozat_kvizjatek` nevű adatbázist
3. Importáld a mellékelt SQL fájlt:

```bash
# phpMyAdminban: Importálás → fájl kiválasztása:
zarodolgozat_kvizjatek_create_database.sql
```

### 3. Backend indítása

```bash
cd backend
npm install
node Backend.js
```

A backend elérhető lesz: `http://localhost:3000`

### 4. React Native mobilapp indítása

```bash
cd "frontend Nativ"
npm install
npx expo start
```

Ezután Expo Go alkalmazással (Android/iOS) vagy emulátorral megnyitható.

### 5. Webes felület indítása

```bash
cd "frontend"
npm install
npm start
```

### 6. Webes Admin felület indítása

```bash
cd "Frontend Admin"
npm install
npm start
```

---

## Adatbázis struktúra

> 📸 **Kép helye:** ide illesszétek be a phpMyAdmin táblák képernyőképét

<!-- Példa: ![Adatbázis struktúra](./docs/db_structure.png) -->

### Táblák

| Tábla | Fontosabb mezők |
|---|---|
| `jatekos` | `jatekos_id`, `jatekos_nev`, `jatekos_jelszo` (bcrypt), `jatekos_admin` |
| `kategoria` | `kategoria_id`, `kategoria_nev` |
| `kerdesek` | `kerdesek_id`, `kerdesek_kerdes`, `kerdesek_helyesValasz`, `kerdesek_helytelenValasz1-3`, `kerdesek_kategoria`, `kerdesek_leiras`, `kerdesek_nehezseg` |
| `eredmenyek` | `Eredmenyek_id`, `Eredmenyek_jatekos`, `Eredmenyek_kategoria`, `Eredmenyek_pont`, `Eredmenyek_pontszam`, `Eredmenyek_datum` |

---

## Képernyőképek

| Képernyő | Leírás |
|---|---|
| ![Bejelentkezés](./Githubkepek/Login1.png) | Bejelentkezési képernyő Weben|
| ![Bejelentkezés](./Githubkepek/Login2.png) | Bejelentkezési képernyő Mobilon|
| ![Kategória választó](./Githubkepek/Kategoria1.png) | Játékmód és kategória választó Weben |
| ![Kategória választó](./Githubkepek/Kategoria2.png) | Játékmód és kategória választó Mobilon|
| ![Kérdés](./Githubkepek/Kerdes1.png) | Aktív kvíz kérdés segítségekkel Weben |
| ![Kérdés](./Githubkepek/Kerdes2.png) | Aktív kvíz kérdés segítségekkel Mobilon |
| ![Ranglista](./Githubkepek/Rekord1.png) | Globális nyeremény ranglista  Weben|
| ![Ranglista](./Githubkepek/Rekord2.png) | Globális nyeremény ranglista  Mobilon|
| ![Profil](./Githubkepek/Profil.png) | Felhasználói profil, szint, XP sáv |
| ![Admin panel](./Githubkepek/Admin.png) | Webes admin kezelőfelület |

---

## API végpontok

### Játéklogika – `Backend.js` (Harkai Dániel)

| Metódus | Végpont | Leírás | Body / Params |
|---|---|---|---|
| `GET` | `/kategoria` | Kategóriák listája | – |
| `GET` | `/kategoriaadmin` | Kategóriák kérdésszámmal | – |
| `POST` | `/kerdesekKonnyu` | Könnyű kérdések kategória szerint | `{ kategoria }` |
| `POST` | `/kerdesekKozepes` | Közepes kérdések kategória szerint | `{ kategoria }` |
| `POST` | `/kerdesekNehez` | Nehéz kérdések kategória szerint | `{ kategoria }` |
| `GET` | `/kerdesekKonnyuVegyes` | Könnyű vegyes kategória kérdések | – |
| `GET` | `/kerdesekKozepesVegyes` | Közepes vegyes kategória kérdések | – |
| `GET` | `/kerdesekNehezVegyes` | Nehéz vegyes kategória kérdések | – |
| `GET` | `/nehezVegyes` | Nehéz vegyes (Géniusz mód) | – |
| `POST` | `/jatekos` | Játékos nevének lekérése ID alapján | `{ jatekosId }` |
| `POST` | `/eredmenyek` | Játékos eredményei | `{ jatekosId }` |
| `POST` | `/eredmenyekPontszam` | Játékos pontszámai | `{ jatekosId }` |
| `POST` | `/osszesNyeremeny` | Összes nyeremény összege | `{ jatekosId }` |
| `POST` | `/osszesPontszam` | Összes pontszám összege | `{ jatekosId }` |
| `POST` | `/eredmenyFelvitel` | Eredmény mentése játék után | `{ nyeremeny, pontszam, jatekos, kategoria }` |
| `DELETE` | `/eredmenyTorles/:id` | Eredmény törlése | `:eredmenyek_id` |
| `GET` | `/rekordok` | Nyeremény ranglista | – |
| `GET` | `/pontszamRekordok` | Pontszám ranglista | – |
| `POST` | `/eredmenyekNaponkent` | Napi nyeremény összesítő | `{ jatekosId }` |
| `POST` | `/pontszamokNaponkent` | Napi pontszám összesítő | `{ jatekosId }` |
| `POST` | `/eredmenyekKategoriankent` | Nyeremény kategóriánként | `{ jatekosId, kategoriaId }` |
| `POST` | `/pontszamokKategoriankent` | Pontszám kategóriánként | `{ jatekosId, kategoriaId }` |

---

### Authentikáció & Felhasználókezelés – `Admin.js` (Daróczi Gergő)

| Metódus | Végpont | Leírás | Body / Params |
|---|---|---|---|
| `POST` | `/admin/bejelentkezes` | Bejelentkezés (JWT token) | `{ jatekos_nev, jatekos_jelszo }` |
| `POST` | `/admin/regisztracio` | Regisztráció | `{ jatekos_nev, jatekos_jelszo }` |
| `GET` | `/admin/check-admin/:nev` | Admin státusz lekérése | `:jatekos_nev` |
| `GET` | `/admin/jatekoslista` | Összes játékos listája | – |
| `PUT` | `/admin/jog-ad/:id` | Admin jog megadása | `:jatekos_id` |
| `PUT` | `/admin/jog-elvesz/:id` | Admin jog elvétele | `:jatekos_id` |
| `PUT` | `/admin/engedelykeres/:nev` | Admin jogosultság kérése | `{ jatekos_admin }` |
| `DELETE` | `/admin/jatekostorles/:id` | Játékos törlése | `:jatekos_id` |
| `PUT` | `/admin/jelszo-modositas` | Saját jelszó módosítása | `{ jatekos_nev, regi_jelszo, uj_jelszo }` |
| `DELETE` | `/admin/sajat-fiok-torles/:nev` | Saját fiók törlése | `:jatekos_nev` |

---

### Kérdés CRUD – `Kerdes.js` (Daróczi Gergő)

| Metódus | Végpont | Leírás | Body / Params |
|---|---|---|---|
| `POST` | `/kerdesFeltoltes` | Új kérdés feltöltése | `{ kerdesek_kerdes, helyesValasz, helytelenValasz1-3, kategoria, leiras, nehezseg }` |
| `DELETE` | `/kerdesTorles/:id` | Kérdés törlése | `:kerdesek_id` |
| `PUT` | `/kerdesModositasa/:id` | Kérdés módosítása | `:kerdesek_id` + body |
| `GET` | `/kerdes` | Összes kérdés listája | – |

---

### Kategória CRUD – `Kategoria.js` (Daróczi Gergő)

| Metódus | Végpont | Leírás | Body / Params |
|---|---|---|---|
| `POST` | `/kategoriaFeltoltes` | Új kategória hozzáadása | `{ kategoria_nev }` |
| `PUT` | `/kategoriaModositasa/:id` | Kategória szerkesztése | `:kategoria_id` + `{ kategoria_nev }` |
| `DELETE` | `/kategoriaTorles/:id` | Kategória törlése | `:kategoria_id` |

---

### Játékos CRUD – `Jatekos.js` (Daróczi Gergő)

| Metódus | Végpont | Leírás | Body / Params |
|---|---|---|---|
| `GET` | `/jatekos` | Összes játékos | – |
| `POST` | `/jatekos` | Játékos hozzáadása | `{ jatekos_nev }` |

---

## Munkamegosztás összefoglalás

| Terület | Harkai Dániel | Daróczi Gergő |
|---|---|---|
| React frontend webes felület | ✅ | |
| Backend – játéklogika, kategóriák, kérdések, eredmények | ✅ | |
| Backend – admin, auth (JWT/bcrypt), CRUD | | ✅ |
| React Native mobilalkalmazás |  | ✅ |
| React webes admin panel | | ✅ |
| Adatbázis tervezés | ✅ | ✅ |


> Ez a szoftver kizárólagosan a szerzők saját szellemi terméke, minden jog fenntartva.
