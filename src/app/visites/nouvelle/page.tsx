import FormulaireVisite from "./components/form";
import {
    getSecteurs,
    getTypesCollecte,
    getStatutsProjet,
    getTaillesProjet,
    getEquipements,
    getProduits,
    getFournisseurs,
    getTypesRelation,
    getSatisfactions,
    getNiveauxOpportunite,
    getFenetresEntree,
    getPriorites,
    getTypesAction,
} from "../../actions/reference";

export default async function NouvelleVisitePage() {
    const references = {
        secteurs: await getSecteurs(),
        typesCollecte: await getTypesCollecte(),
        statutsProjet: await getStatutsProjet(),
        taillesProjet: await getTaillesProjet(),
        equipements: await getEquipements(),
        produits: await getProduits(),
        fournisseurs: await getFournisseurs(),
        typesRelation: await getTypesRelation(),
        satisfactions: await getSatisfactions(),
        niveauxOpportunite: await getNiveauxOpportunite(),
        fenetresEntree: await getFenetresEntree(),
        priorites: await getPriorites(),
        typesAction: await getTypesAction(),
    };

    return (
        <main style={{ padding: '2rem', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
            <FormulaireVisite references={references} />
        </main>
    );
}
