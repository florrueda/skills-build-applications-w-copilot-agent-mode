import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from './ui';

// Sonri: la muela mascota de Garden que narra el video.
// `boca` va de 0 (cerrada, sonriendo) a 1 (bien abierta).
export const Sonri: React.FC<{size: number; boca: number; saludando: boolean}> = ({size, boca, saludando}) => {
  const f = useCurrentFrame();
  const salto = Math.sin(f / 9) * 7;
  const estirar = 1 + Math.sin(f / 9 + 1) * 0.015;
  const parpadeo = f % 96 < 5 ? 0.12 : 1;
  const brazoDer = saludando ? -40 + Math.sin(f / 3.2) * 28 : -6 + Math.sin(f / 14) * 8;
  const brazoIzq = 8 + Math.sin(f / 12 + 2) * 6;
  const altoBoca = 4 + boca * 24;
  const hoja = Math.sin(f / 7) * 6;

  return (
    <svg width={size} height={size * 1.25} viewBox="-20 -30 240 300" style={{overflow: 'visible'}}>
      <ellipse cx="100" cy="258" rx={62 - salto} ry="9" fill="rgba(0,60,30,0.18)" />
      <g transform={`translate(0 ${salto - 6}) scale(1 ${estirar})`} style={{transformOrigin: '100px 240px'}}>
        {/* Hojitas del logo en la cabeza */}
        <g transform={`rotate(${hoja} 100 26)`}>
          <path d="M100 28 C96 6 112 -14 140 -18 C130 -2 122 18 100 28 Z" fill={C.lima} />
          <path d="M100 28 C92 10 74 -2 52 0 C64 12 78 26 100 28 Z" fill={C.verde} />
        </g>
        {/* Brazos */}
        <g transform={`rotate(${brazoIzq} 38 128)`}>
          <path d="M38 128 C18 138 8 150 2 168" stroke={C.verdeOscuro} strokeWidth="9" fill="none" strokeLinecap="round" />
          <circle cx="2" cy="170" r="12" fill="white" stroke={C.verdeOscuro} strokeWidth="6" />
        </g>
        <g transform={`rotate(${brazoDer} 162 128)`}>
          <path d="M162 128 C182 138 192 150 198 168" stroke={C.verdeOscuro} strokeWidth="9" fill="none" strokeLinecap="round" />
          <circle cx="198" cy="170" r="12" fill="white" stroke={C.verdeOscuro} strokeWidth="6" />
        </g>
        {/* Cuerpo de muela */}
        <path
          d="M40 30 C60 10 85 20 100 28 C115 20 140 10 160 30 C182 52 178 100 165 130 C158 150 156 175 150 205 C146 228 128 230 124 205 C120 182 114 162 100 162 C86 162 80 182 76 205 C72 230 54 228 50 205 C44 175 42 150 35 130 C22 100 18 52 40 30 Z"
          fill="white"
          stroke={C.verdeOscuro}
          strokeWidth="7"
          strokeLinejoin="round"
        />
        <path d="M52 48 C58 38 70 34 80 38" stroke="#D9F0E0" strokeWidth="9" fill="none" strokeLinecap="round" />
        {/* Ojos */}
        {[76, 124].map((x) => (
          <g key={x} transform={`translate(${x} 86) scale(1 ${parpadeo})`}>
            <ellipse rx="10" ry="13" fill="#23312A" />
            <circle cx="3.5" cy="-5" r="3.6" fill="white" />
          </g>
        ))}
        {/* Cachetes */}
        <ellipse cx="58" cy="112" rx="12" ry="7" fill="#F7A8B4" opacity="0.8" />
        <ellipse cx="142" cy="112" rx="12" ry="7" fill="#F7A8B4" opacity="0.8" />
        {/* Boca */}
        <path
          d={`M80 110 Q100 ${118 + altoBoca} 120 110 Q100 ${112 + altoBoca * 0.25} 80 110 Z`}
          fill="#7A1F2B"
          stroke={C.verdeOscuro}
          strokeWidth="4"
          strokeLinejoin="round"
        />
        {boca > 0.25 && <ellipse cx="100" cy={110 + altoBoca * 0.75} rx={8 + boca * 3} ry={3 + boca * 3} fill="#F07C8A" />}
      </g>
    </svg>
  );
};
