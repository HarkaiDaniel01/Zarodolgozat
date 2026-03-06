# Frontend Admin Alkalmazás

Ez a projekt egy React alapú adminisztrációs felület, amely egy kérdőív- vagy tesztkészítő rendszer kezelését teszi lehetővé. Az alkalmazás differenciált hozzáférést biztosít adminisztrátorok és felhasználók számára.

## Főbb Funkciók

### Hitelesítés és Jogosultságkezelés
- **Bejelentkezés és Regisztráció:** Biztonságos belépési pontok.
- **Token alapú védelem:** Automatikus kijelentkeztetés és token ellenőrzés (a lejárat kezelése).
- **Védett útvonalak:**
  - `AdminRoute`: Csak adminisztrátorok számára elérhető funkciók.
  - `UserRoute`: Bejelentkezett felhasználók számára elérhető funkciók.

### Adminisztrátori Funkciók
- **Kérdéskezelés:** Új kérdések feltöltése, kategóriák és nehézségi szintek szerinti szűrés.
- **Kategóriakezelés:** Új kategóriák létrehozása és kezelése.
- **Felhasználókezelés:** Engedélykérések elbírálása (`Engedelykeres`).
- **Eredmények:** Felhasználói eredmények megtekintése.
- **Admin Főmenü:** Központi navigációs felület az adminisztrátori műveletekhez.

### Felhasználói Funkciók
- **Felhasználói Menü:** Saját profil és elérhető funkciók kezelése.
- **Beállítások:** Felhasználói fiók beállításainak módosítása (`Felhasznalobeallitas`).

## Technológiák

A projekt a következő főbb technológiákra épül:
- **Keretrendszer:** React (v19)
- **Routing:** React Router DOM (v7)
- **Stílus:** Bootstrap 5, egyedi CSS modulok
- **Értesítések:** SweetAlert2
- **Csomagkezelő:** npm

## Telepítés és Futtatás

A projekt futtatásához szükséges a Node.js telepítése.

1. **Függőségek telepítése:**
   ```bash
   npm install
   ```

2. **Fejlesztői szerver indítása:**
   ```bash
   npm start
   ```
   Az alkalmazás alapértelmezetten a [http://localhost:3000](http://localhost:3000) címen érhető el.

## Könyvtárszerkezet

- `src/AdminFomenu/`: Főmenü és felhasználói menü komponensek.
- `src/Bejelentkezés/`: Bejelentkezési űrlap és logika.
- `src/Regisztralcio/`: Admin regisztrációs felület.
- `src/Kerdesfeltolt/`: Kérdések feltöltése, szűrése (kategória/nehézség).
- `src/KategoriaFeltolt/`: Kategóriák kezelése.
- `src/Felhasználókezel/`: Felhasználói beállítások és engedélyek.
- `src/Eredmenyek/`: Eredmények listázása.
- `src/utils/`: Segédfüggvények (pl. autentikáció).
- `src/styles/`: Globális és komponens szintű stílusfájlok.
