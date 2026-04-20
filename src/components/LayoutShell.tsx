"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function LayoutShell({ children, sidebar }: { children: ReactNode; sidebar: ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/login";

    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <div className="app-shell">
            {sidebar}
            <main className="app-content">
                {children}
            </main>
        </div>
    );
}
