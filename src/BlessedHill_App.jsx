import { useState, useEffect } from "react";
import BlessedHillHome     from "./BlessedHill_Home";
import BlessedHillServices from "./BlessedHill_Services";
import BlessedHillGallery  from "./BlessedHill_Gallery";
import BlessedHillReviews  from "./BlessedHill_Reviews";
import BlessedHillTour     from "./BlessedHill_ScheduleTour";
import BlessedHillCareer   from "./BlessedHill_Career";
import BlessedHillPrivacyPolicy   from "./BlessedHill_PrivacyPolicy";
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
