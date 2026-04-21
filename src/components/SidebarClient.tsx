"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";

const navItems = [
    {
        name: "Dashboard",
        href: "/dashboard",
        label: "Analytics",
        roles: ["Administrateur", "Directeur commercial", "Commercial", "Manager"],
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
        )
    },
    {
        name: "Fiche Terrain",
        href: "/visites/nouvelle",
        label: "Nouvelle saisie",
        roles: ["Administrateur", "Directeur commercial", "Manager", "Commercial"],
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z" /></svg>
        )
    },
    {
        name: "Reporting",
        href: "/reporting",
        label: "Import Excel",
        roles: ["Administrateur", "Directeur commercial", "Manager"],
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
        )
    },
    {
        name: "Statistiques",
        href: "/statistiques",
        label: "Analyses & Graphiques",
        roles: ["Administrateur", "Directeur commercial", "Manager"],
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
        )
    },
    {
        name: "Entreprises",
        href: "/entreprises",
        label: "CRM Clients",
        roles: ["Administrateur", "Directeur commercial", "Commercial", "Manager"],
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /><path d="M10 6h4" /><path d="M10 10h4" /><path d="M10 14h4" /><path d="M10 18h4" /></svg>
        )
    },
    {
        name: "Mes Actions",
        href: "/actions",
        label: "Suivi Commercial",
        roles: ["Administrateur", "Directeur commercial", "Commercial", "Manager"],
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" /><polyline points="9 11 12 14 22 4" /></svg>
        )
    },
    {
        name: "Utilisateurs",
        href: "/profile",
        label: "Administration",
        roles: ["Administrateur", "Directeur commercial"],
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
        )
    },
];

export default function SidebarClient({ session }: { session: any }) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    // Close drawer when route changes
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [mobileOpen]);

    if (pathname === "/" || pathname === "/login") return null;

    const userRole: string = session?.user?.role || "";
    const initials = session?.user?.name
        ? session.user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
        : 'US';

    const visibleItems = navItems.filter(item => item.roles.includes(userRole));

    const SidebarContent = () => (
        <>
            <div className="sidebar-glow" />

            <div className="sidebar-brand">
                <div className="flex items-center gap-3">
                    <div className="brand-logo">M</div>
                    <div className="brand-text">
                        <span className="brand-name">MIST</span>
                        <span className="brand-tagline">Intelligence System</span>
                    </div>
                </div>
                {/* Close button - mobile only */}
                <button
                    onClick={() => setMobileOpen(false)}
                    className="lg:hidden ml-auto p-2 rounded-xl text-muted hover:text-foreground hover:bg-surface-2 transition-all"
                    aria-label="Fermer le menu"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-section-label">Navigation</div>
                {visibleItems.map((item) => {
                    const isActive = item.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`nav-item ${isActive ? "nav-item-active" : ""}`}
                        >
                            {isActive && <span className="nav-active-bar" />}
                            <span className="nav-icon">{item.icon}</span>
                            <div className="nav-text">
                                <span className="nav-name">{item.name}</span>
                                <span className="nav-label">{item.label}</span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="sidebar-footer">
                <div className="footer-divider" />
                <Link href="/profile" className="user-card hover:bg-surface-2 transition-colors cursor-pointer group border border-border">
                    <div className="user-avatar">{initials}</div>
                    <div className="user-info">
                        <div className="user-name truncate w-32">{session?.user?.name || "Utilisateur"}</div>
                        <div className="user-role truncate w-32">{session?.user?.role || "Connecté"}</div>
                    </div>
                    <button
                        onClick={(e) => { e.preventDefault(); signOut({ callbackUrl: "/login" }); }}
                        className="user-chevron opacity-40 group-hover:opacity-100 hover:text-red-500 transition-all ml-auto"
                        title="Se déconnecter"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                    </button>
                </Link>
            </div>
        </>
    );

    return (
        <>
            {/* ── MOBILE TOPBAR ── */}
            <header className="mobile-topbar flex items-center justify-between lg:hidden">
                <div className="flex items-center gap-3">
                    <div className="brand-logo" style={{ width: 32, height: 32, fontSize: "0.9rem" }}>M</div>
                    <span className="brand-name text-base">MIST</span>
                </div>
                <button
                    onClick={() => setMobileOpen(true)}
                    className="mobile-hamburger"
                    aria-label="Ouvrir le menu"
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>
            </header>

            {/* ── DESKTOP SIDEBAR ── */}
            <aside className="sidebar-fixed flex-col hidden lg:flex">
                <SidebarContent />
            </aside>

            {/* ── MOBILE OVERLAY ── */}
            {mobileOpen && (
                <div
                    className="mobile-overlay lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* ── MOBILE DRAWER ── */}
            <aside className={`mobile-drawer flex-col lg:hidden ${mobileOpen ? "mobile-drawer-open" : ""}`}>
                <SidebarContent />
            </aside>
        </>
    );
}
