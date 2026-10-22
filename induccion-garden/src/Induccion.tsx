import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {ESCENAS_UI} from './escenas';
import {Sonri} from './Sonri';
import {COLA, duracion, ESCENAS, FPS, INICIOS, LEAD, Palabra, TOTAL, VOZ} from './tiempos';
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

// Agrupa palabras en frases cortas para el globo de diálogo
const frases = (palabras: Palabra[]) => {
  const grupos: Palabra[][] = [];
  let actual: Palabra[] = [];
  palabras.forEach((p, i) => {
    const pausa = i > 0 ? p.ini - palabras[i - 1].fin : 0;
    const largo = actual.map((w) => w.t).join(' ').length;
    if (actual.length && (pausa > 0.3 || largo + p.t.length > 34)) {
      grupos.push(actual);
      actual = [];
    }
    actual.push(p);
  });
  if (actual.length) grupos.push(actual);
  return grupos;
};
const FRASES = Object.fromEntries(ESCENAS.map((k) => [k, frases(VOZ[k].palabras)]));

const Narrador: React.FC = () => {
  const f = useCurrentFrame();
  const k = [...ESCENAS].reverse().find((e) => f >= INICIOS[e]) ?? 'intro';
  const t = (f - INICIOS[k] - LEAD) / FPS;
  const palabras = VOZ[k].palabras;
  const hablando = palabras.find((p) => t >= p.ini && t <= p.fin + 0.04);
  const boca = hablando ? 0.35 + 0.65 * Math.abs(Math.sin(t * 22)) : 0;

  const grupos = FRASES[k];
  const idx = grupos.findIndex((g, i) => t < (grupos[i + 1]?.[0].ini ?? Infinity) - 0.05);
  const grupo = t >= (grupos[0]?.[0].ini ?? 0) - 0.15 && t <= VOZ[k].duracion + 0.3 ? grupos[idx] : undefined;

  const local = f - INICIOS[k];
  const aparece = interpolate(local, [0, 10, duracion(k) - COLA + 6, duracion(k)], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 20, top: 1440}}>
        <Sonri size={340} boca={boca} saludando={k === 'intro' || k === 'cierre'} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 380,
          right: 36,
          top: 1520,
          minHeight: 230,
          background: 'white',
          borderRadius: 48,
          padding: '30px 38px',
          boxShadow: '0 14px 40px rgba(0,60,30,0.2)',
          display: 'flex',
          alignItems: 'center',
          opacity: grupo ? aparece : 0,
          transform: `scale(${0.9 + 0.1 * aparece})`,
          transformOrigin: 'left center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: -26,
            top: 90,
            width: 0,
            height: 0,
            borderTop: '22px solid transparent',
            borderBottom: '22px solid transparent',
            borderRight: '34px solid white',
          }}
        />
        <div style={{fontFamily, fontSize: 50, lineHeight: 1.25, color: C.texto, fontWeight: 500}}>
          {grupo?.map((p, i) => {
            const dicha = t >= p.ini;
            return (
              <span key={i} style={{color: dicha ? C.verdeOscuro : '#9AA59E', fontWeight: dicha ? 700 : 500}}>
                {p.t}{' '}
              </span>
            );
          })}
        </div>
      </div>
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
      <Narrador />
    </AbsoluteFill>
  );
};
