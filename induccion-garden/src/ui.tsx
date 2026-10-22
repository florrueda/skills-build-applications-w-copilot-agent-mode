import {loadFont} from '@remotion/fonts';
import React from 'react';
import {Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

export const fontFamily = 'Jost';
['400', '500', '600', '700', '800'].forEach((weight) =>
  loadFont({family: fontFamily, url: staticFile(`fonts/jost-latin-${weight}-normal.woff2`), weight}),
);

export const C = {
  verdeOscuro: '#1E6B34',
  verde: '#2E8B45',
  oliva: '#8FAA48',
  lima: '#B5CC5A',
  sombra: '#A9C77A',
  gris: '#EDEDEA',
  texto: '#3A3A3A',
  teal: '#6FBDC8',
  verdeClaro: '#A9DC95',
};

// Escala de entrada con rebote, arrancando en `desde` (frames de la escena)
export const usePop = (desde: number, damping = 11) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: f - desde, fps, config: {damping, stiffness: 140, mass: 0.8}});
};

export const Pop: React.FC<{
  desde: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
  desdeY?: number;
}> = ({desde, style, children, desdeY = 60}) => {
  const p = usePop(desde);
  return (
    <div
      style={{
        opacity: Math.min(1, p * 1.5),
        transform: `translateY(${(1 - p) * desdeY}px) scale(${0.6 + 0.4 * p})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Titulo: React.FC<{children: React.ReactNode; size?: number; style?: React.CSSProperties}> = ({
  children,
  size = 96,
  style,
}) => (
  <div
    style={{
      fontFamily,
      fontWeight: 800,
      fontSize: size,
      lineHeight: 1.05,
      color: C.verdeOscuro,
      textShadow: `4px 4px 0 ${C.sombra}`,
      textAlign: 'center',
      letterSpacing: -1,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Texto: React.FC<{children: React.ReactNode; size?: number; style?: React.CSSProperties}> = ({
  children,
  size = 46,
  style,
}) => (
  <div style={{fontFamily, fontWeight: 400, fontSize: size, lineHeight: 1.3, color: C.texto, textAlign: 'center', ...style}}>
    {children}
  </div>
);

export const B: React.FC<{children: React.ReactNode; color?: string}> = ({children, color = C.texto}) => (
  <b style={{fontWeight: 700, color}}>{children}</b>
);

export const Card: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div
    style={{
      background: 'rgba(237,237,234,0.96)',
      borderRadius: 56,
      padding: '48px 52px',
      boxShadow: '0 18px 50px rgba(20,70,40,0.18)',
      ...style,
    }}
  >
    {children}
  </div>
);

export const Chip: React.FC<{children: React.ReactNode; style?: React.CSSProperties; activo?: number}> = ({
  children,
  style,
  activo = 0,
}) => (
  <div
    style={{
      fontFamily,
      fontWeight: 700,
      fontSize: 40,
      color: activo > 0.5 ? 'white' : C.verdeOscuro,
      background: activo > 0.5 ? C.verde : '#F3F3F0',
      border: `6px solid ${C.oliva}`,
      borderRadius: 999,
      padding: '18px 34px',
      textAlign: 'center',
      boxShadow: `5px 6px 0 ${C.verdeOscuro}`,
      transform: `scale(${1 + 0.08 * activo})`,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Etiqueta: React.FC<{children: React.ReactNode; color?: string; style?: React.CSSProperties}> = ({
  children,
  color = C.oliva,
  style,
}) => (
  <div
    style={{
      fontFamily,
      fontWeight: 700,
      fontSize: 44,
      color: 'white',
      background: color,
      borderRadius: 999,
      padding: '10px 36px',
      display: 'inline-block',
      ...style,
    }}
  >
    {children}
  </div>
);

// Foto recortada en forma orgánica, con zoom lento
export const Foto: React.FC<{
  src: string;
  size: number;
  alto?: number;
  radio?: string;
  style?: React.CSSProperties;
  desde?: number;
}> = ({src, size, alto = size, radio = '50%', style, desde = 0}) => {
  const f = useCurrentFrame();
  const p = usePop(desde, 14);
  const zoom = interpolate(f, [0, 600], [1.05, 1.25]);
  return (
    <div
      style={{
        width: size,
        height: alto,
        borderRadius: radio,
        overflow: 'hidden',
        border: '10px solid white',
        boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
        transform: `scale(${p})`,
        ...style,
      }}
    >
      <Img src={staticFile(`img/${src}`)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})`}} />
    </div>
  );
};

export const Logo: React.FC<{ancho: number; style?: React.CSSProperties}> = ({ancho, style}) => (
  <Img src={staticFile('img/logo.png')} style={{width: ancho, ...style}} />
);

// Sonrisa del #Creadoresdesonrisas, dibujándose
export const Sonrisa: React.FC<{ancho: number; progreso: number; color?: string; grosor?: number}> = ({
  ancho,
  progreso,
  color = C.verdeOscuro,
  grosor = 16,
}) => (
  <svg width={ancho} height={ancho * 0.32} viewBox="0 0 200 64">
    <path
      d="M12 14 Q100 100 188 14"
      fill="none"
      stroke={color}
      strokeWidth={grosor}
      strokeLinecap="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - progreso}
    />
    <path d="M6 6 L18 20" stroke={color} strokeWidth={grosor * 0.6} strokeLinecap="round" opacity={progreso > 0.05 ? 1 : 0} />
    <path d="M194 6 L182 20" stroke={color} strokeWidth={grosor * 0.6} strokeLinecap="round" opacity={progreso > 0.95 ? 1 : 0} />
  </svg>
);

export const Corazon: React.FC<{size: number; color?: string}> = ({size, color = C.oliva}) => (
  <svg width={size} height={size} viewBox="0 0 100 92">
    <path
      d="M50 88 C20 66 2 48 2 28 C2 12 14 2 28 2 C38 2 46 8 50 16 C54 8 62 2 72 2 C86 2 98 12 98 28 C98 48 80 66 50 88 Z"
      fill={color}
    />
    <ellipse cx="28" cy="24" rx="10" ry="6" fill="white" opacity="0.35" transform="rotate(-30 28 24)" />
  </svg>
);
