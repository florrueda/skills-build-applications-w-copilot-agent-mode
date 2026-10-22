import voz from './voz.json';

export const FPS = 30;
// Frames de respiro antes y después de cada locución
export const LEAD = 10;
export const COLA = 16;

export const ESCENAS = [
  'intro', 'quienes', 'historia', 'escultura', 'mision', 'valores', 'especialidades',
  'numeros', 'pisos', 'trabajo', 'paciente', 'sonrisas', 'capital', 'cierre',
] as const;
export type Clave = (typeof ESCENAS)[number];

export type Palabra = {t: string; ini: number; fin: number};
export const VOZ = voz as Record<Clave, {duracion: number; palabras: Palabra[]}>;

export const duracion = (k: Clave) => Math.ceil(VOZ[k].duracion * FPS) + LEAD + COLA;

export const INICIOS = ESCENAS.reduce<Record<string, number>>((acc, k, i) => {
  acc[k] = i === 0 ? 0 : acc[ESCENAS[i - 1]] + duracion(ESCENAS[i - 1]);
  return acc;
}, {}) as Record<Clave, number>;

export const TOTAL = INICIOS.cierre + duracion('cierre') + 30;

const normalizar = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

// Frame (relativo a la escena) en que Sonri dice la n-ésima palabra que empieza con `texto`
export const enPalabra = (k: Clave, texto: string, n = 0) => {
  const ps = VOZ[k].palabras.filter((p) => normalizar(p.t).startsWith(normalizar(texto)));
  const p = ps[n] ?? ps[ps.length - 1];
  if (!p) throw new Error(`No encuentro "${texto}" en la escena ${k}`);
  return LEAD + Math.round(p.ini * FPS);
};

// Frame de la primera palabra que empieza con `texto` dicha después del frame `tras`
export const enPalabraTras = (k: Clave, texto: string, tras: number) => {
  const p = VOZ[k].palabras.find((w) => LEAD + Math.round(w.ini * FPS) > tras && normalizar(w.t).startsWith(normalizar(texto)));
  if (!p) throw new Error(`No encuentro "${texto}" en la escena ${k} después del frame ${tras}`);
  return LEAD + Math.round(p.ini * FPS);
};
