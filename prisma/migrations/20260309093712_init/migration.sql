-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "nom" VARCHAR(100) NOT NULL,
    "prenom" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "telephone" VARCHAR(20),
    "role" VARCHAR(50) NOT NULL,
    "zone" VARCHAR(100),
    "password_hash" VARCHAR(255) NOT NULL,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entreprise" (
    "id" SERIAL NOT NULL,
    "raison_sociale" VARCHAR(300) NOT NULL,
    "secteur_id" INTEGER NOT NULL,
    "secteur_autre" VARCHAR(100),
    "ville" VARCHAR(100),
    "adresse" TEXT,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Entreprise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Secteur" (
    "id" SERIAL NOT NULL,
    "nom" VARCHAR(100) NOT NULL,

    CONSTRAINT "Secteur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "entreprise_id" INTEGER NOT NULL,
    "nom" VARCHAR(150) NOT NULL,
    "fonction" VARCHAR(100),
    "telephone" VARCHAR(20),
    "email" VARCHAR(150),

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visite" (
    "id" SERIAL NOT NULL,
    "date_visite" DATE NOT NULL,
    "commercial_id" INTEGER NOT NULL,
    "entreprise_id" INTEGER NOT NULL,
    "type_collecte_id" INTEGER NOT NULL,
    "localisation_site" VARCHAR(200),
    "contact_id" INTEGER,
    "observations" TEXT,
    "mois_visite" VARCHAR(7),

    CONSTRAINT "Visite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TypeCollecte" (
    "id" SERIAL NOT NULL,
    "nom" VARCHAR(100) NOT NULL,

    CONSTRAINT "TypeCollecte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Projet" (
    "id" SERIAL NOT NULL,
    "visite_id" INTEGER NOT NULL,
    "activite" VARCHAR(100),
    "description" TEXT,
    "date_debut" DATE,
    "date_fin_estimee" DATE,
    "statut_projet_id" INTEGER,
    "periode_projet" VARCHAR(100),
    "taille_projet_id" INTEGER,

    CONSTRAINT "Projet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatutProjet" (
    "id" SERIAL NOT NULL,
    "nom" VARCHAR(100) NOT NULL,

    CONSTRAINT "StatutProjet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TailleProjet" (
    "id" SERIAL NOT NULL,
    "nom" VARCHAR(100) NOT NULL,

    CONSTRAINT "TailleProjet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipement" (
    "id" SERIAL NOT NULL,
    "nom" VARCHAR(100) NOT NULL,

    CONSTRAINT "Equipement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjetEquipement" (
    "id" SERIAL NOT NULL,
    "projet_id" INTEGER NOT NULL,
    "equipement_id" INTEGER NOT NULL,
    "nombre" INTEGER,
    "heures_moy_jour" INTEGER,

    CONSTRAINT "ProjetEquipement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Produit" (
    "id" SERIAL NOT NULL,
    "nom" VARCHAR(100) NOT NULL,

    CONSTRAINT "Produit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consommation" (
    "id" SERIAL NOT NULL,
    "projet_id" INTEGER NOT NULL,
    "produit_id" INTEGER NOT NULL,
    "conso_jour" DECIMAL(10,2),
    "conso_semaine" DECIMAL(10,2),
    "conso_mois" DECIMAL(10,2),
    "conso_mensuelle_estimee" DECIMAL(10,2),

    CONSTRAINT "Consommation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModeApprovisionnement" (
    "id" SERIAL NOT NULL,
    "nom" VARCHAR(100) NOT NULL,

    CONSTRAINT "ModeApprovisionnement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fournisseur" (
    "id" SERIAL NOT NULL,
    "nom" VARCHAR(100) NOT NULL,
    "telephone" VARCHAR(20),
    "adresse" TEXT,

    CONSTRAINT "Fournisseur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjetFournisseur" (
    "id" SERIAL NOT NULL,
    "projet_id" INTEGER NOT NULL,
    "fournisseur_principal_id" INTEGER,
    "fournisseur_secondaire_id" INTEGER,
    "type_relation_id" INTEGER,
    "satisfaction_id" INTEGER,

    CONSTRAINT "ProjetFournisseur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TypeRelation" (
    "id" SERIAL NOT NULL,
    "nom" VARCHAR(100) NOT NULL,

    CONSTRAINT "TypeRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Satisfaction" (
    "id" SERIAL NOT NULL,
    "nom" VARCHAR(100) NOT NULL,

    CONSTRAINT "Satisfaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Opportunite" (
    "id" SERIAL NOT NULL,
    "projet_id" INTEGER NOT NULL,
    "niveau_id" INTEGER,
    "decideur_identifie" BOOLEAN NOT NULL DEFAULT false,
    "decideur_nom" VARCHAR(200),
    "fenetre_entree_id" INTEGER,
    "volume_potentiel" DECIMAL(12,2),
    "priorite_id" INTEGER,

    CONSTRAINT "Opportunite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NiveauOpportunite" (
    "id" SERIAL NOT NULL,
    "nom" VARCHAR(100) NOT NULL,

    CONSTRAINT "NiveauOpportunite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FenetreEntree" (
    "id" SERIAL NOT NULL,
    "nom" VARCHAR(100) NOT NULL,

    CONSTRAINT "FenetreEntree_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Priorite" (
    "id" SERIAL NOT NULL,
    "nom" VARCHAR(100) NOT NULL,

    CONSTRAINT "Priorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActionCommerciale" (
    "id" SERIAL NOT NULL,
    "opportunite_id" INTEGER NOT NULL,
    "type_action_id" INTEGER NOT NULL,
    "date_action" DATE,
    "statut" VARCHAR(30) NOT NULL DEFAULT 'A_FAIRE',
    "commentaire" TEXT,

    CONSTRAINT "ActionCommerciale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TypeAction" (
    "id" SERIAL NOT NULL,
    "nom" VARCHAR(100) NOT NULL,

    CONSTRAINT "TypeAction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Entreprise" ADD CONSTRAINT "Entreprise_secteur_id_fkey" FOREIGN KEY ("secteur_id") REFERENCES "Secteur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_entreprise_id_fkey" FOREIGN KEY ("entreprise_id") REFERENCES "Entreprise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visite" ADD CONSTRAINT "Visite_commercial_id_fkey" FOREIGN KEY ("commercial_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visite" ADD CONSTRAINT "Visite_entreprise_id_fkey" FOREIGN KEY ("entreprise_id") REFERENCES "Entreprise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visite" ADD CONSTRAINT "Visite_type_collecte_id_fkey" FOREIGN KEY ("type_collecte_id") REFERENCES "TypeCollecte"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visite" ADD CONSTRAINT "Visite_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Projet" ADD CONSTRAINT "Projet_visite_id_fkey" FOREIGN KEY ("visite_id") REFERENCES "Visite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Projet" ADD CONSTRAINT "Projet_statut_projet_id_fkey" FOREIGN KEY ("statut_projet_id") REFERENCES "StatutProjet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Projet" ADD CONSTRAINT "Projet_taille_projet_id_fkey" FOREIGN KEY ("taille_projet_id") REFERENCES "TailleProjet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjetEquipement" ADD CONSTRAINT "ProjetEquipement_projet_id_fkey" FOREIGN KEY ("projet_id") REFERENCES "Projet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjetEquipement" ADD CONSTRAINT "ProjetEquipement_equipement_id_fkey" FOREIGN KEY ("equipement_id") REFERENCES "Equipement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consommation" ADD CONSTRAINT "Consommation_projet_id_fkey" FOREIGN KEY ("projet_id") REFERENCES "Projet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consommation" ADD CONSTRAINT "Consommation_produit_id_fkey" FOREIGN KEY ("produit_id") REFERENCES "Produit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjetFournisseur" ADD CONSTRAINT "ProjetFournisseur_projet_id_fkey" FOREIGN KEY ("projet_id") REFERENCES "Projet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjetFournisseur" ADD CONSTRAINT "ProjetFournisseur_fournisseur_principal_id_fkey" FOREIGN KEY ("fournisseur_principal_id") REFERENCES "Fournisseur"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjetFournisseur" ADD CONSTRAINT "ProjetFournisseur_fournisseur_secondaire_id_fkey" FOREIGN KEY ("fournisseur_secondaire_id") REFERENCES "Fournisseur"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjetFournisseur" ADD CONSTRAINT "ProjetFournisseur_type_relation_id_fkey" FOREIGN KEY ("type_relation_id") REFERENCES "TypeRelation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjetFournisseur" ADD CONSTRAINT "ProjetFournisseur_satisfaction_id_fkey" FOREIGN KEY ("satisfaction_id") REFERENCES "Satisfaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opportunite" ADD CONSTRAINT "Opportunite_projet_id_fkey" FOREIGN KEY ("projet_id") REFERENCES "Projet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opportunite" ADD CONSTRAINT "Opportunite_niveau_id_fkey" FOREIGN KEY ("niveau_id") REFERENCES "NiveauOpportunite"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opportunite" ADD CONSTRAINT "Opportunite_fenetre_entree_id_fkey" FOREIGN KEY ("fenetre_entree_id") REFERENCES "FenetreEntree"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opportunite" ADD CONSTRAINT "Opportunite_priorite_id_fkey" FOREIGN KEY ("priorite_id") REFERENCES "Priorite"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionCommerciale" ADD CONSTRAINT "ActionCommerciale_opportunite_id_fkey" FOREIGN KEY ("opportunite_id") REFERENCES "Opportunite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionCommerciale" ADD CONSTRAINT "ActionCommerciale_type_action_id_fkey" FOREIGN KEY ("type_action_id") REFERENCES "TypeAction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
