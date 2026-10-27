import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {ESCENAS_UI} from './escenas';
import {duracion, ESCENAS, INICIOS, LEAD, TOTAL} from './tiempos';
import {C, fontFamily, Logo} from './ui';

const Fondo: React.FC = () => {
  const f = useCurrentFrame();
  const giro = 135 + Math.sin(f / 120) * 15;
  return (
    <AbsoluteFill style={{background: `linear-gradient(${giro}deg, ${C.teal} 0%, #8FD0B8 50%, ${C.verdeClaro} 100%)`}}>
      {Array.from({length: 14}).map((_, i) => {
        const x = (i * 197) % 1080;
        const vel = 0.6 + (i % 4) * 0.25;
        const y = 1980 - ((f * vel + i * 260) % 2200);
        const r = 30 + (i % 5) * 22;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x + Math.sin((f + i * 40) / 50) * 30,
              top: y,
              width: r,
              height: r,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.16)',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Envuelve cada escena con entrada y salida suaves
const Escena: React.FC<{dur: number; children: React.ReactNode}> = ({dur, children}) => {
  const f = useCurrentFrame();
  const entrada = interpolate(f, [0, 12], [0, 1], {extrapolateRight: 'clamp'});
  const salida = interpolate(f, [dur - 12, dur], [1, 0], {extrapolateLeft: 'clamp'});
  return (
    <AbsoluteFill
      style={{
        opacity: Math.min(entrada, salida),
        transform: `translateX(${(1 - entrada) * 80 - (1 - salida) * 80}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const Induccion: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.teal, fontFamily}}>
      <Fondo />
      <Audio src={staticFile('musica.mp3')} volume={(fr) => interpolate(fr, [0, 30, TOTAL - 45, TOTAL], [0, 0.35, 0.35, 0], {extrapolateRight: 'clamp'})} />
      {ESCENAS.map((k) => {
        const Contenido = ESCENAS_UI[k];
        return (
          <Sequence key={k} from={INICIOS[k]} durationInFrames={duracion(k)} name={k}>
            <Sequence from={LEAD} layout="none">
              <Audio src={staticFile(`voz/${k}.mp3`)} />
            </Sequence>
            <Escena dur={duracion(k)}>
              <Contenido />
            </Escena>
          </Sequence>
        );
      })}
      {/* Logo fijo arriba, salvo en apertura y cierre */}
      <div
        style={{
          position: 'absolute',
          top: 48,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255,255,255,0.9)',
          borderRadius: 999,
          padding: '14px 40px',
          opacity: f > INICIOS.quienes - 10 && f < INICIOS.cierre + 5 ? 1 : 0,
        }}
      >
        <Logo ancho={260} />
      </div>
    </AbsoluteFill>
  );
};
