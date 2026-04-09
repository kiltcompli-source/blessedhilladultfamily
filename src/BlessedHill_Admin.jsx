import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import logo from "./assets/bwr.png";

export default function BlessedHillAdmin({ onLogout }) {
  const [tab, setTab] = useState("reviews");
  const [reviews, setReviews] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [selectedApp, setSelectedApp] = useState(null);
  const [tours, setTours] = useState([]);
  const [selectedTour, setSelectedTour] = useState(null);
  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    const [{ data: rev }, { data: apps }, { data: trs }] = await Promise.all([
      supabase.from("reviews").select("*").order("created_at", { ascending: false }),
      supabase.from("applications").select("*").order("created_at", { ascending: false }),
      supabase.from("tours").select("*").order("created_at", { ascending: false }),    if (rev) setReviews(rev);
    if (apps) setApplications(apps);
    if (trs) setTours(trs);
    setLoading(false);
  };

  const approveReview = async (id) => {
    const { error } = await supabase.from("reviews").update({ approved: true }).eq("id", id);
    if (!error) setReviews(prev => prev.map(r => r.id === id ? { ...r, approved: true } : r));
  };

  const unapproveReview = async (id) => {
    await supabase.from("reviews").update({ approved: false }).eq("id", id);
    setReviews(prev => prev.map(r => r.id === id ? { ...r, approved: false } : r));
  };

  const deleteReview = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    await supabase.from("reviews").delete().eq("id", id);
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  const updateTourStatus = async (id, status) => {
    await supabase.from("tours").update({ status }).eq("id", id);
    setTours(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    if (selectedTour?.id === id) setSelectedTour(prev => ({ ...prev, status }));
  };

  const deleteTour = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tour request?")) return;
    await supabase.from("tours").delete().eq("id", id);
    setTours(prev => prev.filter(t => t.id !== id));
    setSelectedTour(null);
  };

  const updateAppStatus = async (id, status) => {
    await supabase.from("applications").update({ status }).eq("id", id);
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    if (selectedApp?.id === id) setSelectedApp(prev => ({ ...prev, status }));
  };

  const deleteApp = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;
    await supabase.from("applications").delete().eq("id", id);
    setApplications(prev => prev.filter(a => a.id !== id));
    setSelectedApp(null);
  };

  const changePassword = async () => {
    if (!newPassword.trim()) return setPasswordMsg("Please enter a new password.");
    if (newPassword !== confirmPassword) return setPasswordMsg("Passwords do not match.");
    if (newPassword.length < 8) return setPasswordMsg("Password must be at least 8 characters.");
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return setPasswordMsg("Error: " + error.message);
    setPasswordMsg("✓ Password updated successfully!");
    setNewPassword(""); setConfirmPassword("");
    setTimeout(() => { setPasswordMsg(""); setShowPasswordForm(false); }, 3000);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  const pendingReviews = reviews.filter(r => !r.approved);
  const approvedReviews = reviews.filter(r => r.approved);

  const statusColors = {
    "New":         { bg:"#EEF4FB", color:"#2e6da4" },
    "Shortlisted": { bg:"#E8F5EE", color:"#1a6644" },
    "Rejected":    { bg:"#FEF0EE", color:"#c0392b" },
  };

  return (
    <div style={{ fontFamily:"'Playfair Display',Georgia,serif", background:"#f7f5f0", minHeight:"100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--bd:#1a3a5c;--bm:#2e6da4;--bs:#5b9bd5;--gd:#c9a84c;--br:rgba(30,80,140,0.09);--wh:#ffffff;}
        .sans{font-family:'DM Sans',sans-serif}
        body{background:#f0f4f8 !important;color:#1a2b3c !important}

        .admin-bar{background:#1a3a5c;padding:0 40px;display:flex;align-items:center;justify-content:space-between;height:72px;position:sticky;top:0;z-index:100;box-shadow:0 2px 20px rgba(0,0,0,0.15)}
        .admin-bar-left{display:flex;align-items:center;gap:14px}
        .admin-title{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:#ffffff !important}
        .admin-sub{font-family:'DM Sans',sans-serif;font-size:11px;color:#5b9bd5;letter-spacing:2px;text-transform:uppercase}        .admin-bar-right{display:flex;align-items:center;gap:12px}
        .btn-bar{font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;border:none;border-radius:50px;padding:8px 18px;cursor:pointer;transition:all .2s}
        .btn-pwd{background:rgba(255,255,255,.15);color:#ffffff !important;border:1px solid rgba(255,255,255,.25)}
        .btn-pwd:hover{background:rgba(255,255,255,.25)}
        .btn-logout{background:#c0392b;color:#ffffff !important;border:none}
        .btn-logout:hover{background:#a93226}

        .admin-body{max-width:1200px;margin:0 auto;padding:40px}

        /* STATS */
        .stats-row{display:grid;grid-template-columns:repeat(5,1fr);gap:16px;margin-bottom:36px}
        .stat-card{background:#ffffff !important;border:1px solid #dce6f0;border-radius:16px;padding:24px;text-align:center;box-shadow:0 2px 8px rgba(30,80,140,0.06)}
        .stat-num{font-size:36px;font-weight:700;color:#1a3a5c !important;line-height:1}
        .stat-lbl{font-family:'DM Sans',sans-serif;font-size:12px;color:#4a6278 !important;margin-top:6px;text-transform:uppercase;letter-spacing:1px}

        /* TABS */
        .tabs{display:flex;gap:4px;background:#ffffff;border:1px solid #dce6f0;border-radius:50px;padding:4px;margin-bottom:28px;width:fit-content;box-shadow:0 2px 8px rgba(30,80,140,0.06)}
        .tab{font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;border:none;border-radius:50px;padding:10px 24px;cursor:pointer;background:none;color:#4a6278 !important;transition:all .2s}
        .tab.active{background:#1a3a5c;color:#ffffff !important;font-weight:600}

        /* CARDS */
        .cards{display:flex;flex-direction:column;gap:16px}
        .card{background:#ffffff !important;border:1px solid #dce6f0;border-radius:16px;padding:24px;box-shadow:0 2px 8px rgba(30,80,140,0.06)}
        .card-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px}
        .card-author{font-size:18px;font-weight:700;color:#1a3a5c !important}
        .card-meta{font-family:'DM Sans',sans-serif;font-size:12px;color:#4a6278 !important;margin-top:2px}
        .card-quote{font-family:'DM Sans',sans-serif;font-size:14px;color:#2c4a62 !important;line-height:1.7;font-style:italic;margin-bottom:16px;padding-left:12px;border-left:3px solid #c9a84c}
        .card-actions{display:flex;gap:8px;flex-wrap:wrap}
        .btn-approve{background:#d4edda;color:#155724 !important;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;border:1px solid #c3e6cb;border-radius:50px;padding:8px 18px;cursor:pointer;transition:all .2s}
        .btn-approve:hover{background:#155724;color:#ffffff !important}
        .btn-unapprove{background:#fff3cd;color:#856404 !important;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;border:1px solid #ffeeba;border-radius:50px;padding:8px 18px;cursor:pointer;transition:all .2s}
        .btn-unapprove:hover{background:#856404;color:#ffffff !important}
        .btn-delete{background:#f8d7da;color:#721c24 !important;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;border:1px solid #f5c6cb;border-radius:50px;padding:8px 18px;cursor:pointer;transition:all .2s}
        .btn-delete:hover{background:#721c24;color:#ffffff !important}
        .badge{display:inline-flex;align-items:center;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;padding:4px 12px;border-radius:50px}
        .stars{color:#c9a84c;font-size:14px;margin-bottom:8px}

        /* SECTION LABEL */
        .section-label{font-family:'DM Sans',sans-serif;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#2e6da4 !important;margin-bottom:14px;margin-top:28px;display:flex;align-items:center;gap:10px}
        .section-label::after{content:'';flex:1;height:1px;background:#dce6f0}

        /* APPLICATIONS & TOURS */
        .app-layout{display:grid;grid-template-columns:1fr 380px;gap:24px;align-items:start}
        .app-card{background:#ffffff !important;border:1px solid #dce6f0;border-radius:16px;padding:20px;cursor:pointer;transition:all .2s;box-shadow:0 2px 8px rgba(30,80,140,0.04)}
        .app-card:hover{border-color:#5b9bd5;box-shadow:0 4px 20px rgba(30,80,140,0.1)}
        .app-card.selected{border-color:#2e6da4;border-width:2px;box-shadow:0 4px 20px rgba(30,80,140,0.15)}
        .app-name{font-size:17px;font-weight:700;color:#1a3a5c !important;margin-bottom:4px}
        .app-pos{font-family:'DM Sans',sans-serif;font-size:13px;color:#2e6da4 !important;font-weight:500;margin-bottom:8px}
        .app-date{font-family:'DM Sans',sans-serif;font-size:11px;color:#4a6278 !important}

        /* DETAIL PANEL */
        .detail-panel{background:#ffffff !important;border:1px solid #dce6f0;border-radius:16px;padding:28px;position:sticky;top:90px;box-shadow:0 2px 8px rgba(30,80,140,0.06)}
        .detail-title{font-size:22px;font-weight:700;color:#1a3a5c !important;margin-bottom:4px}
        .detail-pos{font-family:'DM Sans',sans-serif;font-size:14px;color:#2e6da4 !important;font-weight:500;margin-bottom:20px}
        .detail-row{display:flex;flex-direction:column;gap:14px;margin-bottom:20px}
        .detail-field label{font-family:'DM Sans',sans-serif;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#4a6278 !important;display:block;margin-bottom:3px}
        .detail-field p{font-family:'DM Sans',sans-serif;font-size:14px;color:#1a2b3c !important}
        .detail-actions{display:flex;flex-direction:column;gap:8px}
        .btn-status{width:100%;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;border:none;border-radius:50px;padding:11px;cursor:pointer;transition:all .2s}
        .btn-shortlist{background:#d4edda;color:#155724 !important;border:1px solid #c3e6cb}
        .btn-shortlist:hover{background:#155724;color:#ffffff !important}
        .btn-reject{background:#f8d7da;color:#721c24 !important;border:1px solid #f5c6cb}
        .btn-reject:hover{background:#721c24;color:#ffffff !important}
        .btn-del-app{background:#f0f4f8;color:#4a6278 !important;border:1px solid #dce6f0}
        .btn-del-app:hover{background:#721c24;color:#ffffff !important}
        .no-select{font-family:'DM Sans',sans-serif;font-size:14px;color:#4a6278 !important;text-align:center;padding:40px 0}

        /* PASSWORD MODAL */
        .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:200;display:flex;align-items:center;justify-content:center}
        .modal{background:#ffffff !important;border-radius:20px;padding:36px;width:100%;max-width:400px;box-shadow:0 20px 60px rgba(0,0,0,.2)}
        .modal-title{font-size:22px;font-weight:700;color:#1a3a5c !important;margin-bottom:20px}
        .inp{width:100%;font-family:'DM Sans',sans-serif;font-size:15px;color:#1a2b3c !important;background:#f8fafc;border:1.5px solid #dce6f0;border-radius:12px;padding:12px 16px;outline:none;transition:border-color .2s;margin-bottom:14px}
        .inp:focus{border-color:#5b9bd5}
        .lbl{font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;letter-spacing:.8px;text-transform:uppercase;color:#4a6278 !important;display:block;margin-bottom:6px}
        .pwd-msg{font-family:'DM Sans',sans-serif;font-size:13px;margin-bottom:12px}
        .modal-actions{display:flex;gap:10px}
        .btn-save{flex:1;background:#1a3a5c;color:#ffffff !important;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;border:none;border-radius:50px;padding:12px;cursor:pointer}
        .btn-save:hover{background:#2e6da4}
        .btn-cancel{flex:1;background:#f0f4f8;color:#4a6278 !important;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;border:none;border-radius:50px;padding:12px;cursor:pointer}
        .btn-cancel:hover{background:#dce6f0}

        .empty{font-family:'DM Sans',sans-serif;font-size:14px;color:#4a6278 !important;text-align:center;padding:48px;background:#ffffff !important;border-radius:16px;border:1px solid #dce6f0}

        @media(max-width:900px){
          .admin-bar{padding:0 20px}
          .admin-body{padding:24px 20px}
          .stats-row{grid-template-columns:1fr 1fr}
          .app-layout{grid-template-columns:1fr}
        `}</style>

      {/* TOP BAR */}
      <div className="admin-bar">
        <div className="admin-bar-left">
          <img src={logo} alt="Blessed Hill" style={{height:"180px", width:"auto"}} />
         <div>
            <div className="admin-title">Blessed Hill</div>
            <div className="admin-sub sans">Adult Family Home</div>
          </div>
          <div style={{width:"1px", height:"36px", background:"rgba(255,255,255,.2)", margin:"0 4px"}} />
          <div>
            <div style={{fontFamily:"'DM Sans',sans-serif", fontSize:"25px", color:"rgba(255,255,255,.5)", letterSpacing:"2px", textTransform:"uppercase"}}>Admin Portal</div>
          </div>
        </div>
        <div className="admin-bar-right">
          <button className="btn-bar btn-pwd sans" onClick={()=>setShowPasswordForm(true)}>🔑 Change Password</button>
          <button className="btn-bar btn-logout sans" onClick={logout}>Sign Out</button>
        </div>
      </div>

      {/* BODY */}
      <div className="admin-body">

        {/* STATS */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-num">{pendingReviews.length}</div>
            <div className="stat-lbl sans">Pending Reviews</div>
          </div>
          <div className="stat-card accent-green">
            <div className="stat-icon">✓</div>
            <div className="stat-num">{approvedReviews.length}</div>
            <div className="stat-lbl sans">Approved Reviews</div>
          </div>
          <div className="stat-card accent-amber">
            <div className="stat-icon">📋</div>
            <div className="stat-num">{applications.filter(a=>!a.status||a.status==="New").length}</div>
            <div className="stat-lbl sans">New Applications</div>
          </div>
          <div className="stat-card accent-blue">
            <div className="stat-icon">🗓</div>
            <div className="stat-num">{tours.filter(t=>!t.status||t.status==="New").length}</div>
            <div className="stat-lbl sans">New Tour Requests</div>
          </div>
        </div>

        {/* TABS */}
        <div className="tabs">
          <button className={`tab sans${tab==="reviews"?" active":""}`} onClick={()=>setTab("reviews")}>
            Reviews {pendingReviews.length > 0 && `(${pendingReviews.length} pending)`}
          </button>
          <button className={`tab sans${tab==="applications"?" active":""}`} onClick={()=>setTab("applications")}>
            Applications ({applications.length})
          </button>
          <button className={`tab sans${tab==="tours"?" active":""}`} onClick={()=>setTab("tours")}>
            Tours ({tours.length})
          </button>
        </div>

        {loading ? (
          <div className="empty">Loading...</div>
        ) : (

          <>
            {/* REVIEWS TAB */}
            {tab === "reviews" && (
              <div>
                {/* PENDING */}
                <div className="section-label sans">Pending Approval — {pendingReviews.length}</div>
                {pendingReviews.length === 0 ? (
                  <div className="empty">No pending reviews — all caught up! ✓</div>
                ) : (
                  <div className="cards">
                    {pendingReviews.map(r => (
                      <div key={r.id} className="card">
                        <div className="card-header">
                          <div>
                            <div className="stars">{"★".repeat(r.stars)}{"☆".repeat(5-r.stars)}</div>
                            <div className="card-author">{r.author}</div>
                            <div className="card-meta sans">{r.relation} · {r.date}</div>
                          </div>
                          <span className="badge sans" style={{background:"#FFF8E8",color:"#c9a84c"}}>Pending</span>
                        </div>
                        <p className="card-quote sans">"{r.quote}"</p>
                        <div className="card-actions">
                          <button className="btn-approve sans" onClick={()=>approveReview(r.id)}>✓ Approve</button>
                          <button className="btn-delete sans" onClick={()=>deleteReview(r.id)}>✕ Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* APPROVED */}
                <div className="section-label sans" style={{marginTop:36}}>Approved — {approvedReviews.length}</div>
                {approvedReviews.length === 0 ? (
                  <div className="empty">No approved reviews yet.</div>
                ) : (
                  <div className="cards">
                    {approvedReviews.map(r => (
                      <div key={r.id} className="card">
                        <div className="card-header">
                          <div>
                            <div className="stars">{"★".repeat(r.stars)}{"☆".repeat(5-r.stars)}</div>
                            <div className="card-author">{r.author}</div>
                            <div className="card-meta sans">{r.relation} · {r.date}</div>
                          </div>
                          <span className="badge sans" style={{background:"#E8F5EE",color:"#1a6644"}}>Live ✓</span>
                        </div>
                        <p className="card-quote sans">"{r.quote}"</p>
                        <div className="card-actions">
                          <button className="btn-unapprove sans" onClick={()=>unapproveReview(r.id)}>↩ Unpublish</button>
                          <button className="btn-delete sans" onClick={()=>deleteReview(r.id)}>✕ Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* APPLICATIONS TAB */}
            {tab === "applications" && (
              <div className="app-layout">
                {/* LIST */}
                <div className="cards">
                  {applications.length === 0 ? (
                    <div className="empty">No applications yet.</div>
                  ) : applications.map(a => (
                    <div
                      key={a.id}
                      className={`app-card${selectedApp?.id===a.id?" selected":""}`}
                      onClick={()=>setSelectedApp(a)}
                    >
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                        <div>
                          <div className="app-name">{a.first_name} {a.last_name}</div>
                          <div className="app-pos sans">{a.position}</div>
                          <div className="app-date sans">{new Date(a.created_at).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</div>
                        </div>
                        <span className="badge sans" style={statusColors[a.status||"New"]}>
                          {a.status || "New"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* DETAIL PANEL */}
                <div className="detail-panel">
                  {!selectedApp ? (
                    <p className="no-select sans">← Select an application to view details</p>
                  ) : (
                    <>
                      <div className="detail-title">{selectedApp.first_name} {selectedApp.last_name}</div>
                      <div className="detail-pos sans">{selectedApp.position}</div>
                      <div className="detail-row">
                        <div className="detail-field">
                          <label className="sans">Email</label>
                          <p className="sans">{selectedApp.email}</p>
                        </div>
                        <div className="detail-field">
                          <label className="sans">Phone</label>
                          <p className="sans">{selectedApp.phone}</p>
                        </div>
                        <div className="detail-field">
                          <label className="sans">Address</label>
                          <p className="sans">{selectedApp.address}</p>
                        </div>
                        <div className="detail-field">
                          <label className="sans">Preferred Hours</label>
                          <p className="sans">{selectedApp.hours}</p>
                        </div>
                        <div className="detail-field">
                          <label className="sans">Worked Here Before?</label>
                          <p className="sans">{selectedApp.worked_before}</p>
                        </div>
                        {selectedApp.additional_info && (
                          <div className="detail-field">
                            <label className="sans">Additional Info</label>
                            <p className="sans">{selectedApp.additional_info}</p>
                          </div>
                        )}
                      </div>
                      <div className="detail-actions">
                        <button className="btn-status btn-shortlist sans" onClick={()=>updateAppStatus(selectedApp.id,"Shortlisted")}>✓ Shortlist</button>
                        <button className="btn-status btn-reject sans" onClick={()=>updateAppStatus(selectedApp.id,"Rejected")}>✕ Reject</button>
                        <button className="btn-status btn-del-app sans" onClick={()=>deleteApp(selectedApp.id)}>🗑 Delete Application</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
)}

            {/* TOURS TAB */}
            {tab === "tours" && (
              <div className="app-layout">
                <div className="cards">
                  {tours.length === 0 ? (
                    <div className="empty">No tour requests yet.</div>
                  ) : tours.map(t => (
                    <div
                      key={t.id}
                      className={`app-card${selectedTour?.id===t.id?" selected":""}`}
                      onClick={()=>setSelectedTour(t)}
                    >
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                        <div>
                          <div className="app-name">{t.first_name} {t.last_name}</div>
                          <div className="app-pos sans">{t.tour_date} at {t.tour_time} · {t.tour_type}</div>
                          <div className="app-date sans">{new Date(t.created_at).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</div>
                        </div>
                        <span className="badge sans" style={statusColors[t.status||"New"]}>
                          {t.status || "New"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="detail-panel">
                  {!selectedTour ? (
                    <p className="no-select sans">← Select a tour request to view details</p>
                  ) : (
                    <>
                      <div className="detail-title">{selectedTour.first_name} {selectedTour.last_name}</div>
                      <div className="detail-pos sans">{selectedTour.tour_date} at {selectedTour.tour_time}</div>
                      <div className="detail-row">
                        <div className="detail-field">
                          <label className="sans">Email</label>
                          <p className="sans">{selectedTour.email}</p>
                        </div>
                        <div className="detail-field">
                          <label className="sans">Phone</label>
                          <p className="sans">{selectedTour.phone}</p>
                        </div>
                        <div className="detail-field">
                          <label className="sans">Relationship</label>
                          <p className="sans">{selectedTour.relationship}</p>
                        </div>
                        <div className="detail-field">
                          <label className="sans">Tour Type</label>
                          <p className="sans">{selectedTour.tour_type}</p>
                        </div>
                        {selectedTour.notes && (
                          <div className="detail-field">
                            <label className="sans">Notes</label>
                            <p className="sans">{selectedTour.notes}</p>
                          </div>
                        )}
                        {selectedTour.how_heard && (
                          <div className="detail-field">
                            <label className="sans">How They Heard</label>
                            <p className="sans">{selectedTour.how_heard}</p>
                          </div>
                        )}
                      </div>
                      <div className="detail-actions">
                        <button className="btn-status btn-shortlist sans" onClick={()=>updateTourStatus(selectedTour.id,"Confirmed")}>✓ Confirm Tour</button>
                        <button className="btn-status btn-reject sans" onClick={()=>updateTourStatus(selectedTour.id,"Cancelled")}>✕ Cancel Tour</button>
                        <button className="btn-status btn-del-app sans" onClick={()=>deleteTour(selectedTour.id)}>🗑 Delete Request</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

          </>
        )}
      </div>          
        
      {/* PASSWORD MODAL */}
      {showPasswordForm && (
        <div className="modal-overlay" onClick={()=>setShowPasswordForm(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <h2 className="modal-title">Change Password</h2>
            <label className="lbl sans">New Password</label>
            <input className="inp sans" type="password" placeholder="Min. 8 characters" value={newPassword} onChange={e=>setNewPassword(e.target.value)} />
            <label className="lbl sans">Confirm Password</label>
            <input className="inp sans" type="password" placeholder="Repeat password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} />
            {passwordMsg && <p className="pwd-msg sans" style={{color:passwordMsg.startsWith("✓")?"#1a6644":"#c0392b"}}>{passwordMsg}</p>}
            <div className="modal-actions">
              <button className="btn-cancel sans" onClick={()=>setShowPasswordForm(false)}>Cancel</button>
              <button className="btn-save sans" onClick={changePassword}>Save Password</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
