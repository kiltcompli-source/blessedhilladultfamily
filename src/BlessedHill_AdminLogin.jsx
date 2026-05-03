import { useState } from "react";
import { supabase } from "./supabaseClient";
import logo from "./assets/bwr.png";

export default function BlessedHillAdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!email.trim()) return setError("Please enter your email.");
    if (!password.trim()) return setError("Please enter your password.");
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setError("Invalid email or password. Please try again.");
    onLogin();
  };

  return (
    <div style={{ fontFamily:"'Playfair Display',Georgia,serif", background:"#f7f5f0", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--bd:#1a3a5c;--bm:#2e6da4;--bs:#5b9bd5;--gd:#c9a84c;--br:rgba(30,80,140,0.09);}
        .sans{font-family:'DM Sans',sans-serif}
        .login-card{background:white;border-radius:24px;padding:48px;width:100%;max-width:420px;box-shadow:0 8px 40px rgba(30,80,140,0.12)}
        .login-logo{display:flex;align-items:center;justify-content:center;margin-bottom:32px}
        .login-title{font-size:28px;font-weight:700;color:var(--bd);letter-spacing:-.5px;margin-bottom:6px;text-align:center}
        .login-sub{font-family:'DM Sans',sans-serif;font-size:13px;color:#8a9dae;text-align:center;margin-bottom:32px;letter-spacing:.5px;text-transform:uppercase}
        .lbl{font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;letter-spacing:.8px;text-transform:uppercase;color:#8a9dae;display:block;margin-bottom:7px}
        .inp{width:100%;font-family:'DM Sans',sans-serif;font-size:15px;color:#1a2b3c;background:#fafafa;border:1.5px solid var(--br);border-radius:12px;padding:13px 16px;outline:none;transition:border-color .2s;margin-bottom:18px}
        .inp:focus{border-color:var(--bs)}
        .btn-login{width:100%;background:var(--bd);color:white;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:600;border:none;border-radius:50px;padding:16px;cursor:pointer;transition:background .2s,transform .2s;margin-top:8px}
        .btn-login:hover{background:var(--bm);transform:translateY(-1px)}
        .btn-login:disabled{opacity:.6;cursor:not-allowed;transform:none}
        .err{font-family:'DM Sans',sans-serif;font-size:13px;color:#c0392b;margin-bottom:14px;text-align:center}
        .admin-badge{display:inline-flex;align-items:center;gap:6px;background:#EEF4FB;color:var(--bm);font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;padding:6px 14px;border-radius:50px;margin-bottom:24px}
      `}</style>

      <div className="login-card">
        <div className="login-logo">
          <img src={logo} alt="Blessed Hill" style={{height:"80px", width:"auto"}} />
        </div>
        <h1 className="login-title">Admin Portal</h1>
        <p className="login-sub sans">Blessed Hill Adult Family Home</p>
        <div style={{display:"flex", justifyContent:"center", marginBottom:28}}>
          <span className="admin-badge sans">🔒 Secure Access</span>
        </div>
        <label className="lbl sans">Email</label>
        <input
          className="inp sans"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e=>setEmail(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&login()}
        />
        <label className="lbl sans">Password</label>
        <input
          className="inp sans"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={e=>setPassword(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&login()}
        />
        {error && <p className="err sans">⚠ {error}</p>}
        <button className="btn-login sans" onClick={login} disabled={loading}>
          {loading ? "Signing in..." : "Sign In →"}
        </button>
      </div>
    </div>
  );
}
