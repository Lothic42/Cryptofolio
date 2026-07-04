# Système solaire en 3D

Site statique (HTML/CSS/JS, sans build) présentant le système solaire en 3D avec Three.js.

- Distances au Soleil proportionnelles aux distances réelles.
- Tailles des planètes et du Soleil exagérées pour rester visibles (deux échelles séparées, voir `js/config.js`).
- Vitesses orbitales et de rotation calculées à partir des périodes réelles : les ratios entre planètes sont physiquement exacts, avec un multiplicateur de temps réglable (curseur + pause).
- Caméra libre : zoom (molette), rotation (glisser), déplacement (pan).
- Clic sur une planète ou le Soleil pour afficher ses caractéristiques.

Données astronomiques : NASA Planetary Fact Sheet (voir `js/planets.js`).

## Lancer le site en local

Les imports de modules ES nécessitent un serveur HTTP (pas d'ouverture directe du fichier `index.html`) :

```bash
cd solar-system
python3 -m http.server 8000
```

Puis ouvrir `http://localhost:8000/` dans un navigateur.

Three.js est chargé depuis un CDN (jsDelivr) via une *import map* — une connexion internet est nécessaire.
