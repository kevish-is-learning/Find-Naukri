"use client";

import { useState, useEffect } from "react";
import { TRANSLATIONS } from "@/lib/translations";
import Header from "@/components/Header";
import NameModal from "@/components/NameModal";
import AlertToast from "@/components/AlertToast";
import ProfileForm from "@/components/ProfileForm";
import ResultsPanel from "@/components/ResultsPanel";
import ExamResultsPanel from "@/components/ExamResultsPanel";

export default function Home() {
  const [lang, setLang] = useState("en");
  const [userName, setUserName] = useState("");
  const [showNameModal, setShowNameModal] = useState(true);
  const [nameInput, setNameInput] = useState("");
  const [activeTab, setActiveTab] = useState("schemes");

  const [profile, setProfile] = useState({
    name: "",
    state: "",
    category: "General",
    income: "Below 2 Lakhs",
    profession: "Student",
    currentClass: "",
    percentage: "",
  });

  // Scheme state
  const [schemes, setSchemes] = useState([]);
  const [schemeGroundingLinks, setSchemeGroundingLinks] = useState([]);
  const [schemeLoading, setSchemeLoading] = useState(false);

  // Exam state
  const [currentExams, setCurrentExams] = useState([]);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [examGroundingLinks, setExamGroundingLinks] = useState([]);
  const [examLoading, setExamLoading] = useState(false);

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

  const showAlert = (title, message, duration = 4000) => {
    setAlert({ title, message, show: true });
    setTimeout(() => {
      setAlert((prev) => ({ ...prev, show: false }));
    }, duration);
  };

  const handleApiError = (error) => {
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

    showAlert(errorTitle, friendlyMessage, 6500);
  };

  const parseApiResponse = async (response) => {
    if (!response.ok) {
      const errorText = await response.text();
      try {
        const parsedError = JSON.parse(errorText);
        const rawMessage =
          parsedError.error || parsedError.message || errorText;
        if (typeof rawMessage === "string" && rawMessage.startsWith("{")) {
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
    return response.json();
  };

  const handleSearchSchemes = async () => {
    if (!profile.state) {
      showAlert(t.validationTitle, t.validationMessage);
      return;
    }

    setSchemeLoading(true);
    setSchemes([]);
    setSchemeGroundingLinks([]);

    try {
      const response = await fetch("/api/schemes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, language: lang }),
      });

      const data = await parseApiResponse(response);
      setSchemes(data.schemes || []);
      setSchemeGroundingLinks(data.groundingLinks || []);
    } catch (error) {
      console.error("Scheme search failed:", error);
      handleApiError(error);
    } finally {
      setSchemeLoading(false);
    }
  };

  const handleSearchExams = async () => {
    if (!profile.state) {
      showAlert(t.validationTitle, t.validationMessage);
      return;
    }

    setExamLoading(true);
    setCurrentExams([]);
    setUpcomingExams([]);
    setExamGroundingLinks([]);

    try {
      const response = await fetch("/api/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, language: lang }),
      });

      const data = await parseApiResponse(response);
      setCurrentExams(data.currentExams || []);
      setUpcomingExams(data.upcomingExams || []);
      setExamGroundingLinks(data.groundingLinks || []);
    } catch (error) {
      console.error("Exam search failed:", error);
      handleApiError(error);
    } finally {
      setExamLoading(false);
    }
  };

  const handleSearch = () => {
    if (activeTab === "exams") {
      handleSearchExams();
    } else {
      handleSearchSchemes();
    }
  };

  const toggleLanguage = () => {
    setLang((prev) => (prev === "en" ? "hi" : "en"));
  };

  const isLoading = activeTab === "exams" ? examLoading : schemeLoading;

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
          loading={isLoading}
          onSearch={handleSearch}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Results Panel — switches based on active tab */}
        {activeTab === "exams" ? (
          <ExamResultsPanel
            t={t}
            lang={lang}
            userName={userName}
            loading={examLoading}
            currentExams={currentExams}
            upcomingExams={upcomingExams}
            groundingLinks={examGroundingLinks}
          />
        ) : (
          <ResultsPanel
            t={t}
            lang={lang}
            userName={userName}
            loading={schemeLoading}
            schemes={schemes}
            groundingLinks={schemeGroundingLinks}
          />
        )}
      </main>
    </div>
  );
}
