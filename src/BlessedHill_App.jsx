import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import BlessedHillHome     from "./BlessedHill_Home";
import BlessedHillServices from "./BlessedHill_Services";
import BlessedHillGallery  from "./BlessedHill_Gallery";
import BlessedHillReviews  from "./BlessedHill_Reviews";
import BlessedHillTour     from "./BlessedHill_ScheduleTour";
import BlessedHillCareer   from "./BlessedHill_Career";
import BlessedHillPrivacyPolicy from "./BlessedHill_PrivacyPolicy";
import BlessedHillAdminLogin    from "./BlessedHill_AdminLogin";
import BlessedHillAdmin         from "./BlessedHill_Admin";


const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH;
// Map nav label → page key
// Map nav label → page key
const LABEL_TO_PAGE = {
  "Home":             "home",
  "Services":         "services",
  "Gallery":          "gallery",
  "Reviews":          "reviews",
  "Schedule a Tour":  "tour",
  "Career":           "career",
  "Privacy Policy":  "privacy",
};

export default function App() {
  const [page, setPage] = useState("home");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminChecked, setAdminChecked] = useState(false);

  // Scroll to top on every page change
  // Check if URL contains the secret admin path
  useEffect(() => {
    const path = window.location.hash.replace("#", "").replace("/", "");
    if (path === ADMIN_PATH) setPage("admin-login");
  }, []);

  // Check if already logged in as admin
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setIsAdmin(true);
      setAdminChecked(true);
    });
  }, []);

  // Scroll to top on every page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [page]);

  // navigate accepts either a nav label ("Schedule a Tour") or a page key ("tour")
  const navigate = (target) => {
    const key = LABEL_TO_PAGE[target] ?? target;
    setPage(key);
  };

  const props = { navigate };

  if (!adminChecked) return null;

  // Admin login page
  if (page === "admin-login") {
    if (isAdmin) return <BlessedHillAdmin onLogout={() => { setIsAdmin(false); setPage("admin-login"); }} />;
    return <BlessedHillAdminLogin onLogin={() => { setIsAdmin(true); setPage("admin"); }} />;
  }

  // Admin portal
  if (page === "admin" && isAdmin) {
    return <BlessedHillAdmin onLogout={() => { setIsAdmin(false); setPage("admin-login"); }} />;
  }

  return (
    <>
      {page === "home"     && <BlessedHillHome     {...props} />}
      {page === "services" && <BlessedHillServices {...props} />}
      {page === "gallery"  && <BlessedHillGallery  {...props} />}
      {page === "reviews"  && <BlessedHillReviews  {...props} />}
      {page === "tour"     && <BlessedHillTour      {...props} />}
      {page === "career"   && <BlessedHillCareer   {...props} />}
      {page === "privacy" && <BlessedHillPrivacyPolicy {...props} />}
    </>
  );
}
