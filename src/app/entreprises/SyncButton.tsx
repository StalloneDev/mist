"use client";

import { useState } from "react";
import { syncEntreprisesFromReporting } from "@/app/actions/crm";
import { useRouter } from "next/navigation";

export default function SyncButton() {
    const [isSyncing, setIsSyncing] = useState(false);
    const router = useRouter();

    const handleSync = async () => {
        if (!confirm("Voulez-vous synchroniser les entreprises depuis le tableau de reporting ? (Seules les nouvelles entreprises seront ajoutées)")) return;
        
        setIsSyncing(true);
        try {
            const res = await syncEntreprisesFromReporting();
            if (res.success) {
                alert(`${res.count} nouvelles entreprises synchronisées !`);
                router.refresh();
            } else {
                alert("Erreur: " + res.error);
            }
        } catch (error) {
            console.error(error);
            alert("Une erreur est survenue lors de la synchronisation");
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <button 
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black hover:bg-blue-500/20 transition-all font-bold disabled:opacity-50"
        >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={isSyncing ? "animate-spin" : ""}>
                <path d="M21 12a9 9 0 0 1-9 9 9 9 0 0 1-9-9 9 9 0 0 1 9-9 9 9 0 0 1 6.91 3.22L21 8M21 3v5h-5" />
            </svg>
            {isSyncing ? "Synchronisation..." : "Synchroniser Reporting"}
        </button>
    );
}
