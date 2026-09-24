import { useLayoutEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { ScrollToTopButton } from "./components/ScrollToTopButton";
import { useTranslation } from "react-i18next";
import { AgencyProvider } from "./context/AgencyContext";
import { AdminPage } from "./pages/AdminPage";
import { AboutPage } from "./pages/AboutPage";
import { ArtistDetailPage } from "./pages/ArtistDetailPage";
import { ArtistsPage } from "./pages/ArtistsPage";
import { ContactPage } from "./pages/ContactPage";
import { HomePage } from "./pages/HomePage";
import { NewsPage } from "./pages/NewsPage";
import { NewsDetailPage } from "./pages/NewsDetailPage";

function ScrollManager() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

function App() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const { t } = useTranslation();

  return (
    <AgencyProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:bg-orange focus:px-4 focus:py-2 focus:text-charcoal"
      >
        {t("skip")}
      </a>
      <ScrollManager />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/artists" element={<ArtistsPage />} />
        <Route path="/artists/:category" element={<ArtistsPage />} />
        <Route path="/artist/:id" element={<ArtistDetailPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:id" element={<NewsDetailPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      {!isHome && pathname !== "/admin" && <Footer />}
      <ScrollToTopButton />
    </AgencyProvider>
  );
}

export default App;
