# Kvíz Alkalmazás – React Native Frontend

Mobil kvíz játék React Native (Expo) alapokon, TypeScript-ben írva. A felhasználók kategóriánként tudáspróbán mérhetik össze magukat, a legjobb eredmények ranglistán jelennek meg.

---

## Funkciók

- **Bejelentkezés / Regisztráció** – JWT token alapú hitelesítés
- **Kategóriaválasztó** – kategorikusan szervezett kérdéskörök
- **Kvíz játék** – kérdések és válaszlehetőségek megjelenítése
- **Ranglista** – az összes játékos legjobb eredményei
- **Profil** – saját eredmények, nyeremények megtekintése
- **Sötét / Világos téma** – automatikus rendszerkövetés, kézzel is váltható
- **Easter egg** – rejtett géniusz mód

---

## Képernyők

| Fájl | Leírás |
|---|---|
| `Login.tsx` | Bejelentkezési képernyő |
| `Register.tsx` | Regisztrációs képernyő |
| `Kategoria.tsx` | Kategóriaválasztó |
| `Kerdesek.tsx` | Kérdések és válaszok |
| `Rekordok.tsx` | Globális ranglista |
| `Profil.tsx` | Profil navigátor |
| `Felhasznalo.tsx` | Bejelentkezett felhasználó adatai |
| `OsszesNyeremeny.tsx` | Összes elért nyeremény |
| `Menubar.tsx` | Alsó navigációs sáv |

---

## Technológiai stack

- [React Native](https://reactnative.dev/) + [Expo](https://expo.dev/) (~54)
- TypeScript
- React Navigation (bottom tabs + stack)
- AsyncStorage – token tárolás
- Expo Linear Gradient, Expo Vector Icons
- React Native Chart Kit – statisztikák
- React Native SVG

---

## Telepítés és futtatás

### Előfeltételek

- [Node.js](https://nodejs.org/) (LTS ajánlott)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Android / iOS emulátor vagy fizikai eszköz (Expo Go app)

### Lépések

```bash
# Függőségek telepítése
npm install

# Fejlesztői szerver indítása
npm start

# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

---

## Backend

Az alkalmazás a következő backend szerverhez csatlakozik:

```
https://nodejs201.dszcbaross.edu.hu
```

A backend URL a `Cim.ts` fájlban módosítható.

---

## Projektstruktúra

```
├── App.tsx               # Belépési pont, ThemeProvider, SafeAreaProvider
├── Menubar.tsx           # Navigációs sáv, auth ellenőrzés
├── Kategoria.tsx         # Kategóriaválasztó képernyő
├── Kerdesek.tsx          # Kvíz kérdések képernyő
├── Rekordok.tsx          # Ranglista képernyő
├── Profil.tsx            # Profil navigátor
├── Login.tsx             # Bejelentkezési képernyő
├── Register.tsx          # Regisztrációs képernyő
├── Felhasznalo.tsx       # Felhasználói adatlap
├── OsszesNyeremeny.tsx   # Nyeremények összesítője
├── ThemeContext.tsx       # Téma context (sötét/világos)
├── theme.ts              # Szín- és méretdefiníciók
├── Cim.ts                # Backend URL konfiguráció
└── assets/               # Képek, ikonok
```

---

## Téma kezelés

Az alkalmazás automatikusan követi az operációs rendszer témabeállítását, de a felhasználó manuálisan is válthat sötét és világos mód között. A beállítás AsyncStorage-ban kerül mentésre.
