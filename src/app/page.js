"use client";

import { useState, useEffect } from "react";
import { TRANSLATIONS } from "@/lib/translations";
import Header from "@/components/Header";
import NameModal from "@/components/NameModal";
import AlertToast from "@/components/AlertToast";
import ProfileForm from "@/components/ProfileForm";
import ResultsPanel from "@/components/ResultsPanel";

export default function Home() {
  const [lang, setLang] = useState("en");
  const [userName, setUserName] = useState("");
  const [showNameModal, setShowNameModal] = useState(true);
  const [nameInput, setNameInput] = useState("");

  const [profile, setProfile] = useState({
    name: "",
    state: "",
    category: "General",
    income: "Below 2 Lakhs",
    profession: "Student",
    currentClass: "",
    percentage: "",
  });

  const [schemes, setSchemes] = useState([]);
  const [groundingLinks, setGroundingLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    title: "",
    message: "",
    show: false,
  });

  const t = TRANSLATIONS[lang];

  // Read saved userName from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem("sg_saved_name");
    if (savedName) {
      setUserName(savedName);
      setProfile((prev) => ({ ...prev, name: savedName }));
      setShowNameModal(false);
    }
  }, []);

  const saveName = () => {
    const trimmed = nameInput.trim();
    const finalName = trimmed === "" ? "User" : trimmed;
    setUserName(finalName);
    setProfile((prev) => ({ ...prev, name: finalName }));
    localStorage.setItem("sg_saved_name", finalName);
    setShowNameModal(false);
  };

  const handleSearch = async () => {
    if (!profile.state) {
      setAlert({
        title: t.validationTitle,
        message: t.validationMessage,
        show: true,
      });
      setTimeout(() => {
        setAlert((prev) => ({ ...prev, show: false }));
      }, 4000);
      return;
    }

    setLoading(true);
    setSchemes([]);
    setGroundingLinks([]);

    try {
      const response = await fetch("/api/schemes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile,
          language: lang,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const parsedError = JSON.parse(errorText);
          const rawMessage =
            parsedError.error || parsedError.message || errorText;
          // Clean nested JSON stringified errors
          if (
            typeof rawMessage === "string" &&
            rawMessage.startsWith("{")
          ) {
            try {
              const subParsed = JSON.parse(rawMessage);
              throw new Error(
                subParsed.error?.message || subParsed.message || rawMessage
              );
            } catch {
              throw new Error(rawMessage);
            }
          }
          throw new Error(rawMessage);
        } catch (parseErr) {
          throw new Error(parseErr.message || errorText);
        }
      }

      const responseData = await response.json();
      setSchemes(responseData.schemes || []);
      setGroundingLinks(responseData.groundingLinks || []);
    } catch (error) {
      console.error("Search failed:", error);

      let friendlyMessage = error.message || t.connectionError;
      let errorTitle = "Service Error";

      if (
        friendlyMessage.includes("429") ||
        friendlyMessage.includes("RESOURCE_EXHAUSTED") ||
        friendlyMessage.includes("quota")
      ) {
        errorTitle = "Rate Limit Exceeded (429)";
        friendlyMessage =
          lang === "en"
            ? "The Gemini API Key has exceeded its free-tier rate limits or search grounding quota. Please wait 10-15 seconds and try again, or check your API key quota settings in AI Studio."
            : "Gemini API कुंजी अपनी फ्री-टियर कोटा सीमा पार कर गई है। कृपया 10-15 सेकंड प्रतीक्षा करें और पुनः प्रयास करें, या AI Studio में अपनी API कुंजी कोटा सेटिंग्स जांचें।";
      }

      setAlert({
        title: errorTitle,
        message: friendlyMessage,
        show: true,
      });
      setTimeout(() => {
        setAlert((prev) => ({ ...prev, show: false }));
      }, 6500);
    } finally {
      setLoading(false);
    }
  };

  const toggleLanguage = () => {
    setLang((prev) => (prev === "en" ? "hi" : "en"));
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/15 blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[-5%] w-[45%] h-[45%] bg-cyan-600/15 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Alert Toast */}
      <AlertToast alert={alert} />

      {/* Name Modal */}
      <NameModal
        show={showNameModal}
        t={t}
        nameInput={nameInput}
        setNameInput={setNameInput}
        onSave={saveName}
      />

      {/* Header */}
      <Header
        t={t}
        lang={lang}
        userName={userName}
        onToggleLanguage={toggleLanguage}
      />

      {/* Main Content */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start relative z-10">
        {/* Profile Form Panel */}
        <ProfileForm
          t={t}
          profile={profile}
          setProfile={setProfile}
          loading={loading}
          onSearch={handleSearch}
        />

        {/* Results Panel */}
        <ResultsPanel
          t={t}
          lang={lang}
          userName={userName}
          loading={loading}
          schemes={schemes}
          groundingLinks={groundingLinks}
        />
      </main>
    </div>
  );
}
