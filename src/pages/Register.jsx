import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "patient", language: "English" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(user, { displayName: form.name });
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid, email: form.email, displayName: form.name,
        role: form.role, preferredLanguage: form.language, createdAt: serverTimestamp()
      });
      if (form.role === "patient") {
        await setDoc(doc(db, "patients", user.uid), { userId: user.uid, fullName: form.name, email: form.email, createdAt: serverTimestamp() });
        navigate("/patient-dashboard");
      } else {
        await setDoc(doc(db, "doctors", user.uid), { userId: user.uid, fullName: form.name, email: form.email, createdAt: serverTimestamp() });
        navigate("/doctor-dashboard");
      }
      toast.success("Account created successfully");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") toast.error("Email already registered");
      else toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');
        * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; margin: 0; padding: 0; }
        .input-field { width: 100%; padding: 13px 16px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 14px; color: #0f172a; background: #f8fafc; outline: none; transition: all 0.2s; appearance: none; }
        .input-field:focus { border-color: #0d9488; background: white; box-shadow: 0 0 0 3px rgba(13,148,136,0.08); }
        .primary-btn { width: 100%; padding: 13px; background: linear-gradient(135deg, #0d9488, #0284c7); color: white; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .primary-btn:hover { opacity: 0.92; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(13,148,136,0.3); }
        .primary-btn:disabled { opacity: 0.6; transform: none; }
        .role-card { flex: 1; padding: 16px; border: 1.5px solid #e2e8f0; border-radius: 10px; cursor: pointer; transition: all 0.2s; background: #f8fafc; text-align: center; }
        .role-card.active { border-color: #0d9488; background: #f0fdfa; }
        label { font-size: 13px; font-weight: 500; color: #374151; display: block; margin-bottom: 6px; }
      `}</style>

      <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>

        {/* Left Panel */}
        <div style={{
          background: 'linear-gradient(160deg, #0f172a 0%, #1e3a5f 50%, #0d9488 100%)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '60px', position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(13,148,136,0.12)' }}/>
          <div style={{ position: 'absolute', bottom: -60, left: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(2,132,199,0.1)' }}/>

          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 64 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #0d9488, #0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path d="M12 6v4M12 14v4M8 12H4M20 12h-4" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p style={{ fontFamily: 'DM Serif Display', color: 'white', fontSize: 20 }}>TeleMed Connect</p>
                <p style={{ color: '#64748b', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Healthcare Platform</p>
              </div>
            </div>

            <h2 style={{ fontFamily: 'DM Serif Display', color: 'white', fontSize: 42, fontWeight: 400, lineHeight: 1.2, marginBottom: 20 }}>
              Your health,<br/>your way.
            </h2>
            <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.7 }}>
              Join thousands of patients and doctors who trust TeleMed Connect for seamless, modern healthcare.
            </p>

            <div style={{ marginTop: 48, padding: 24, background: 'rgba(255,255,255,0.05)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)' }}>
              <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.7, fontStyle: 'italic' }}>
                "TeleMed Connect has completely changed how I manage my patients. The interface is clean, fast, and genuinely useful."
              </p>
              <p style={{ color: '#64748b', fontSize: 13, marginTop: 12 }}>— Dr. Rajesh Kumar, Cardiologist</p>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px', background: '#f8fafc', overflowY: 'auto' }}>
          <div style={{ width: '100%', maxWidth: 420 }}>
            <h1 style={{ fontFamily: 'DM Serif Display', fontSize: 32, color: '#0f172a', marginBottom: 8 }}>
              Create your account
            </h1>
            <p style={{ color: '#64748b', fontSize: 14, marginBottom: 36 }}>
              Get started in less than 2 minutes
            </p>

            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Role Selection */}
              <div>
                <label>I am a</label>
                <div style={{ display: 'flex', gap: 12 }}>
                  {['patient', 'doctor'].map(r => (
                    <div key={r} className={`role-card ${form.role === r ? 'active' : ''}`}
                      onClick={() => setForm({ ...form, role: r })}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: form.role === r ? '#0d9488' : '#374151', textTransform: 'capitalize' }}>{r}</p>
                      <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                        {r === 'patient' ? 'Book consultations' : 'Manage patients'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label>Full name</label>
                <input className="input-field" name="name" placeholder="Sneha Pillai"
                  value={form.name} onChange={handle} required/>
              </div>

              <div>
                <label>Email address</label>
                <input className="input-field" name="email" type="email" placeholder="you@example.com"
                  value={form.email} onChange={handle} required/>
              </div>

              <div>
                <label>Password</label>
                <input className="input-field" name="password" type="password" placeholder="Minimum 6 characters"
                  value={form.password} onChange={handle} required/>
              </div>

              <div>
                <label>Preferred language</label>
                <select className="input-field" name="language" value={form.language} onChange={handle}>
                  {['English','Hindi','Marathi','Tamil','Telugu','Kannada','Bengali','Gujarati'].map(l => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </div>

              <button className="primary-btn" type="submit" disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: 14, color: '#64748b', marginTop: 28 }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: '#0d9488', fontWeight: 600, textDecoration: 'none' }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}