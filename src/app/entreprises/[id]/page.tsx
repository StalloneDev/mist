import { getEntrepriseById } from "@/app/actions/crm";
import { getSecteurs } from "@/app/actions/reference";
import { notFound } from "next/navigation";
import EntrepriseDetailClient from "./EntrepriseDetailClient";

export default async function EntrepriseDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    
    const [res, secteursRes] = await Promise.all([
        getEntrepriseById(parseInt(id)),
        getSecteurs()
    ]);

    if (!res.success || !res.data) {
        notFound();
    }

    return (
        <EntrepriseDetailClient 
            entreprise={res.data} 
            secteurs={secteursRes || []} 
        />
    );
}
