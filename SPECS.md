# Fantrail — Spécifications du POC

Version 0.3 — 5 octobre 2026 (écrans de la section 9 alignés sur les maquettes, décisions 10 à 15)
Cible : Festival des Templiers (Millau, 15–18 octobre 2026) et Grand Raid de La Réunion / Diagonale des Fous (15–18 octobre 2026).

---

## 1. Objectif

Fantrail est un jeu de pronostics gratuit entre amis sur les courses de trail. Chaque joueur pronostique le classement des élites d'une course, rejoint une ou plusieurs ligues, et se compare à ses amis sur un classement.

Pas d'argent en jeu, pas de cote bookmaker : c'est un jeu de points.

Le POC doit être en ligne et utilisable avant le **jeudi 15 octobre 2026**, date du départ de la Diagonale des Fous, avec deux courses ouvertes aux pronostics.

## 2. Principes du jeu

- Par course, deux champs séparés : élites hommes et élites femmes. Pas de scratch.
- Le joueur pronostique un **top 5 ordonné** par champ.
- Il estime aussi le **temps du vainqueur** de chaque champ.
- Les picks restent privés jusqu'au verrouillage, puis deviennent visibles par les membres de ses ligues.
- Chaque pick rapporte des points selon l'écart entre position pronostiquée et position réelle. Un pick qui finit hors du top 10 rapporte 0.
- Un **multiplicateur outsider** récompense les picks de coureurs moins bien classés à l'index.
- Des bonus récompensent le vainqueur trouvé, le top 3 et le top 5, dans l'ordre ou non, et les positions exactes multiples.
- Ligues : créées par n'importe quel joueur, rejointes par code d'invitation, avec un classement par course et un classement cumulé. Le créateur peut retirer un membre, un membre peut quitter.
- L'admin crée les courses et les fiches coureurs (avec liens ITRA et UTMB) et saisit les résultats. Aucune interface d'administration n'est exposée aux joueurs.

Ce qu'on ne fait pas dans le POC : séries multi-courses, pronostics communautaires, fiches coureurs enrichies, notifications.

## 3. Glossaire

| Terme                 | Définition                                                                                                        |
| --------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Course (`Race`)       | Une épreuve datée : Grand Trail des Templiers 2026, Diagonale des Fous 2026.                                      |
| Champ (`Field`)       | Une course × un sexe : « Templiers – Hommes », « Templiers – Femmes ». C'est l'unité de pronostic et de scoring.  |
| Coureur (`Runner`)    | Un élite inscrit dans un champ, avec son index de référence.                                                      |
| Index                 | Valeur de niveau du coureur, issue de l'UTMB Index (ou ITRA / Betrail à défaut). Sert au multiplicateur outsider. |
| Rang de favori        | Position du coureur dans son champ, trié par index décroissant. 1 = favori.                                       |
| Pronostic (`Picks`)   | Pour un joueur et un champ : un top 5 ordonné + une estimation du temps du vainqueur.                             |
| Résultat (`Result`)   | Classement officiel d'un champ : positions 1 à 10 + temps du vainqueur.                                           |
| Ligue (`League`)      | Groupe de joueurs avec son classement. Publique ou privée.                                                        |
| Verrouillage (`Lock`) | Instant à partir duquel les picks d'un champ ne sont plus modifiables.                                            |

## 4. Règles du jeu

### 4.1 Pronostic

Pour chaque champ ouvert, le joueur soumet :

1. un **top 5 ordonné**, cinq coureurs distincts pris dans la liste des élites du champ ;
2. une **estimation du temps du vainqueur** au format `hh:mm`.

Un pronostic est complet quand les cinq positions et le temps sont renseignés. Un pronostic incomplet peut être sauvegardé mais ne marque aucun point.

Le joueur peut modifier son pronostic autant de fois qu'il veut jusqu'au verrouillage. La date de **dernière finalisation** est conservée : elle sert au départage.

Le nombre de picks est un paramètre de la course (3 ou 5), fixé par l'admin. Le POC utilise 5.

Un seul temps estimé par champ, celui du vainqueur. Un temps par pick est une évolution possible après le POC.

### 4.2 Verrouillage

- Chaque champ a une heure de verrouillage, par défaut l'heure de départ officielle de la course, en heure locale de la course.
- Après verrouillage : picks figés, et visibles par les autres membres des ligues du joueur.
- Avant verrouillage : picks visibles uniquement par leur auteur.

Heures de départ 2026 à confirmer sur les sites organisateurs :

