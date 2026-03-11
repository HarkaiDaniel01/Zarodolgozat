import React from "react";

const ApkLetoltes = () => {
  return (
    <div>
      <h1>📱 A tudás torna! - Nyílt Béta </h1>

      <div
        className="doboz"
        style={{
          marginTop: "30px",
          marginBottom: "40px",
          padding: "40px",
          color: "#F5F7FA",
          textAlign: "center",
        }}
      >
        {/* Ikon / Banner */}
        <div style={{ fontSize: "80px", marginBottom: "20px" }}>📲</div>

        <h2 style={{ marginBottom: "20px" }}>Töltsd le a <em>A tudás torna!</em> Nyílt Béta verzióját!</h2>

        <p
          style={{
            fontSize: "18px",
            maxWidth: "600px",
            margin: "0 auto 30px auto",
            lineHeight: "1.7",
            color: "#d0d8e8",
          }}
        >
          Az alkalmazásunkat közvetlenül az APK fájlból telepítheted Android
          készülékedre. Nincs szükség Google Play fiókra — egyszerű, gyors és
          ingyenes.
        </p>

        {/* Biztonság kártya */}
        <div
          style={{
            background: "rgba(0, 200, 100, 0.15)",
            border: "1px solid rgba(0, 220, 120, 0.4)",
            borderRadius: "14px",
            padding: "20px 30px",
            maxWidth: "560px",
            margin: "0 auto 35px auto",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            textAlign: "left",
          }}
        >
          <span style={{ fontSize: "42px" }}>🛡️</span>
          <div>
            <div
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#4ade80",
                marginBottom: "6px",
              }}
            >
              100% biztonságos — vírusmentes
            </div>
            <div style={{ fontSize: "14px", color: "#a8d5b5", lineHeight: "1.5" }}>
              Az APK fájl teljes körűen ellenőrzött és{" "}
              <strong style={{ color: "#86efac" }}>nem tartalmaz vírust</strong>,
              kémprogramot vagy semmilyen káros kódot. Telepítsd félelem
              nélkül!
            </div>
          </div>
        </div>

        {/* Letöltés gomb */}
        <a
          href="/A_tudas_torna_Nyilt_Beta.apk"
          download="A_Tudas_Torna_Nyilt_Beta.apk"
          style={{
            display: "inline-block",
            background: "linear-gradient(135deg, #3a86ff, #764ba2)",
            color: "#fff",
            padding: "15px 45px",
            borderRadius: "12px",
            fontSize: "18px",
            fontWeight: "bold",
            textDecoration: "none",
            boxShadow: "0 4px 20px rgba(58,134,255,0.45)",
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
            marginBottom: "35px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow =
              "0 6px 28px rgba(58,134,255,0.65)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow =
              "0 4px 20px rgba(58,134,255,0.45)";
          }}
        >
          ⬇️ A tudás torna! – Nyílt Béta letöltése
        </a>

        {/* Telepítési útmutató */}
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "14px",
            padding: "25px 30px",
            maxWidth: "560px",
            margin: "0 auto",
            textAlign: "left",
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              fontSize: "16px",
              marginBottom: "14px",
              color: "#93c5fd",
            }}
          >
            🔧 Telepítési útmutató
          </div>
          <ol
            style={{
              margin: 0,
              paddingLeft: "20px",
              color: "#cbd5e1",
              fontSize: "15px",
              lineHeight: "2",
            }}
          >
            <li>
              Nyisd meg a <strong>Beállítások → Biztonság</strong> menüt.
            </li>
            <li>
              Kapcsold be az{" "}
              <strong>„Ismeretlen forrásból való telepítés"</strong> opciót.
            </li>
            <li>
              Töltsd le az APK fájlt a fenti gombbal.
            </li>
            <li>
              Nyisd meg a letöltött fájlt és kövesd a telepítési lépéseket.
            </li>
            <li>
              Kész! Indítsd el az alkalmazást és jelentkezz be.
            </li>
          </ol>
        </div>

        {/* Google Play Protect tipp */}
        <div
          style={{
            background: "rgba(250, 200, 0, 0.1)",
            border: "1px solid rgba(250, 200, 0, 0.35)",
            borderRadius: "14px",
            padding: "18px 24px",
            maxWidth: "560px",
            margin: "25px auto 0 auto",
            display: "flex",
            alignItems: "flex-start",
            gap: "14px",
            textAlign: "left",
          }}
        >
          <span style={{ fontSize: "30px", lineHeight: "1" }}>💡</span>
          <div>
            <div
              style={{
                fontSize: "15px",
                fontWeight: "bold",
                color: "#fbbf24",
                marginBottom: "6px",
              }}
            >
              Google Play Protect figyelmeztetés
            </div>
            <div style={{ fontSize: "14px", color: "#fde68a", lineHeight: "1.6" }}>
              Ha a Google Play Protect megállítja a telepítést, <strong>ne aggódj!</strong>{" "}
              Ez azért történik, mert az alkalmazást a Google Play Áruházon kívülről telepíted.
              A figyelmeztetésnél válaszd a{" "}
              <strong>„Telepítés mindenképpen"</strong> lehetőséget a folytatáshoz.
            </div>
          </div>
        </div>

        {/* Verzióinfó */}
        <div
          style={{
            marginTop: "30px",
            fontSize: "13px",
            color: "#6b7280",
          }}
        >
          A tudás torna! &nbsp;|&nbsp; Jelenlegi verzió: <strong style={{ color: "#9ca3af" }}>v1.1.0b</strong>{" "}
          &nbsp;|&nbsp; Kompatibilitás:{" "}
          <strong style={{ color: "#9ca3af" }}>Android 8.0+</strong>
        </div>
      </div>
    </div>
  );
};

export default ApkLetoltes;
