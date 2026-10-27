import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Clave, enPalabra, enPalabraTras} from './tiempos';
import {B, C, Card, Chip, Corazon, Etiqueta, Foto, fontFamily, Logo, Pop, Sonrisa, Texto, Titulo, usePop} from './ui';

// Zona de contenido: entre el logo superior y Sonri
const Zona: React.FC<{children: React.ReactNode; top?: number; style?: React.CSSProperties}> = ({children, top = 210, style}) => (
  <div
    style={{
      position: 'absolute',
      top,
      left: 50,
      right: 50,
      bottom: 120,
      justifyContent: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 36,
      ...style,
    }}
  >
    {children}
  </div>
);

// Fondo con la foto del edificio teñida de verde (como en la presentación)
const FondoFoto: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Img
        src={staticFile('img/fondo.jpg')}
        style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.1 + f / 3000})`}}
      />
      <AbsoluteFill style={{background: `linear-gradient(160deg, rgba(60,160,170,0.82), rgba(70,170,90,0.78))`}} />
    </AbsoluteFill>
  );
};

const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const hola = usePop(enPalabra('intro', 'Hola'), 8);
  return (
    <Zona top={120} style={{gap: 44}}>
      <Pop desde={0}>
        <Card style={{padding: '36px 60px', borderRadius: 999}}>
          <Logo ancho={560} />
        </Card>
      </Pop>
      <div style={{transform: `scale(${hola}) rotate(${Math.sin(f / 6) * 3}deg)`, marginTop: 30}}>
        <Titulo size={250} style={{color: 'white', textShadow: `8px 8px 0 ${C.verdeOscuro}`}}>
          ¡HOLA!
        </Titulo>
      </div>
      <Pop desde={enPalabra('intro', 'bienvenida')}>
        <Card style={{padding: '36px 60px'}}>
          <Texto size={58}>
            Te damos la bienvenida a
          </Texto>
          <Titulo size={120}>GARDEN</Titulo>
        </Card>
      </Pop>
      <div style={{display: 'flex', flexDirection: 'column', gap: 26, alignItems: 'center'}}>
        {[
          ['quienes', 'Quiénes somos'],
          ['como', 'Cómo trabajamos'],
          ['hacia', 'Hacia dónde vamos'],
        ].map(([w, txt]) => (
          <Pop key={w} desde={enPalabra('intro', w)}>
            <Chip>{txt}</Chip>
          </Pop>
        ))}
      </div>
    </Zona>
  );
};

const Quienes: React.FC = () => (
  <Zona>
    <Pop desde={0}>
      <Titulo>¿QUIÉNES SOMOS?</Titulo>
    </Pop>
    <div style={{position: 'relative', width: 980, height: 560}}>
      <Foto src="fachada.png" size={520} desde={4} style={{position: 'absolute', left: 30, top: 0}} />
      <Foto src="fachada28.png" size={380} desde={14} style={{position: 'absolute', right: 40, top: 170}} />
    </div>
    <Pop desde={enPalabra('quienes', 'completo')}>
      <Card style={{padding: '30px 44px'}}>
        <Texto size={50}>
          El centro de odontología <B color={C.verdeOscuro}>más completo del país</B>
        </Texto>
      </Card>
    </Pop>
    <div style={{display: 'flex', flexWrap: 'wrap', gap: 22, justifyContent: 'center'}}>
      <Pop desde={enPalabra('quienes', 'sonrisa')}>
        <Etiqueta>Cuidamos sonrisas</Etiqueta>
      </Pop>
      <Pop desde={enPalabra('quienes', 'tecnologia')}>
        <Etiqueta color={C.verde}>Tecnología de última generación</Etiqueta>
      </Pop>
      <Pop desde={enPalabra('quienes', 'equipo')}>
        <Etiqueta color={C.verdeOscuro}>Gran equipo de profesionales</Etiqueta>
      </Pop>
    </div>
  </Zona>
);

const Historia: React.FC = () => {
  const f = useCurrentFrame();
  const hitos = [
    {anio: 1991, txt: 'Nace como Sistema Odontológico Privado (SOP)', w: enPalabra('historia', 'mil', 0)},
    {anio: 1996, txt: 'Se inaugura con el nombre de Garden', w: enPalabra('historia', 'mil', 1)},
    {anio: 2011, txt: 'Inauguramos nuestro edificio actual', w: enPalabra('historia', 'dos', 0)},
  ];
  const linea = interpolate(f, [hitos[0].w, hitos[2].w + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Zona>
      <Pop desde={0}>
        <Titulo>NUESTRA HISTORIA</Titulo>
      </Pop>
      <div style={{position: 'relative', width: 980, flex: 1}}>
        <Foto
          src="fachada.png"
          size={400}
          alto={640}
          radio="200px 200px 60px 60px"
          desde={hitos[2].w}
          style={{position: 'absolute', right: 0, top: 120}}
        />
        <div
          style={{
            position: 'absolute',
            left: 58,
            top: 60,
            width: 14,
            height: 720 * linea,
            background: 'white',
            borderRadius: 7,
          }}
        />
        {hitos.map((h, i) => {
          const p = usePopLocal(h.w);
          const valor = Math.round(interpolate(p, [0, 1], [h.anio - 15, h.anio], {extrapolateRight: 'clamp'}));
          return (
            <div
              key={h.anio}
              style={{
                position: 'absolute',
                left: 0,
                top: 20 + i * 290,
                display: 'flex',
                gap: 28,
                alignItems: 'flex-start',
                opacity: Math.min(1, p * 2),
                transform: `translateX(${(1 - p) * -80}px)`,
              }}
            >
              <div
                style={{
                  width: 130,
                  height: 130,
                  borderRadius: '50%',
                  background: C.verdeOscuro,
                  border: '10px solid white',
                  flexShrink: 0,
                  transform: `scale(${p})`,
                }}
              />
              <div style={{width: 470}}>
                <Titulo size={110} style={{textAlign: 'left', color: 'white', textShadow: `5px 5px 0 ${C.verdeOscuro}`}}>
                  {valor}
                </Titulo>
                <Texto size={42} style={{textAlign: 'left', color: C.verdeOscuro, fontWeight: 600}}>
                  {h.txt}
                </Texto>
              </div>
            </div>
          );
        })}
      </div>
    </Zona>
  );
};

// Alias para usar el pop dentro de un map con nombre claro
const usePopLocal = (desde: number) => usePop(desde, 12);

const Pajaros: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <svg width={1080} height={700} style={{position: 'absolute', left: -50, top: 160, pointerEvents: 'none'}}>
      {Array.from({length: 9}).map((_, i) => {
        const x = ((f * (3 + (i % 3)) + i * 150) % 1300) - 150;
        const y = 120 + (i % 4) * 110 + Math.sin((f + i * 20) / 12) * 20;
        const ala = Math.sin((f + i * 7) / 3) * 14;
        return (
          <path
            key={i}
            d={`M${x - 30} ${y - ala} Q${x - 14} ${y - 12} ${x} ${y} Q${x + 14} ${y - 12} ${x + 30} ${y - ala}`}
            stroke={C.verdeOscuro}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            opacity="0.75"
          />
        );
      })}
    </svg>
  );
};

const Escultura: React.FC = () => (
  <Zona>
    <Pop desde={0}>
      <Titulo size={90}>“NUBE DE PÁJAROS”</Titulo>
    </Pop>
    <Foto src="escultura.png" size={560} alto={640} radio="60px" desde={4} />
    <Pajaros />
    <Pop desde={enPalabra('escultura', 'unidad')}>
      <Card style={{padding: '28px 44px'}}>
        <Texto size={48}>
          Representa a <B color={C.verdeOscuro}>nuestro equipo</B>: una <i>unidad en movimiento</i> hacia un mismo objetivo
        </Texto>
      </Card>
    </Pop>
    <Pop desde={enPalabra('escultura', 'verde')}>
      <div
        style={{
          background: C.oliva,
          borderRadius: 48,
          padding: '24px 48px',
          fontFamily,
          fontSize: 50,
          color: 'white',
          textAlign: 'center',
        }}
      >
        <b>Verde</b> = <b>salud</b> y prevención
      </div>
    </Pop>
  </Zona>
);

const Mision: React.FC = () => {
  const f = useCurrentFrame();
  const sonrisa = interpolate(f, [enPalabra('mision', 'creadores'), enPalabra('mision', 'creadores') + 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const pilares: [string, string][] = [
    ['productividad', 'Productividad'],
    ['infraestructura', 'Infraestructura y Tecnología'],
    ['capital', 'Capital Humano'],
    ['prestaciones', 'Prestaciones'],
    ['valor', 'Valor agregado'],
  ];
  return (
    <Zona style={{gap: 26}}>
      <Pop desde={0}>
        <Etiqueta color={C.verdeOscuro} style={{fontSize: 52}}>MISIÓN</Etiqueta>
      </Pop>
      <Pop desde={enPalabra('mision', 'creadores')}>
        <Card style={{padding: '30px 50px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Titulo size={92}>Creadores de Sonrisas</Titulo>
          <Sonrisa ancho={300} progreso={sonrisa} />
        </Card>
      </Pop>
      <Pop desde={enPalabra('mision', 'vision')}>
        <Etiqueta color={C.verdeOscuro} style={{fontSize: 52, marginTop: 10}}>VISIÓN · 5 PILARES</Etiqueta>
      </Pop>
      <div style={{display: 'flex', flexDirection: 'column', gap: 18, width: 860}}>
        {pilares.map(([w, txt], i) => (
          <Pop key={w} desde={enPalabra('mision', w)} desdeY={0}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 24,
                background: 'rgba(255,255,255,0.92)',
                borderRadius: 999,
                padding: '12px 30px 12px 12px',
              }}
            >
              <div
                style={{
                  width: 76,
                  height: 76,
                  borderRadius: '50%',
                  background: C.oliva,
                  color: 'white',
                  fontFamily,
                  fontWeight: 800,
                  fontSize: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {i + 1}
              </div>
              <div style={{fontFamily, fontWeight: 700, fontSize: 44, color: C.verdeOscuro}}>{txt}</div>
            </div>
          </Pop>
        ))}
      </div>
    </Zona>
  );
};

const Valores: React.FC = () => {
  const f = useCurrentFrame();
  const valores: [string, string][] = [
    ['calidad', 'CALIDAD'],
    ['servicio', 'SERVICIO'],
    ['eficacia', 'EFICACIA'],
    ['confiabilidad', 'CONFIABILIDAD'],
  ];
  const calidez = enPalabra('valores', 'calidez');
  const latido = 1 + Math.max(0, Math.sin((f - calidez) / 4)) * 0.06 * (f > calidez ? 1 : 0);
  return (
    <Zona>
      <Pop desde={0}>
        <Titulo>NUESTROS VALORES</Titulo>
      </Pop>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, width: 960, marginTop: 20}}>
        {valores.map(([w, txt], i) => (
          <Pop key={w} desde={enPalabra('valores', w)}>
            <div
              style={{
                height: 230,
                borderRadius: 48,
                background: i % 2 ? C.verde : C.oliva,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily,
                fontWeight: 800,
                fontSize: txt.length > 10 ? 50 : 62,
                color: 'white',
                boxShadow: `8px 8px 0 ${C.verdeOscuro}`,
              }}
            >
              {txt}
            </div>
          </Pop>
        ))}
      </div>
      <Pop desde={calidez}>
        <Card style={{display: 'flex', alignItems: 'center', gap: 30, padding: '36px 56px', transform: `scale(${latido})`}}>
          <Corazon size={130} />
          <Titulo size={84} style={{textAlign: 'left'}}>
            CALIDEZ
            <br />
            HUMANA
          </Titulo>
        </Card>
      </Pop>
    </Zona>
  );
};

const ESPECIALIDADES = [
  'Diagnóstico', 'Guardia', 'Endodoncia', 'Ortopedia', 'Periodoncia', 'Ortodoncia',
  'Prótesis', 'Odontopediatría', 'Operatoria', 'Implantes', 'Cirugía',
];
const Especialidades: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <FondoFoto />
      <Zona top={220}>
        <Pop desde={0}>
          <Card style={{padding: '24px 48px', borderRadius: 999}}>
            <Titulo size={74}>NUESTRAS ESPECIALIDADES</Titulo>
          </Card>
        </Pop>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 26, justifyContent: 'center', marginTop: 10}}>
          {ESPECIALIDADES.map((e, i) => {
            const desde = 12 + i * 9;
            let activo = 0;
            try {
              const w = enPalabra('especialidades', e.slice(0, 5));
              activo = interpolate(f, [w - 2, w + 3, w + 30, w + 40], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
            } catch {
              activo = 0;
            }
            return (
              <Pop key={e} desde={desde}>
                <Chip activo={activo} style={{fontSize: 46}}>
                  {e.toUpperCase()}
                </Chip>
              </Pop>
            );
          })}
        </div>
      </Zona>
    </AbsoluteFill>
  );
};

const Contador: React.FC<{hasta: number; desde: number; prefijo?: string; label: string; color: string}> = ({
  hasta,
  desde,
  prefijo = '',
  label,
  color,
}) => {
  const f = useCurrentFrame();
  const v = Math.round(interpolate(f, [desde, desde + 25], [0, hasta], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  return (
    <Pop desde={desde}>
      <div
        style={{
          width: 900,
          display: 'flex',
          alignItems: 'center',
          gap: 36,
          background: 'rgba(255,255,255,0.94)',
          borderRadius: 60,
          padding: '20px 40px',
        }}
      >
        <div style={{fontFamily, fontWeight: 800, fontSize: 150, color, width: 330, textAlign: 'center', lineHeight: 1}}>
          {prefijo}
          {v}
        </div>
        <div style={{fontFamily, fontWeight: 700, fontSize: 58, color: C.texto}}>{label}</div>
      </div>
    </Pop>
  );
};

const Numeros: React.FC = () => (
  <Zona>
    <Pop desde={0}>
      <Titulo>SOMOS UN GRAN EQUIPO</Titulo>
    </Pop>
    <Foto src="consultorio.png" size={420} desde={2} />
    <Contador hasta={50} prefijo="+" desde={enPalabra('numeros', 'cincuenta')} label="profesionales" color={C.verdeOscuro} />
    <Contador hasta={60} prefijo="+" desde={enPalabra('numeros', 'sesenta')} label="colaboradores" color={C.verde} />
  </Zona>
);

// Cada área se muestra cuando Sonri la nombra (palabra clave de la locución)
const PISOS: {nombre: string; w: string; areas: [string, string][]}[] = [
  {nombre: 'PLANTA BAJA', w: 'planta', areas: [['Recepción', 'recepcion'], ['Diagnóstico', 'diagnostico'], ['Guardia', 'guardia'], ['Asesores de plan de tratamiento', 'asesores'], ['Baño para personas con discapacidad', 'bano'], ['Sala de radiografías periapicales', 'radiografias']]},
  {nombre: 'PRIMER PISO', w: 'primer', areas: [['Depto. de Bioimágenes', 'departamento'], ['Laboratorio de esterilización', 'laboratorio'], ['Coordinación Ortodoncia', 'coordinacion']]},
  {nombre: 'SEGUNDO PISO', w: 'segundo', areas: [['Recepción', 'recepcion'], ['Operatoria Dental', 'operatoria'], ['Periodoncia', 'periodoncia'], ['Ortodoncia y Ortopedia', 'ortodoncia'], ['Odontopediatría', 'odontopediatria'], ['Isla (asistentes)', 'isla'], ['Gerencia Clínica', 'gerencia'], ['Circulantes', 'circulantes'], ['Sala de radiografías periapicales', 'radiografias']]},
  {nombre: 'TERCER PISO', w: 'tercero', areas: [['Recepción', 'recepcion'], ['Gerencia General', 'gerencia'], ['Gerencias: Operativa, Capital Humano y Finanzas', 'gerencias'], ['Central de Atención Telefónica (CAT)', 'central']]},
  {nombre: 'CUARTO PISO', w: 'cuarto', areas: [['Recepción', 'recepcion'], ['Prótesis', 'protesis'], ['Implantes', 'implantes'], ['Cirugía Bucal', 'cirugia'], ['Endodoncia', 'endodoncia'], ['Isla (asistentes)', 'isla'], ['Sala de Escáner', 'escaner'], ['Sala de radiografías periapicales', 'radiografias']]},
  {nombre: 'QUINTO PISO', w: 'quinto', areas: [['Laboratorio de prótesis', 'laboratorio'], ['Depósito de insumos', 'deposito'], ['Auditoría', 'auditoria'], ['SUM', 'sum'], ['Baños y cambiadores', 'banos']]},
];

const Pisos: React.FC = () => {
  const f = useCurrentFrame();
  const cambios = PISOS.map((p) => enPalabra('pisos', p.w));
  const actual = Math.max(0, cambios.filter((c) => f >= c - 4).length - 1);
  const desdeCambio = f - cambios[actual];
  const piso = PISOS[actual];
  const apariciones = piso.areas.reduce<number[]>((acc, [, w]) => [...acc, enPalabraTras('pisos', w, acc[acc.length - 1] ?? cambios[actual])], []);
  const altoPiso = 140;
  const ascensor = interpolate(f, cambios.flatMap((c) => [c - 4, c + 8]), cambios.flatMap((_, i) => [i === 0 ? 0 : i - 1, i]), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <Zona style={{alignItems: 'stretch'}}>
      <Pop desde={0}>
        <Titulo size={84}>RECORRIDO POR EL EDIFICIO</Titulo>
      </Pop>
      <div style={{display: 'flex', gap: 36, flex: 1, alignItems: 'flex-end'}}>
        {/* Edificio */}
        <div style={{position: 'relative', width: 330, height: altoPiso * 6 + 40}}>
          <div style={{position: 'absolute', left: 30, right: 30, top: 0, height: 40, background: C.verdeOscuro, borderRadius: '20px 20px 0 0'}} />
          {PISOS.map((p, i) => {
            const activo = i === actual && f >= cambios[0] - 4;
            return (
              <div
                key={p.nombre}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: i * altoPiso,
                  height: altoPiso - 8,
                  background: activo ? C.oliva : 'rgba(255,255,255,0.88)',
                  border: `5px solid ${C.verdeOscuro}`,
                  borderRadius: 18,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 14,
                  transform: `scale(${activo ? 1.06 : 1})`,
                }}
              >
                {[0, 1, 2].map((v) => (
                  <div
                    key={v}
                    style={{width: 54, height: 60, borderRadius: 10, background: activo ? '#FFF6C8' : '#BFE3E6', border: `4px solid ${C.verdeOscuro}`}}
                  />
                ))}
                <div
                  style={{
                    position: 'absolute',
                    left: -18,
                    top: -18,
                    width: 58,
                    height: 58,
                    borderRadius: '50%',
                    background: C.verdeOscuro,
                    color: 'white',
                    fontFamily,
                    fontWeight: 800,
                    fontSize: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {i === 0 ? 'PB' : i}
                </div>
              </div>
            );
          })}
          {/* Ascensor */}
          <div
            style={{
              position: 'absolute',
              right: -34,
              bottom: ascensor * altoPiso + altoPiso / 2 - 26,
              width: 52,
              height: 52,
              borderRadius: 14,
              background: 'white',
              border: `5px solid ${C.verdeOscuro}`,
              opacity: f >= cambios[0] - 4 ? 1 : 0,
            }}
          />
        </div>
        {/* Detalle del piso */}
        <Card style={{flex: 1, padding: '34px 36px', alignSelf: 'stretch', marginTop: 60}}>
          <div style={{opacity: f >= cambios[0] - 4 ? 1 : 0}}>
            <Etiqueta color={actual % 2 ? C.verdeOscuro : C.oliva} style={{fontSize: 46, transform: `scale(${interpolate(desdeCambio, [0, 8], [0.7, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})})`}}>
              {piso.nombre}
            </Etiqueta>
            <div style={{marginTop: 26, display: 'flex', flexDirection: 'column', gap: 12}}>
              {piso.areas.map(([a], i) => {
                const o = interpolate(f, [apariciones[i] - 3, apariciones[i] + 5], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
                return (
                  <div key={a + i} style={{fontFamily, fontSize: piso.areas.length > 7 ? 36 : 42, color: C.texto, opacity: o, transform: `translateX(${(1 - o) * 30}px)`, display: 'flex', gap: 14}}>
                    <span style={{color: C.oliva, fontWeight: 800}}>●</span>
                    <span>{a}</span>
                  </div>
                );
              })}
            </div>
          </div>
          {f < cambios[0] - 4 && (
            <Texto size={50} style={{marginTop: 200}}>
              <B color={C.verdeOscuro}>6 pisos</B> pensados para cuidar sonrisas
            </Texto>
          )}
        </Card>
      </div>
    </Zona>
  );
};

const Trabajo: React.FC = () => (
  <AbsoluteFill>
    <FondoFoto />
    <Zona top={220}>
      <Pop desde={0}>
        <Card style={{padding: '24px 52px', borderRadius: 999}}>
          <Titulo size={76}>¿CÓMO TRABAJAMOS?</Titulo>
        </Card>
      </Pop>
      <Pop desde={enPalabra('trabajo', 'compromiso')}>
        <Texto size={60} style={{color: 'white', fontWeight: 700}}>
          Con compromiso y calidad
        </Texto>
      </Pop>
      <Pop desde={enPalabra('trabajo', 'agentes')}>
        <Card style={{padding: '26px 44px'}}>
          <Texto size={54}>
            Somos <B color={C.verdeOscuro}>AGENTES DE SALUD</B>
          </Texto>
        </Card>
      </Pop>
      <div style={{display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center'}}>
        {[['respeto', 'Respeto'], ['coherencia', 'Coherencia'], ['responsabilidad', 'Responsabilidad']].map(([w, t]) => (
          <Pop key={w} desde={enPalabra('trabajo', w)}>
            <Chip>{t}</Chip>
          </Pop>
        ))}
      </div>
      <Pop desde={enPalabra('trabajo', 'compromiso', 1)}>
        <Texto size={48} style={{color: 'white', marginTop: 20}}>
          Nuestro compromiso es con…
        </Texto>
      </Pop>
      <div style={{display: 'flex', gap: 18}}>
        {[['palabra', 'la palabra'], ['equipo', 'el equipo'], ['paciente', 'el paciente']].map(([w, t]) => (
          <Pop key={w} desde={enPalabra('trabajo', w)}>
            <Etiqueta color={C.verdeOscuro} style={{fontSize: 46}}>{t}</Etiqueta>
          </Pop>
        ))}
      </div>
    </Zona>
  </AbsoluteFill>
);

const Flecha: React.FC = () => (
  <svg width="70" height="60" viewBox="0 0 70 60">
    <path d="M8 30 H52 M38 14 L56 30 L38 46" stroke={C.oliva} strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Paciente: React.FC = () => (
  <Zona>
    <Pop desde={0}>
      <Titulo size={110}>EL PACIENTE</Titulo>
    </Pop>
    <Pop desde={enPalabra('paciente', 'prioridad')}>
      <Card style={{padding: '30px 50px'}}>
        <Texto size={58}>
          Nuestra <B>PRIORIDAD</B>
          <br />y <B>RAZÓN DE SER</B>
        </Texto>
      </Card>
    </Pop>
    <div style={{display: 'flex', alignItems: 'center', gap: 6, marginTop: 30}}>
      {[['escuchamos', 'Escuchar'], ['entendemos', 'Entender'], ['atendemos', 'Atender']].map(([w, t], i) => (
        <React.Fragment key={w}>
          {i > 0 && (
            <Pop desde={enPalabra('paciente', w)}>
              <Flecha />
            </Pop>
          )}
          <Pop desde={enPalabra('paciente', w)}>
            <div
              style={{
                width: 250,
                height: 250,
                borderRadius: '50%',
                background: [C.oliva, C.verde, C.verdeOscuro][i],
                color: 'white',
                fontFamily,
                fontWeight: 800,
                fontSize: 46,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '8px solid white',
              }}
            >
              {t}
            </div>
          </Pop>
        </React.Fragment>
      ))}
    </div>
    <Pop desde={enPalabra('paciente', 'unica')}>
      <Texto size={52} style={{marginTop: 30, color: 'white', fontWeight: 600}}>
        Cada experiencia:
      </Texto>
      <Titulo size={84} style={{color: 'white', textShadow: `5px 5px 0 ${C.verdeOscuro}`}}>
        ÚNICA · CÁLIDA · HUMANA
      </Titulo>
    </Pop>
  </Zona>
);

const Destellos: React.FC<{desde: number}> = ({desde}) => {
  const f = useCurrentFrame();
  return (
    <>
      {[[-380, -120], [360, -160], [-300, 120], [330, 110], [0, -230]].map(([x, y], i) => {
        const p = Math.max(0, Math.sin((f - desde - i * 6) / 8));
        return (
          <svg key={i} width="80" height="80" viewBox="-40 -40 80 80" style={{position: 'absolute', left: `calc(50% + ${x}px - 40px)`, top: `calc(50% + ${y}px - 40px)`, transform: `scale(${f > desde ? p : 0})`}}>
            <path d="M0 -36 Q6 -6 36 0 Q6 6 0 36 Q-6 6 -36 0 Q-6 -6 0 -36 Z" fill="white" />
          </svg>
        );
      })}
    </>
  );
};

const Sonrisas: React.FC = () => {
  const f = useCurrentFrame();
  const inicio = enPalabra('sonrisas', 'creando');
  const prog = interpolate(f, [inicio, inicio + 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Zona>
      <Pop desde={0}>
        <Etiqueta color={C.verdeOscuro} style={{fontSize: 52}}>PARA VOS</Etiqueta>
      </Pop>
      <Pop desde={inicio}>
        <Card style={{padding: '50px 60px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Texto size={56} style={{fontWeight: 600, color: C.verdeOscuro}}>Programa</Texto>
          <Titulo size={110}>
            CREANDO
            <br />
            SONRISAS
          </Titulo>
          <Sonrisa ancho={420} progreso={prog} />
          <Destellos desde={inicio + 20} />
        </Card>
      </Pop>
      <Pop desde={enPalabra('sonrisas', 'beneficios')}>
        <Texto size={54} style={{color: 'white', fontWeight: 500}}>
          <b>Beneficios</b> para cuidar la <b>salud bucal</b>
          <br />
          de todo el equipo Garden
        </Texto>
      </Pop>
      <Pop desde={enPalabra('sonrisas', 'equipo')}>
        <Texto size={50} style={{color: C.verdeOscuro, fontWeight: 700}}>#Creadoresdesonrisas</Texto>
      </Pop>
    </Zona>
  );
};

const Capital: React.FC = () => {
  const f = useCurrentFrame();
  const latido = 1 + Math.abs(Math.sin(f / 7)) * 0.12;
  const crecer = enPalabra('capital', 'crecer');
  return (
    <Zona>
      <Pop desde={0}>
        <Titulo size={110}>CAPITAL HUMANO</Titulo>
      </Pop>
      <Pop desde={enPalabra('capital', 'vos')}>
        <Card style={{padding: '40px 50px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
          <Texto size={62} style={{fontWeight: 700, color: C.verdeOscuro}}>VOS SOS EL</Texto>
          <div style={{transform: `scale(${latido})`}}>
            <Corazon size={240} />
          </div>
          <Texto size={62} style={{fontWeight: 700, color: C.verdeOscuro}}>DE NUESTRA EMPRESA</Texto>
        </Card>
      </Pop>
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 22, height: 220}}>
        {[0, 1, 2, 3].map((i) => {
          const p = usePopLocal(crecer + i * 5);
          return <div key={i} style={{width: 80, height: (60 + i * 50) * p, background: [C.lima, C.oliva, C.verde, C.verdeOscuro][i], borderRadius: 20}} />;
        })}
      </div>
      <Pop desde={enPalabra('capital', 'acompanarte')}>
        <Texto size={52} style={{color: 'white', fontWeight: 600}}>
          Te acompañamos a <b>crecer</b> dentro de Garden
        </Texto>
      </Pop>
    </Zona>
  );
};

const Confeti: React.FC = () => {
  const f = useCurrentFrame();
  const colores = [C.oliva, C.verde, 'white', C.lima, C.verdeOscuro];
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {Array.from({length: 40}).map((_, i) => {
        const x = (i * 137) % 1080;
        const y = -60 + ((f * (5 + (i % 5)) + i * 90) % 2000);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x + Math.sin((f + i * 10) / 15) * 40,
              top: y,
              width: 22,
              height: 34,
              background: colores[i % colores.length],
              borderRadius: 6,
              transform: `rotate(${f * (4 + (i % 6)) + i * 30}deg)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const Instagram: React.FC = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={C.verdeOscuro} strokeWidth="2.2">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.3" cy="6.7" r="1" fill={C.verdeOscuro} />
  </svg>
);