| Champ                         | Départ                     | Fuseau          |
| ----------------------------- | -------------------------- | --------------- |
| Diagonale des Fous H/F        | jeudi 15 octobre, soirée   | UTC+4 (Réunion) |
| Grand Trail des Templiers H/F | dimanche 18 octobre, matin | UTC+2 (Paris)   |

### 4.3 Points de position

Pour chaque pick `i` (1 à 5) dont le coureur finit à la position réelle `p` :

```
si hors du top 10         : 0   (abandon ou arrivée après la 10ᵉ place)
sinon                     : (10 − |i − p|) × poids(i)
poids = [50, 48, 46, 44, 42] pour i = 1..5
```

Points max hors bonus par champ : 2300 (500 + 480 + 460 + 440 + 420).

Exemples : pick 1 qui gagne = 500. Pick 1 qui finit 3e = 400. Pick 5 qui finit 2e = 294. Pick 3 qui finit 11e = 0.

### 4.4 Multiplicateur outsider

Principe voulu : plus le coureur pronostiqué est bas à l'index, plus les points gagnés sont élevés. Un favori qui gagne rapporte le barème de base, un outsider qui gagne rapporte davantage.

Règle proposée, sur le **rang de favori** `r` du coureur dans son champ (1 = meilleur index) :

```
multiplicateur(r) = min(1 + 0.1 × (r − 1), 2.0)
points_pick = points_position × multiplicateur(r)
```

Soit ×1.0 pour le favori, ×1.5 pour le 6e favori, ×2.0 plafonné à partir du 11e favori.

Décisions incluses dans cette règle :

- Le multiplicateur s'applique **uniquement aux points de position**, pas aux bonus ni aux points de temps.
- Il ne peut jamais produire de points négatifs : un outsider qui abandonne rapporte 0, pas une pénalité.
- Les points d'un pick sont arrondis à l'entier le plus proche après application du multiplicateur.
- Le rang est calculé sur l'index **au moment du verrouillage** et figé avec le résultat.
- Un coureur sans index connu a un multiplicateur de 1.0. L'admin peut lui saisir un index à la main.
- On utilise le rang plutôt que la valeur brute de l'index parce que les échelles UTMB (≈ 400–950), ITRA (≈ 300–1000) et Betrail (20–100) ne sont pas comparables entre elles.

Vocabulaire : on parle d'**index** et de **rang de favori**, pas de « cote ». Dans les paris sportifs, une cote basse désigne le favori, ce qui est l'inverse de l'intention ici.

### 4.5 Points de temps

Le joueur estime le temps du vainqueur du champ. Les points dépendent de l'écart relatif au temps réel, pour que la règle soit équitable entre un Templiers à ~7 h et une Diagonale à ~24 h :

```
tolérance = 3 % du temps réel du vainqueur
écart     = |temps estimé − temps réel|
points    = 200 × max(0, 1 − écart / tolérance)
```

Exemples : vainqueur en 24 h 00, tolérance 43 min 12 s. Estimation à 23 h 45 → écart 15 min → 131 points. Estimation à 23 h 30 → écart 30 min → 61 points. Estimation à 25 h 00 → 0 point. Sur un Templiers gagné en 7 h 00, la tolérance est de 12 min 36 s.

La tolérance est un paramètre de la course (3 % par défaut).

### 4.6 Bonus (non multipliés)

