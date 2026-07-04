// Facteurs d'échelle et réglages ajustables de la simulation.
// Séparés des données astronomiques (planets.js) pour pouvoir les retoucher
// sans jamais toucher aux valeurs factuelles.

// Distances : unités de scène par 10^6 km. Une seule échelle pour toutes les
// planètes -> les distances relatives réelles sont conservées.
// Mercure ~5.79, Vénus ~10.82, Terre ~14.96, Mars ~22.79,
// Jupiter ~77.85, Saturne ~143.2, Uranus ~286.7, Neptune ~451.5
export const DIST_SCALE = 0.1;

// Rayon des planètes : unités de scène par km, appliqué uniformément aux 8
// planètes -> leurs tailles relatives entre elles restent exactes.
export const PLANET_RADIUS_SCALE = 3e-5;

// Rayon du Soleil : échelle SÉPARÉE et bien plus petite que celle des
// planètes. Une échelle unique est mathématiquement impossible ici : au
// facteur des planètes, le Soleil (696 000 km) engloutirait l'orbite de
// Mercure. C'est le compromis standard des visualisations "non à l'échelle"
// du système solaire : distances réelles, tailles exagérées mais cohérentes
// entre elles, sauf le Soleil qui a sa propre échelle réduite pour rester
// visuellement "à sa place" sans écraser la scène.
export const SUN_RADIUS_SCALE = 5e-6;

// Simulation temporelle : jours simulés par seconde réelle.
export const DEFAULT_SIM_DAYS_PER_SECOND = 5;
export const MIN_SIM_DAYS_PER_SECOND = 0;
export const MAX_SIM_DAYS_PER_SECOND = 50;
export const SIM_SPEED_STEP = 0.5;

// Caméra / contrôles.
export const CAMERA_FOV = 50;
export const CAMERA_NEAR = 0.01;
export const CAMERA_FAR = 6000;
export const CAMERA_INITIAL_POSITION = { x: 0, y: 180, z: 420 };
export const CONTROLS_MIN_DISTANCE = 1;
export const CONTROLS_MAX_DISTANCE = 4000;

// Champ d'étoiles.
export const STAR_COUNT = 5000;
export const STAR_FIELD_RADIUS = 3500;
