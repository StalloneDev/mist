"use client";

import { exportSectorToExcel } from "@/lib/exportUtils";

export default function ExportSectorButton({ sectorName, details }: { sectorName: string, details: any[] }) {
    return (
        <button
            onClick={() => exportSectorToExcel(sectorName, details)}
            disabled={details.length === 0}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 hover:bg-blue-500 hover:text-white transition-all font-black text-xs uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed group active:scale-95 shadow-lg"
        >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:-translate-y-1 transition-transform"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M7 7h10" /><path d="M7 12h10" /><path d="M7 17h10" /></svg>
            EXPORTER EXCEL
        </button>
    );
}
