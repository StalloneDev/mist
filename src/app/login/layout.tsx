"use client";

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="login-layout-wrapper">
            {children}
            <style jsx global>{`
        .app-shell {
          display: block !important;
        }
        .app-content {
          margin-left: 0 !important;
        }
      `}</style>
        </div>
    );
}
