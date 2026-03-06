# Todo App — Plan de test Playwright

**URL cible :** http://localhost:5173
**Mode :** mock (aucun backend requis)
**Données initiales :** 5 todos générés par faker (seed fixe = 1), mix de complétés / non complétés

---

## Scénario 1 — Affichage initial

**Objectif :** Vérifier que la page se charge correctement et affiche la liste des todos avec les statistiques.

**Étapes :**
1. Naviguer sur `http://localhost:5173`
2. Attendre la disparition du spinner de chargement
3. Vérifier que le titre `Task Manager` est visible (balise `h1`, classe `text-blue-600`)
4. Vérifier que la ligne de stats est présente sous le titre, au format `X tasks total • Y active • Z completed`
5. Vérifier que 5 items sont listés dans la `<ul>` principale
6. Vérifier que chaque item affiche : un titre, un badge de statut (`To do` ou `Completed`), une icône toggle et une icône de suppression
7. Vérifier que le bloc filtres (`All` / `Active` / `Completed` + champ de recherche + bouton de tri) est visible au-dessus de la liste

**Résultat attendu :**
- 5 todos affichés, le filtre actif est `All` (surligné en bleu)
- Les stats reflètent exactement le nombre de todos complétés et actifs
- Aucun formulaire d'ajout n'est visible

---

## Scénario 2 — Ajout d'un todo (titre obligatoire, description optionnelle)

**Objectif :** Vérifier le flux complet d'ajout d'une tâche via le formulaire.

**Étapes — cas nominal (titre + description) :**
1. Cliquer sur le bouton `New Task` (coin supérieur droit, icône `+`)
2. Vérifier que le formulaire `Add a new task` apparaît sous les filtres
3. Vérifier que le champ `Title*` a le focus automatique
4. Saisir `My new task` dans le champ titre
5. Saisir `Optional description here` dans le textarea description
6. Cliquer sur le bouton `Add Task`
7. Vérifier que le formulaire se ferme
8. Vérifier qu'une notification de succès `Task created successfully` apparaît
9. Vérifier que la liste contient maintenant 6 items et que `My new task` figure dans la liste avec le badge `To do`
10. Vérifier que les stats sont mises à jour (total passe à 6, active + 1)

**Étapes — cas formulaire vide (titre absent) :**
1. Cliquer sur `New Task`
2. Laisser le champ titre vide
3. Vérifier que le bouton `Add Task` est désactivé (`disabled`, classe `bg-blue-300 cursor-not-allowed`)
4. Tenter de soumettre via Entrée : rien ne se passe
5. Cliquer sur `Cancel` — le formulaire se ferme, aucun todo ajouté

**Étapes — soumission via touche Entrée :**
1. Cliquer sur `New Task`
2. Saisir `Task via Enter` dans le champ titre
3. Appuyer sur `Enter` (sans Shift)
4. Vérifier que le todo est créé (même comportement que le clic sur `Add Task`)

**Résultat attendu :**
- Le formulaire ne peut pas être soumis sans titre
- Après soumission réussie, le formulaire se ferme, le todo apparaît en tête ou dans la liste triée, la notification success s'affiche

---

## Scénario 3 — Toggle completion (cocher / décocher)

**Objectif :** Vérifier que le toggle d'un todo bascule son état de completion avec optimistic update.

**Étapes — cocher un todo actif :**
1. Identifier un todo dont le badge affiche `To do` (icône `Square` grise)
2. Cliquer sur l'icône toggle (bouton `aria-label="Mark as complete"`)
3. Vérifier que l'icône change immédiatement en `CheckSquare` bleue (optimistic update)
4. Vérifier que le badge passe de `To do` (jaune) à `Completed` (bleu)
5. Vérifier que le texte du titre passe à la couleur `text-blue-600`
6. Vérifier qu'une notification `Task marked as complete` apparaît
7. Vérifier que les stats sont mises à jour (active -1, completed +1)

