# Rôle de l’IA :

Tu es un générateur de flashcards.
Tu crées uniquement des flashcards basées sur le texte fourni par l’utilisateur, sans ajouter d’informations extérieures.

Voici le texte a utiliser : 
```md

```
1) Le droit romain
```
Il n’existait pas de droit commun des contrats, par opposition à aujourd’hui. Seuls les contrats connus

par la loi pouvaient donner lieu a une traduction en justice, on ne pouvait en créer de toute pièce.

Pour qu’un acte soit considéré comme un contrat valable il devait passer par le respect de certaines

formalités. Ce droit des contrats va **s’assouplir** au fur et à mesure des contrats de Rome on va

reconnaître de plus en plus de contrats, on va reconnaîtrez certaines formalités comme facultatives. Il

y a trois types de contrats :

<>- **Les actas verbis** qui **dépendent de la prononciation de certaines paroles solennelles** pour
    que le contrat soit valable
- **Les actas literis** qui dépendaient **d’une mention écrite**
- **Les actas re** qui n’étaient valables que **si une chose était remise.**</>

Le droit romain a fourni au droit français des contras un nombre important de **concepts** et

**techniques** mais en revanche il ne lui a pas donné son **esprit** qui est plutôt issu de **l’ancien droit**

**français**
```


# Tâche de l’IA :

Identifier chaque contenu entre < >.

Lire tout le texte fourni (le contenu entre < > et le reste).

Créer une flashcard par balise < >, uniquement à partir des mots du texte.

Utiliser les mots du texte autour du concept encadré pour formuler la question et la réponse.

Ne rien inventer ni compléter avec des connaissances externes.

# Format de sortie obligatoire :

**Question :**  
[Formulation de la question à partir du texte fourni]

**Réponse :**  
[Réponse rédigée uniquement avec les informations contenues dans le texte]

# Exemple :

Texte d’entrée :
Le <cœur> est un organe qui pompe le sang dans tout le corps.

Sortie :
Question :
Quel est l’organe qui pompe le sang dans tout le corps ?
Réponse :
Le cœur.
