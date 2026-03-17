"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("from") || "/dashboard";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError("Adresse e-mail ou mot de passe invalide.");
            } else {
                router.push(callbackUrl);
                router.refresh();
            }
        } catch (err) {
            setError("Échec de la connexion. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: "#060a12",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-inter), sans-serif",
            padding: "20px",
            position: "relative",
            overflow: "hidden"
        }}>
            {/* Background Decorative Elements */}
            <div style={{
                position: "absolute",
                top: "-10%",
                left: "-10%",
                width: "40%",
                height: "40%",
                background: "radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, transparent 70%)",
                filter: "blur(80px)",
                pointerEvents: "none",
                zIndex: 0
            }} />
            <div style={{
                position: "absolute",
                bottom: "-10%",
                right: "-10%",
                width: "40%",
                height: "40%",
                background: "radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, transparent 70%)",
                filter: "blur(80px)",
                pointerEvents: "none",
                zIndex: 0
            }} />
            <div style={{
                position: "absolute",
                top: "20%",
                right: "10%",
                width: "300px",
                height: "300px",
                background: "radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%)",
                filter: "blur(60px)",
                pointerEvents: "none",
                zIndex: 0
            }} />

            {/* Header / Logo Section */}
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: "40px",
                textAlign: "center",
                position: "relative",
                zIndex: 1
            }}>
                <div style={{
                    width: "72px",
                    height: "72px",
                    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                    borderRadius: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 12px 30px -5px rgba(37, 99, 235, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.1)",
                    marginBottom: "24px",
                    position: "relative"
                }}>
                    {/* Core Glow */}
                    <div style={{
                        position: "absolute",
                        width: "140%",
                        height: "140%",
                        background: "rgba(37, 99, 235, 0.2)",
                        filter: "blur(30px)",
                        borderRadius: "50%",
                        pointerEvents: "none",
                        zIndex: -1
                    }} />

                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                    </svg>
                </div>

                <h1 style={{
                    fontSize: "40px",
                    fontWeight: "900",
                    color: "white",
                    margin: "0 0 4px 0",
                    letterSpacing: "-0.04em",
                    textShadow: "0 2px 10px rgba(0,0,0,0.3)"
                }}>MIST</h1>

                <p style={{
                    fontSize: "11px",
                    fontWeight: "800",
                    color: "#94a3b8",
                    margin: "0",
                    letterSpacing: "0.4em",
                    textTransform: "uppercase",
                    opacity: 0.8
                }}>
                    Market Intelligence & Sales Tracking
                </p>
            </div>

            {/* Login Card */}
            <div style={{
                width: "100%",
                maxWidth: "440px",
                backgroundColor: "rgba(12, 18, 32, 0.7)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "24px",
                padding: "48px",
                boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(255, 255, 255, 0.03)",
                position: "relative",
                zIndex: 1
            }}>

                <div style={{ marginBottom: "32px" }}>
                    <h2 style={{
                        fontSize: "24px",
                        fontWeight: "700",
                        color: "white",
                        margin: "0 0 8px 0",
                        letterSpacing: "-0.02em"
                    }}>Bienvenue</h2>
                    <p style={{
                        fontSize: "14px",
                        color: "#94a3b8",
                        margin: 0
                    }}>Connectez-vous pour accéder au portail SIGA.</p>
                </div>

                {error && (
                    <div style={{
                        marginBottom: "28px",
                        padding: "14px 18px",
                        backgroundColor: "rgba(239, 68, 68, 0.1)",
                        border: "1px solid rgba(239, 68, 68, 0.2)",
                        borderRadius: "14px",
                        color: "#f87171",
                        fontSize: "14px",
                        fontWeight: "500",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px"
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

                    {/* Email Field */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <label style={{
                            fontSize: "12px",
                            fontWeight: "700",
                            color: "#64748b",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em"
                        }}>
                            Adresse Email
                        </label>
                        <div style={{ position: "relative" }}>
                            <div style={{
                                position: "absolute",
                                left: "16px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "#475569",
                                display: "flex",
                                alignItems: "center",
                                pointerEvents: "none",
                                transition: "color 0.2s"
                            }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                </svg>
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{
                                    width: "100%",
                                    height: "54px",
                                    backgroundColor: "rgba(6, 10, 18, 0.4)",
                                    border: "1px solid rgba(255, 255, 255, 0.05)",
                                    borderRadius: "14px",
                                    color: "white",
                                    fontSize: "15px",
                                    padding: "0 18px 0 48px",
                                    outline: "none",
                                    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                                    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)"
                                }}
                                onFocus={(e) => {
                                    e.currentTarget.style.borderColor = "#2563eb";
                                    e.currentTarget.style.backgroundColor = "rgba(6, 10, 18, 0.6)";
                                    e.currentTarget.style.boxShadow = "0 0 0 4px rgba(37, 99, 235, 0.12)";
                                    if (e.currentTarget.previousSibling) {
                                        (e.currentTarget.previousSibling as HTMLElement).style.color = "#2563eb";
                                    }
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.05)";
                                    e.currentTarget.style.backgroundColor = "rgba(6, 10, 18, 0.4)";
                                    e.currentTarget.style.boxShadow = "inset 0 2px 4px rgba(0,0,0,0.05)";
                                    if (e.currentTarget.previousSibling) {
                                        (e.currentTarget.previousSibling as HTMLElement).style.color = "#475569";
                                    }
                                }}
                                placeholder="exemple@mrsholdings.com"
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <div style={{ display: "flex", justifyContent: "between", alignItems: "center" }}>
                            <label style={{
                                fontSize: "12px",
                                fontWeight: "700",
                                color: "#64748b",
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                                flex: 1
                            }}>
                                Mot de passe
                            </label>
                        </div>
                        <div style={{ position: "relative" }}>
                            <div style={{
                                position: "absolute",
                                left: "16px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "#475569",
                                display: "flex",
                                alignItems: "center",
                                pointerEvents: "none",
                                transition: "color 0.2s"
                            }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    width: "100%",
                                    height: "54px",
                                    backgroundColor: "rgba(6, 10, 18, 0.4)",
                                    border: "1px solid rgba(255, 255, 255, 0.05)",
                                    borderRadius: "14px",
                                    color: "white",
                                    fontSize: "15px",
                                    padding: "0 18px 0 48px",
                                    outline: "none",
                                    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                                    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)"
                                }}
                                onFocus={(e) => {
                                    e.currentTarget.style.borderColor = "#2563eb";
                                    e.currentTarget.style.backgroundColor = "rgba(6, 10, 18, 0.6)";
                                    e.currentTarget.style.boxShadow = "0 0 0 4px rgba(37, 99, 235, 0.12)";
                                    if (e.currentTarget.previousSibling) {
                                        (e.currentTarget.previousSibling as HTMLElement).style.color = "#2563eb";
                                    }
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.05)";
                                    e.currentTarget.style.backgroundColor = "rgba(6, 10, 18, 0.4)";
                                    e.currentTarget.style.boxShadow = "inset 0 2px 4px rgba(0,0,0,0.05)";
                                    if (e.currentTarget.previousSibling) {
                                        (e.currentTarget.previousSibling as HTMLElement).style.color = "#475569";
                                    }
                                }}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div style={{ marginTop: "12px" }}>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: "100%",
                                height: "56px",
                                background: loading 
                                    ? "rgba(37, 99, 235, 0.6)" 
                                    : "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                                color: "white",
                                border: "none",
                                borderRadius: "14px",
                                fontSize: "16px",
                                fontWeight: "700",
                                cursor: loading ? "not-allowed" : "pointer",
                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "12px",
                                boxShadow: loading ? "none" : "0 10px 25px -5px rgba(37, 99, 235, 0.4)",
                                position: "relative",
                                overflow: "hidden"
                            }}
                            onMouseOver={(e) => {
                                if (!loading) {
                                    e.currentTarget.style.transform = "translateY(-1px)";
                                    e.currentTarget.style.boxShadow = "0 15px 30px -5px rgba(37, 99, 235, 0.6)";
                                    e.currentTarget.style.filter = "brightness(1.1)";
                                }
                            }}
                            onMouseOut={(e) => {
                                if (!loading) {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(37, 99, 235, 0.4)";
                                    e.currentTarget.style.filter = "none";
                                }
                            }}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
                                        <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                                    </svg>
                                    <span>Vérification...</span>
                                </>
                            ) : "Se connecter au portail"}
                            
                            {/* Decorative shine effect */}
                            <div style={{
                                position: "absolute",
                                top: 0,
                                left: "-100%",
                                width: "50%",
                                height: "100%",
                                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                                transform: "skewX(-25deg)",
                                transition: "left 0.75s ease",
                                pointerEvents: "none"
                            }} />
                        </button>
                        
                        <style dangerouslySetInnerHTML={{ __html: `
                            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                            button:hover div { left: 150% !important; }
                        `}} />
                    </div>
                </form>
            </div>

            {/* Footer */}
            <div style={{
                marginTop: "48px",
                textAlign: "center",
                position: "relative",
                zIndex: 1
            }}>
                <div style={{
                    color: "#64748b",
                    fontSize: "13px",
                    fontWeight: "500",
                    letterSpacing: "0.025em",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                }}>
                    <span>&copy; {new Date().getFullYear()} MIST</span>
                    <span style={{ width: "4px", height: "4px", backgroundColor: "#334155", borderRadius: "50%" }} />
                    <span style={{ color: "#475569" }}>Market Intelligence & Sales Tracking</span>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div style={{ minHeight: "100vh", background: "#060a12" }} />}>
            <LoginForm />
        </Suspense>
    );
}