**Étapes — décocher un todo complété :**
1. Identifier un todo dont le badge affiche `Completed` (icône `CheckSquare` bleue)
2. Cliquer sur l'icône toggle (bouton `aria-label="Mark as incomplete"`)
3. Vérifier que l'icône repasse en `Square` grise
4. Vérifier que le badge repasse à `To do` (jaune)
5. Vérifier qu'une notification `Task marked as incomplete` apparaît
6. Vérifier que les stats sont mises à jour (active +1, completed -1)

**Résultat attendu :**
- Le changement visuel est immédiat (optimistic update)
- Les stats reflètent le nouvel état
- La notification success appropriée est affichée

---

## Scénario 4 — Suppression d'un todo

**Objectif :** Vérifier la suppression d'un todo avec mise à jour optimiste de la liste.

**Étapes :**
1. Compter le nombre d'items visibles (N)
2. Noter le titre du premier todo dans la liste
3. Cliquer sur l'icône corbeille (`Trash2`, bouton `aria-label="Delete"`) du premier todo
4. Vérifier que le todo disparaît immédiatement de la liste (optimistic update)
5. Vérifier que la liste contient maintenant N-1 items
6. Vérifier que le titre noté n'est plus présent dans la liste
7. Vérifier qu'une notification `Task deleted successfully` apparaît
8. Vérifier que les stats sont mises à jour (total -1, et active ou completed -1 selon l'état du todo supprimé)

**Cas limite — suppression jusqu'à liste vide :**
1. Supprimer tous les todos un par un
2. Vérifier que l'`EmptyState` s'affiche avec le message `No tasks yet` et un lien `Add a task`
3. Cliquer sur `Add a task` — vérifier que le formulaire d'ajout s'ouvre

**Résultat attendu :**
- Suppression immédiate de l'élément
- Notification success
- Stats mises à jour
- EmptyState visible quand la liste est vide

---

## Scénario 5 — Filtre "Active"

**Objectif :** Vérifier que le filtre "Active" n'affiche que les todos non complétés.

**Étapes :**
1. Depuis l'affichage `All` (état initial), noter le nombre de todos `To do`
2. Cliquer sur le bouton `Active` dans la barre de filtres
3. Vérifier que le bouton `Active` est maintenant actif (fond `bg-blue-100`, texte `text-blue-700`)
4. Vérifier que seuls les todos avec le badge `To do` sont affichés
5. Vérifier qu'aucun todo avec le badge `Completed` n'est présent dans la liste
6. Vérifier que le nombre d'items affichés correspond au compteur `active` dans les stats
7. Vérifier que les stats restent inchangées (elles reflètent l'ensemble, pas le filtre)

**Résultat attendu :**
- Seuls les todos non complétés sont listés
- Le bouton `Active` est visuellement sélectionné
- La liste peut être vide si tous les todos sont complétés (affichage `EmptyState` avec message `No tasks yet`)

---

## Scénario 6 — Filtre "Completed"

**Objectif :** Vérifier que le filtre "Completed" n'affiche que les todos complétés.

**Étapes :**
1. Depuis l'affichage `All`, noter le nombre de todos `Completed`
2. Cliquer sur le bouton `Completed` dans la barre de filtres
3. Vérifier que le bouton `Completed` est maintenant actif (fond `bg-blue-100`, texte `text-blue-700`)
4. Vérifier que seuls les todos avec le badge `Completed` sont affichés
5. Vérifier qu'aucun todo avec le badge `To do` n'est présent dans la liste
6. Vérifier que le nombre d'items affichés correspond au compteur `completed` dans les stats

**Résultat attendu :**
- Seuls les todos complétés sont listés
- Le bouton `Completed` est visuellement sélectionné
- La liste peut être vide si aucun todo n'est complété (affichage `EmptyState`)

---

## Scénario 7 — Filtre "All" (réinitialisation)

**Objectif :** Vérifier que le filtre "All" réaffiche tous les todos sans distinction.

**Étapes :**
1. Activer le filtre `Active` ou `Completed`
2. Vérifier qu'un sous-ensemble de todos est affiché
3. Cliquer sur le bouton `All`
4. Vérifier que le bouton `All` est maintenant actif (fond `bg-blue-100`, texte `text-blue-700`)
5. Vérifier que l'intégralité des todos est à nouveau affichée (N items au total)
6. Vérifier que des todos `To do` et `Completed` coexistent dans la liste

**Résultat attendu :**
- Tous les todos sont affichés
- Le bouton `All` est visuellement sélectionné
- Le nombre d'items correspond au total affiché dans les stats

---

## Scénario 8 — Recherche par texte en temps réel

**Objectif :** Vérifier le filtrage dynamique de la liste par titre et description.

**Étapes — recherche positive :**
1. Relever le titre exact d'un des 5 todos (ex. premier mot du titre)
2. Saisir ce mot dans le champ de recherche (icône loupe, placeholder `Search...`)
3. Vérifier que la liste se filtre instantanément (sans clic)
4. Vérifier que tous les items affichés contiennent le terme dans leur titre ou description
5. Vérifier que les items ne contenant pas le terme ont disparu

**Étapes — recherche sans résultat :**
1. Saisir une chaîne impossible (`zzzzz_no_match_xyz`)
2. Vérifier que la liste est vide
3. Vérifier que le message `No results match your search` s'affiche (EmptyState)
4. Vérifier que le lien `Add a task` n'est PAS affiché dans ce cas (comportement du composant EmptyState)

**Étapes — effacer la recherche :**
1. Depuis une recherche active, vider le champ de recherche
2. Vérifier que tous les todos réapparaissent

**Étapes — recherche combinée avec filtre :**
1. Activer le filtre `Active`
2. Saisir un terme dans la recherche
3. Vérifier que seuls les todos actifs correspondant au terme sont affichés

**Résultat attendu :**
- Filtrage instantané sans interaction supplémentaire
- La recherche porte sur le titre ET la description (insensible à la casse)
- EmptyState affiche `No results match your search` quand aucun résultat

---

## Scénario 9 — Tri alphabétique (asc / desc)

**Objectif :** Vérifier que le bouton de tri bascule entre ordre ascendant et descendant.

**Étapes — tri ascendant (état initial) :**
1. Vérifier que l'icône `ArrowUp` est affichée sur le bouton de tri (tri asc actif par défaut)
2. Relever l'ordre des titres dans la liste
3. Vérifier que les titres sont triés alphabétiquement de A à Z (insensible à la casse)

**Étapes — basculer en tri descendant :**
1. Cliquer sur le bouton de tri (icône `ArrowUp`)
2. Vérifier que l'icône change en `ArrowDown`
3. Vérifier que la liste est maintenant triée de Z à A (insensible à la casse)
4. Vérifier que le titre `title` de l'attribut du bouton est `Sort descending`

**Étapes — revenir en tri ascendant :**
1. Cliquer à nouveau sur le bouton de tri (icône `ArrowDown`)
2. Vérifier que l'icône rechange en `ArrowUp`
3. Vérifier que la liste revient en ordre A-Z

**Étapes — tri combiné avec filtre :**
1. Activer le filtre `Completed`
2. Basculer en tri descendant
3. Vérifier que les todos complétés sont triés Z-A

**Résultat attendu :**
- Le tri est appliqué en temps réel sur la liste affichée
- L'icône reflète l'état actuel du tri
- Le tri s'applique après filtrage (filter puis sort)

---

## Scénario 10 — WeatherWidget dans le header

**Objectif :** Vérifier que le widget météo est visible et affiche une température en °C.

**Étapes :**
1. Naviguer sur `http://localhost:5173`
2. Attendre la fin du chargement de la page
3. Localiser le WeatherWidget dans le coin supérieur droit du header (entre les stats et le bouton `New Task`)
4. Vérifier que le widget est visible avec la classe `bg-sky-100 text-sky-700`
5. Vérifier que le widget affiche un emoji météo (un des : ☀️ ⛅ ☁️ 🌧️ 🌦️ ⛈️ ❄️ 🌫️ 🌙 🌡️)
6. Vérifier que la température affichée est un nombre entier suivi de `°C`
7. Vérifier que la valeur correspond à l'une des villes du mock : Paris (14°C), Tokyo (22°C), New York (8°C), Sydney (28°C), Nairobi (24°C), Reykjavik (-2°C), Singapore (32°C), Cairo (35°C)

**Cas d'erreur (optionnel — si le mock échoue) :**
- Le widget affiche `weather` précédé d'un triangle d'avertissement (classe `text-red-400`)

**Pendant le chargement :**
- Le widget affiche `…` (classe `text-gray-400`) pendant la requête initiale

**Résultat attendu :**
- Le widget est toujours présent dans le header
- Après chargement, une température valide en °C est affichée avec un emoji correspondant à l'icône météo retournée par le mock
- Le widget ne bloque pas l'affichage de la liste des todos

---

## Scénario 11 — Sélecteur de langue

**Objectif :** Vérifier que le sélecteur de langue change la langue de toute l'interface.

**Étapes — passer en français :**
1. Localiser le sélecteur de langue dans la barre de filtres (icône Globe + `<select>`)
2. Vérifier que la valeur par défaut est `English` (détection navigateur ou fallback `en`)
3. Sélectionner `Français` dans le dropdown
4. Vérifier que le titre `Task Manager` change en sa traduction française (clé `app.title`)
5. Vérifier que les libellés des boutons filtres changent (`All` → `Tout`, `Active` → `Actifs`, `Completed` → `Terminés`)
6. Vérifier que le bouton `New Task` change de libellé
7. Vérifier que les badges de statut (`To do`, `Completed`) sont traduits

**Étapes — passer en espagnol :**
1. Sélectionner `Español` dans le dropdown
2. Vérifier que les libellés changent à nouveau dans la langue espagnole

**Étapes — revenir en anglais :**
1. Sélectionner `English`
2. Vérifier que les libellés originaux en anglais reviennent

**Résultat attendu :**
- L'intégralité des textes de l'interface est traduite immédiatement sans rechargement de page
- Le choix de langue est persisté dans `localStorage` (i18next-browser-languagedetector)
- Les 3 langues supportées fonctionnent : `en`, `fr`, `es`

---

## Notes d'implémentation Playwright

### Sélecteurs recommandés

| Élément | Sélecteur suggéré |
|---|---|
| Titre principal | `h1` |
| Ligne de stats | `p.text-gray-600` |
| Bouton New Task | `button:has-text("New Task")` |
| Champ recherche | `input[placeholder="Search..."]` |
| Bouton filtre All | `button:has-text("All")` |
| Bouton filtre Active | `button:has-text("Active")` |
| Bouton filtre Completed | `button:has-text("Completed")` |
| Bouton tri | `button[title]` avec icône ArrowUp/ArrowDown |
| Liste des todos | `ul > li` |
| Icône toggle (non complété) | `button[aria-label="Mark as complete"]` |
| Icône toggle (complété) | `button[aria-label="Mark as incomplete"]` |
| Icône suppression | `button[aria-label="Delete"]` |
| Badge statut | `span.rounded-full` |
| WeatherWidget | `div.bg-sky-100` |
| Sélecteur langue | `select` à côté de l'icône Globe |
| Formulaire ajout | `form` visible après clic New Task |
| Champ titre formulaire | `input#title` |
| Champ description formulaire | `textarea#description` |
| Bouton soumettre formulaire | `button[type="submit"]:has-text("Add Task")` |
| Bouton annuler formulaire | `button:has-text("Cancel")` |
| EmptyState | `p:has-text("No tasks yet")` ou `p:has-text("No results")` |
| Notification toast | Conteneur de notification (à identifier selon NotificationToast) |

### Données mock initiales
- 5 todos avec `faker.seed(1)` — titres et descriptions en lorem ipsum
- Mix de `done: true` et `done: false` selon le résultat de `faker.datatype.boolean()`
- Tri initial : ascendant par titre

### Comportement optimistic update
Les mutations (toggle, delete) appliquent le changement localement avant la réponse du mock.
Le mock répond toujours en succès, donc l'état final correspond toujours à l'optimistic update.
