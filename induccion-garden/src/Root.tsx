import {Composition} from 'remotion';
import {Induccion} from './Induccion';
import {FPS, TOTAL} from './tiempos';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Induccion"
    component={Induccion}
    durationInFrames={TOTAL}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