const Cierre: React.FC = () => {
  const f = useCurrentFrame();
  const sonrisa = interpolate(f, [enPalabra('cierre', 'creadores') - 5, enPalabra('cierre', 'creadores') + 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill>
      <Confeti />
      <Zona top={120} style={{gap: 40}}>
        <Pop desde={0}>
          <Card style={{padding: '36px 60px', borderRadius: 999}}>
            <Logo ancho={520} />
          </Card>
        </Pop>
        <Pop desde={enPalabra('cierre', 'gracias')}>
          <Titulo size={150} style={{color: 'white', textShadow: `7px 7px 0 ${C.verdeOscuro}`}}>
            ¡GRACIAS!
          </Titulo>
        </Pop>
        <Pop desde={enPalabra('cierre', 'bienvenida')}>
          <Card style={{padding: '30px 50px'}}>
            <Titulo size={86}>
              ¡BIENVENIDO/A
              <br />
              AL EQUIPO!
            </Titulo>
          </Card>
        </Pop>
        <Pop desde={enPalabra('cierre', 'instagram')}>
          <div style={{display: 'flex', alignItems: 'center', gap: 18, background: 'white', borderRadius: 999, padding: '16px 40px'}}>
            <Instagram />
            <span style={{fontFamily, fontWeight: 700, fontSize: 54, color: C.verdeOscuro}}>centrosgarden</span>
          </div>
        </Pop>
        <Pop desde={enPalabra('cierre', 'creadores')}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Texto size={56} style={{fontWeight: 700, color: C.verdeOscuro}}>#Creadoresdesonrisas</Texto>
            <Sonrisa ancho={260} progreso={sonrisa} />
          </div>
        </Pop>
      </Zona>
    </AbsoluteFill>
  );
};

export const ESCENAS_UI: Record<Clave, React.FC> = {
  intro: Intro,
  quienes: Quienes,
  historia: Historia,
  escultura: Escultura,
  mision: Mision,
  valores: Valores,
  especialidades: Especialidades,
  numeros: Numeros,
  pisos: Pisos,
  trabajo: Trabajo,
  paciente: Paciente,
  sonrisas: Sonrisas,
  capital: Capital,
  cierre: Cierre,
};