| Réussite                    | Points                 |
| --------------------------- | ---------------------- |
| Vainqueur trouvé            | 75                     |
| Top 3 dans le désordre      | 150                    |
| Top 3 dans l'ordre exact    | 300                    |
| Top 5 dans le désordre      | 250                    |
| Top 5 dans l'ordre exact    | 500                    |
| Positions exactes multiples | (nombre d'exacts × 5)² |

Les bonus se cumulent (un top 3 exact donne aussi le top 3 désordre et le vainqueur).

### 4.7 Score et classement

- Score du joueur pour un champ = Σ points de position × multiplicateur + points de temps + bonus. Les points de temps sont arrondis à l'entier le plus proche.
- Score pour une course = somme des deux champs.
- Classement d'une ligue = somme des scores sur les courses sélectionnées par la ligue.
- Égalité : écart de temps cumulé le plus faible, puis date de finalisation la plus ancienne.
- Un joueur sans pronostic sur un champ marque 0 et reste classé.

### 4.8 Résultats et corrections

- Le résultat officiel est celui publié par l'organisateur (LiveTrail pour les deux courses).
- L'admin saisit les positions 1 à 10 de chaque champ et le temps du vainqueur. Les abandons ne sont pas saisis : un coureur absent du top 10 rapporte 0, qu'il ait abandonné ou fini plus loin.
- La publication déclenche le calcul des scores. Une correction (disqualification, erreur de saisie) republie et recalcule tout, avec un historique des versions.

## 5. Comptes

- Inscription par email + mot de passe (décidé le 30 septembre 2026, pas de lien magique pour le POC).
- Pseudo obligatoire, unique, 3 à 20 caractères. C'est ce qui apparaît dans les classements.
- Mot de passe : 8 caractères minimum, avec au moins une lettre, un chiffre et un caractère spécial.
- Deux rôles : `Player` et `Admin`. Le rôle admin est attribué en base, pas d'auto-inscription.
- Suppression de compte : hors POC.
- Un compte désactivé par l'admin ne peut plus se connecter. Il sort du classement Communauté mais reste dans ses ligues, avec ses points.

## 6. Ligues

### 6.1 Types

|                                  | Publique                 | Privée                        |
| -------------------------------- | ------------------------ | ----------------------------- |
| Visible dans la liste des ligues | oui                      | non                           |
| Rejoindre                        | en un clic               | par code d'invitation ou lien |
| Classement visible               | par tout joueur connecté | par les membres               |

### 6.2 Règles

- Le nom est **unique**, insensible à la casse et aux accents, 3 à 40 caractères.
- **Pas de limite de membres** dans le POC. Une limite optionnelle pourra être ajoutée plus tard sans changer le modèle.
- Le créateur est propriétaire. Il peut renommer la ligue, changer sa visibilité, régénérer le code d'invitation, retirer un membre, supprimer la ligue.
- Un membre peut quitter. Le propriétaire ne peut pas quitter sans transférer la propriété (hors POC : il supprime la ligue).
- Une ligue couvre par défaut **toutes les courses ouvertes**. Le choix des courses par ligue est hors POC.
- Un joueur peut appartenir à plusieurs ligues. Ses picks sont les mêmes partout : on pronostique une fois par champ, pas une fois par ligue.
- Une ligue « Communauté » implicite classe tous les joueurs du site.

### 6.3 Code d'invitation

Code court (8 caractères, alphanumérique sans ambiguïté O/0, I/1), régénérable. Lien de la forme `/join/<code>`.

## 7. Administration

Ce que fait l'admin, par ordre d'importance pour le POC :

1. **Courses** : créer, éditer (nom, lieu, distance, D+, date, site, URL LiveTrail), fixer le nombre de picks, passer le statut : `Draft` → `Open` → `Locked` → `Scored`, ou `Cancelled`.
2. **Champs et coureurs** : pour chaque champ, saisir la liste des élites : prénom, nom, nationalité, index, source de l'index, liens ITRA / UTMB. Import CSV pour aller vite. Ajout et retrait possibles jusqu'au verrouillage. Un coureur retiré reste dans les picks qui le contiennent, marqué « retiré », et y rapporte 0 point, comme un abandon. Le pronostic reste complet. Le joueur voit l'alerte sur l'accueil et sur son pronostic et peut le remplacer jusqu'au verrouillage.
3. **Verrouillage** : heure de verrouillage par champ, et bouton de verrouillage manuel immédiat en cas de départ avancé ou retardé.
4. **Résultats** : saisir positions 1 à 10 et temps du vainqueur ; publier ; corriger et republier.
5. **Modération** : renommer ou supprimer une ligue au nom problématique, retirer un membre d'une ligue, désactiver un compte.

Ce que l'admin **ne fait pas** :

- il ne saisit ni ne modifie les picks d'un joueur ;
- il ne gère pas le quotidien des ligues, qui appartiennent à leurs créateurs.

## 8. Données coureurs et index

État des sources, vérifié le 30 septembre 2026 :

| Source                 | Échelle                              | Accès                                                                                                           | Verdict POC                              |
| ---------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| UTMB Index             | ≈ 400–950, par catégorie de distance | pages `utmb.world/runner/<id>` consultables, pas d'API publique documentée, des scrapers tiers existent (Apify) | source de référence, saisie manuelle     |
| ITRA Performance Index | jusqu'à 1000                         | site avec recherche, pas d'API publique                                                                         | secours si pas d'index UTMB              |
| Betrail                | 20–100                               | gratuit, orienté courses francophones                                                                           | secours pour les élites locaux (Réunion) |

Décision POC : **saisie manuelle par l'admin**, via un CSV par champ. Volume : environ 30 élites par champ, soit 120 lignes pour les deux courses. C'est une soirée de travail, et ça évite un scraper à maintenir la semaine de la course.

Les listes d'élites sont publiées avant les courses sur les sites des organisateurs et dans la presse spécialisée. À défaut, prendre les 30 meilleurs index parmi les inscrits.

Après le POC : import automatique depuis les pages UTMB, avec revalidation manuelle.

## 9. Parcours et écrans

Les maquettes de référence sont dans `docs/design/maquettes/` (copie du canevas de design).

### Joueur

Navigation par une barre d'onglets en bas : Accueil, Ligues, Mes scores, Profil. Mobile d'abord, 390 px.

1. **Inscription / connexion**. Le lien `/join/<code>` montre la ligue avant l'inscription, puis la rejoint une fois le compte créé. Cette page n'est pas indexée.
2. **Accueil** : alerte groupée des coureurs retirés de mes picks, cartes des courses, mes ligues avec mon rang. Une carte de course a cinq états :
   - ouverte, prono à faire ou incomplet (`3/5`), avec le compte à rebours avant verrouillage ;
   - ouverte, pronos complets ;
   - verrouillée, course en cours : champs « verrouillé » ou « incomplet · 0 pt », accès aux pronos de mes ligues ;
   - notée : score de la course, score par champ vers la scorecard, rang dans mes ligues ;
   - annulée : carte grisée, les pronos ne rapportent aucun point.
3. **Pronostic d'un champ** : onglets hommes / femmes avec l'état de chaque champ, top 5 sous forme de dossards. Toucher une place ouvre le **choix d'un coureur** (panneau du bas, recherche, tri par index ou par nom, multiplicateur affiché pour chaque coureur, coureurs déjà choisis grisés). Les places se réordonnent par glisser-déposer. Saisie du chrono du vainqueur, puis « Valider mon prono ». Une fois enregistré et complet, le bouton passe à « Prono enregistré » et redevient actif au premier changement. Un coureur retiré s'affiche barré, « retiré · 0 pt », avec « Changer ».
4. **Pronostic verrouillé** : même écran en lecture seule, sans poignées de déplacement, avec un accès aux pronos de mes ligues. La scorecard remplace cet écran une fois le résultat publié.
5. **Ligues** : créer (nom, privée ou publique), rejoindre par code, liste des ligues publiques avec « Rejoindre ». La Communauté apparaît comme une ligue.
6. **Ligue** : classement cumulé et par course, bouton d'invitation avec le code. Après le verrouillage d'un champ, l'onglet de la course montre le top 5 et le chrono de chaque membre, sans points tant que le résultat n'est pas publié. Un membre peut quitter la ligue, après confirmation.
7. **Ligue publique vue par un non-membre** : classement visible, bouton « Rejoindre la ligue ». Ni code d'invitation ni pronos des membres.
8. **Réglages d'une ligue** (propriétaire) : renommer, changer la visibilité, générer un nouveau code (l'ancien ne marche plus), retirer un membre, supprimer la ligue. Les actions destructives demandent une confirmation.
9. **Mes scores** : score par course et par champ, vers la scorecard.
10. **Scorecard** : pour chaque pick, position réelle, points de position, multiplicateur ; puis points de temps et bonus.
11. **Profil** : pseudo, email, page « Comment on marque des points », déconnexion. Pas de statistiques.

