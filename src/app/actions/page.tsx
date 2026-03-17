import { getSuivisActions } from "@/app/actions/crm";
import { getCommerciaux } from "@/app/actions/reference";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import ActionsListClient from "./ActionsListClient";

export default async function ActionsPage() {
    const session = await auth();
    if (!session) redirect("/login");

    const { success, data: actions } = await getSuivisActions();
    const commerciaux = await getCommerciaux();

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">Historique Global des Actions</h1>
                    <p className="text-slate-400 mt-1 text-sm uppercase tracking-[0.2em] font-bold opacity-60">
                        Suivi opérationnel de l&apos;activité commerciale
                    </p>
                </div>
                <Link 
                    href="/actions/nouvelle" 
                    className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary text-white font-black hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:-translate-y-1"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M12 5v14M5 12h14" /></svg>
                    Nouvelle Action
                </Link>
            </div>

            <ActionsListClient 
                initialActions={actions || []} 
                commerciaux={commerciaux}
                currentUserId={parseInt(session.user?.id)}
            />
        </div>
    );
}
