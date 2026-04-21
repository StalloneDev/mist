"use client";

import { exportStatisticsToExcel, exportStatisticsToPdf } from "@/lib/exportUtils";

export default function ExportButtons({ data, loading }: { data: any, loading?: boolean }) {
    if (loading || !data) return null;

    return (
        <div className="flex flex-wrap items-center gap-3">
            <button
                onClick={() => exportStatisticsToPdf(data)}
                className="group flex justify-center w-full sm:w-auto items-center gap-2 px-5 py-3 sm:py-3.5 rounded-xl font-bold text-xs cursor-pointer transition-all duration-300 transform active:scale-95 bg-white/5 hover:bg-white/10 text-foreground border border-white/10"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                EXPORTER PDF
            </button>
            <button
                onClick={() => exportStatisticsToExcel(data)}
                className="group flex justify-center w-full sm:w-auto items-center gap-2 px-5 py-3 sm:py-3.5 rounded-xl font-black text-xs cursor-pointer transition-all duration-300 transform active:scale-95 border border-blue-500/20 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M7 7h10" /><path d="M7 12h10" /><path d="M7 17h10" /></svg>
                EXPORTER EXCEL
            </button>
        </div>
    );
}