### Admin

Back-office séparé, menu latéral Courses, Ligues, Joueurs.

12. **Courses** : liste avec statut, nombre de champs et de coureurs, menu d'actions par course.
13. **Course, onglet Infos** : nom, lieu, fuseau horaire, distance, D+, site officiel, page LiveTrail, nombre de picks (modifiable tant que la course est en brouillon), tolérance du chrono. Une carte Statut montre l'étape courante et l'action suivante : « Ouvrir aux pronos » (chaque champ doit avoir au moins autant de coureurs actifs que de picks), « Verrouiller toute la course », « Marquer notée » (une fois les résultats des deux champs publiés). « Annuler la course » est à part, irréversible.
14. **Course, onglet Champs et start lists** : par champ, heure de départ et heure de verrouillage (heure locale de la course), bouton « Verrouiller maintenant ». Start list triée par rang de favori : nationalité, index, source, liens UTMB et ITRA, coureurs retirés barrés avec « Réintégrer », coureurs sans index signalés.
15. **Fiche coureur** (panneau latéral) : ajout ou modification, et « Retirer de la start list ».
16. **Import CSV** d'une start list : voir la décision 13.
17. **Course, onglet Résultats** : saisie du top 10 et du temps du vainqueur, publication. Une fois publié : la version en ligne, les positions changées par rapport à la version précédente, l'historique des versions et « Corriger ».
18. **Ligues** et **détail d'une ligue** : renommer, supprimer, retirer un membre.
19. **Joueurs** et **détail d'un joueur** : désactiver ou réactiver le compte, pronos en lecture seule, ligues.

