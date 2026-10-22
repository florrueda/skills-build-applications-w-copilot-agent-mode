"""Genera una música de fondo suave (acordes + arpegio tipo marimba), libre de derechos.

Salida: public/musica.wav
"""
import pathlib
import wave

import numpy as np

RAIZ = pathlib.Path(__file__).resolve().parent.parent
SR = 44100
DURACION = 170
BPM = 100
COMPAS = 60 / BPM * 4

# Do - La menor - Fa - Sol (frecuencias en Hz)
ACORDES = [
    [261.63, 329.63, 392.00],
    [220.00, 261.63, 329.63],
    [174.61, 220.00, 261.63],
    [196.00, 246.94, 293.66],
]

t = np.arange(int(SR * DURACION)) / SR
pad = np.zeros_like(t)
arp = np.zeros_like(t)

n_compases = int(DURACION / COMPAS) + 1
for c in range(n_compases):
    acorde = ACORDES[c % 4]
    ini = int(c * COMPAS * SR)
    fin = min(int((c + 1) * COMPAS * SR), len(t))
    if ini >= len(t):
        break
    seg = t[ini:fin] - t[ini]
    env = np.minimum(1, seg / 0.4) * np.minimum(1, (COMPAS - seg) / 0.4)
    for f in acorde:
        pad[ini:fin] += env * (np.sin(2 * np.pi * f / 2 * seg) + 0.3 * np.sin(2 * np.pi * f * seg))
    # arpegio en corcheas
    corchea = COMPAS / 8
    for i in range(8):
        f = acorde[[0, 1, 2, 1, 0, 2, 1, 2][i]] * 2
        a = ini + int(i * corchea * SR)
        if a >= len(t):
            break
        b = min(a + int(0.6 * SR), len(t))
        s = t[a:b] - t[a]
        arp[a:b] += np.exp(-s * 7) * (np.sin(2 * np.pi * f * s) + 0.25 * np.sin(2 * np.pi * f * 4 * s) * np.exp(-s * 20))

audio = 0.10 * pad / 3 + 0.16 * arp
fade = np.minimum(1, t / 2) * np.minimum(1, (DURACION - t) / 3)
audio = (audio * fade).clip(-1, 1)

with wave.open(str(RAIZ / "public" / "musica.wav"), "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((audio * 32767).astype(np.int16).tobytes())
