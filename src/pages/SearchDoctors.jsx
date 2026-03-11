import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const SPECIALIZATIONS = ["All","General Physician","Cardiologist","Dermatologist","Neurologist","Orthopedic","Pediatrician","Psychiatrist","Gynecologist","ENT Specialist","Ophthalmologist","Dentist","Oncologist"];

export default function SearchDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [spec, setSpec] = useState("All");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDocs(collection(db, "doctors"));
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(d => d.specialization);
      setDoctors(data);
      setFiltered(data);
      setLoading(false);
    };
    fetch();
  }, []);

  useEffect(() => {
    let result = doctors;
    if (spec !== "All") result = result.filter(d => d.specialization === spec);
    if (search) result = result.filter(d =>
      d.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, spec, doctors]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');
        * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; margin: 0; padding: 0; }
        .doctor-card { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); transition: all 0.2s; border: 1.5px solid transparent; cursor: pointer; }
        .doctor-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.1); border-color: #99f6e4; }
        .search-input { width: 100%; padding: 14px 20px 14px 48px; border: 1.5px solid #e2e8f0; border-radius: 12px; font-size: 14px; color: #0f172a; background: white; outline: none; transition: all 0.2s; }
        .search-input:focus { border-color: #0d9488; box-shadow: 0 0 0 3px rgba(13,148,136,0.08); }
        .spec-chip { padding: 8px 18px; border-radius: 20px; border: 1.5px solid #e2e8f0; background: white; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; color: #64748b; white-space: nowrap; }
        .spec-chip.active { background: #0d9488; border-color: #0d9488; color: white; }
        .spec-chip:hover:not(.active) { border-color: #0d9488; color: #0d9488; }
        .book-btn { width: 100%; padding: 11px; background: linear-gradient(135deg, #0d9488, #0284c7); color: white; border: none; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; margin-top: 16px; }
        .book-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
        <Navbar />

        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #0d9488 100%)', padding: '40px 48px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <p style={{ color: '#64748b', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
              Consultations
            </p>
            <h1 style={{ fontFamily: 'DM Serif Display', color: 'white', fontSize: 34, fontWeight: 400, marginBottom: 24 }}>
              Find a Doctor
            </h1>

            {/* Search Bar */}
            <div style={{ position: 'relative', maxWidth: 560 }}>
              <svg style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} width="18" height="18" fill="none" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" stroke="#94a3b8" strokeWidth="1.8"/>
                <path d="M20 20l-3-3" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <input className="search-input" placeholder="Search by name or specialization..."
                value={search} onChange={e => setSearch(e.target.value)}/>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 48px' }}>

          {/* Specialization Filter */}
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8, marginBottom: 32 }}>
            {SPECIALIZATIONS.map(s => (
              <button key={s} className={`spec-chip ${spec === s ? 'active' : ''}`}
                onClick={() => setSpec(s)}>{s}</button>
            ))}
          </div>

          {/* Results Count */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <p style={{ fontSize: 14, color: '#64748b' }}>
              {loading ? "Loading..." : `${filtered.length} doctor${filtered.length !== 1 ? 's' : ''} found`}
            </p>
          </div>

          {/* Doctor Cards Grid */}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
              <div style={{ width: 40, height: 40, border: '3px solid #e2e8f0', borderTopColor: '#0d9488', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}/>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: '#f0fdfa', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="7" stroke="#0d9488" strokeWidth="1.5"/>
                  <path d="M20 20l-3-3" stroke="#0d9488" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>No doctors found</p>
              <p style={{ fontSize: 14, color: '#94a3b8' }}>Try a different search or specialization</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {filtered.map(doctor => (
                <div key={doctor.id} className="doctor-card">
                  {/* Doctor Header */}
                  <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                      background: 'linear-gradient(135deg, #0d9488, #0284c7)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 700, fontSize: 20
                    }}>
                      {doctor.fullName?.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 600, color: '#0f172a', fontSize: 15, marginBottom: 2 }}>
                        Dr. {doctor.fullName}
                      </p>
                      <span className="badge" style={{ background: '#f0fdfa', color: '#0d9488' }}>
                        {doctor.specialization}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '14px 0', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
                    {doctor.experience && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p style={{ fontSize: 13, color: '#94a3b8' }}>Experience</p>
                        <p style={{ fontSize: 13, fontWeight: 500, color: '#0f172a' }}>{doctor.experience} years</p>
                      </div>
                    )}
                    {doctor.consultationFee && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p style={{ fontSize: 13, color: '#94a3b8' }}>Consultation fee</p>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#0d9488' }}>₹{doctor.consultationFee}</p>
                      </div>
                    )}
                    {doctor.preferredLanguage && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p style={{ fontSize: 13, color: '#94a3b8' }}>Language</p>
                        <p style={{ fontSize: 13, fontWeight: 500, color: '#0f172a' }}>{doctor.preferredLanguage}</p>
                      </div>
                    )}
                  </div>

                  {doctor.bio && (
                    <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginTop: 12,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {doctor.bio}
                    </p>
                  )}

                  <button className="book-btn" onClick={() => navigate(`/book/${doctor.id}`)}>
                    Book Consultation
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