## 10. Hors périmètre du POC

- Argent, cagnottes, cotes de bookmaker.
- Scraping automatique des index ou des résultats live.
- Notifications (email, push) hors emails de connexion.
- Séries multi-courses, saison, historique des années précédentes.
- Fiches coureurs, photos, réseaux sociaux.
- Choix des courses par ligue, limite de membres, transfert de propriété.
- Application mobile native, internationalisation. Le site est en français, responsive.
- Statistiques, community picks, commentaires.

## 11. Décisions

Questions tranchées le 30 septembre 2026 (1 à 9) et le 5 octobre 2026 (10 à 15).

| #   | Question                        | Décision                                                                                                                                                                     |
| --- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Top 3 ou top 5                  | Top 5 pour le POC, nombre de picks paramétrable par course.                                                                                                                  |
| 2   | Multiplicateur outsider         | Palier de 0.1 par rang, plafond ×2.0. À rejouer sur les résultats 2025 des deux courses avant l'ouverture.                                                                   |
| 3   | Tolérance de temps              | 3 % du temps du vainqueur.                                                                                                                                                   |
| 4   | Temps estimé                    | Un seul par champ : le temps du vainqueur. Un temps par pick viendra peut-être après le POC.                                                                                 |
| 5   | Ligue publique                  | Rejoignable en un clic, sans validation du propriétaire.                                                                                                                     |
| 6   | Résultats                       | Top 10 saisi par l'admin. Un pick hors top 10 s'affiche « hors top 10 ».                                                                                                     |
| 7   | Fuseau                          | Heure locale du joueur, heure locale de la course en rappel.                                                                                                                 |
| 8   | Coureur retiré de la start list | Le pick est conservé et rapporte 0 point, comme un abandon. Le joueur est averti dans l'interface et peut remplacer le coureur jusqu'au verrouillage.                        |
| 9   | Saisie des abandons             | Supprimée : un coureur hors du top 10 marque 0 dans tous les cas, la saisie n'apporterait qu'un libellé.                                                                     |
| 10  | Compte désactivé                | Il sort du classement Communauté et reste dans ses ligues avec ses points.                                                                                                   |
| 11  | Profil                          | Pas de statistiques (pronos faits, meilleur rang) dans le POC.                                                                                                               |
| 12  | Course annulée                  | Reste visible des joueurs sur l'accueil, grisée. Ses pronos ne rapportent aucun point et elle sort de tous les classements.                                                  |
| 13  | Import CSV                      | Colonnes `prenom;nom;nationalite;index;source;utmb;itra`, séparateur `;` ou `,`, analysé dans le navigateur. Lignes en erreur non importées, coureurs déjà présents ignorés. |
| 14  | Pronos des membres              | Révélés au verrouillage de chaque champ, aux membres de la ligue seulement.                                                                                                  |
| 15  | Historique des résultats        | Chaque publication crée une version datée. L'admin voit les versions et ce qui a changé ; les joueurs ne voient que la dernière.                                             |

Sur le point 8 : vider le pick aurait rendu le pronostic incomplet, et un pronostic incomplet ne marque aucun point (§ 4.1). Un joueur qui ne se reconnecte pas avant le départ aurait perdu tout son pronostic pour un seul forfait. Conserver le pick limite la perte à ce pick.

## 12. Annexe — barème en mode 10 picks

Pour référence si une course passe en top 10 : un pick marque si le coureur finit dans le top 15, avec `(15 − |i − p|) × poids(i)` et `poids = [50, 48, 46, 44, 42, 40, 38, 36, 34, 32]`. Max hors bonus : 6150. Bonus supplémentaire « top 10 dans le désordre » : 500.

Sources :

- UTMB Index, https://utmb.world/utmb-index/info
- ITRA Performance Index, https://itra.run/FAQ/PerformanceIndex
- Festival des Templiers 2026, https://www.festivaldestempliers.com/
- Grand Raid de La Réunion 2026, https://www.grandraid-reunion.com/fr/les-courses/la-diagonale-des-fous/
