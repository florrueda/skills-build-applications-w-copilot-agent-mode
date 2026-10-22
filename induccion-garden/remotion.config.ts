import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setEntryPoint('src/index.ts');
Config.setBrowserExecutable(process.env.REMOTION_BROWSER ?? null);
