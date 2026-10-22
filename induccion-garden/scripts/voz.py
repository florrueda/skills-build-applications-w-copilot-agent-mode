"""Genera la voz en off de Sonri (edge-tts, voz argentina) y los subtítulos por palabra.

Salida: public/voz/<escena>.mp3 y src/voz.json con duración y palabras de cada escena.
"""
import asyncio
import json
import pathlib
import subprocess

import edge_tts

RAIZ = pathlib.Path(__file__).resolve().parent.parent
VOZ = "es-AR-ElenaNeural"

GUION = {
    "intro": "¡Hola! Soy Sonri, y te doy la bienvenida a Garden, centro odontológico. "
             "Acompañame a conocer quiénes somos, cómo trabajamos y hacia dónde vamos.",
    "quienes": "Garden es el centro de odontología más completo del país. "
               "Nuestro propósito es claro: cuidar la sonrisa de nuestros pacientes, "
               "con tecnología de última generación y un gran equipo de profesionales.",
    "historia": "Todo empezó en mil novecientos noventa y uno, como Sistema Odontológico Privado. "
                "En mil novecientos noventa y seis nació Garden, "
                "y en dos mil once inauguramos nuestro edificio actual.",
    "escultura": "¿Viste la escultura Nube de pájaros? Representa a nuestro equipo: "
                 "una unidad en movimiento, todos juntos hacia un mismo objetivo. "
                 "Y el verde de nuestra identidad simboliza la salud.",
    "mision": "Nuestra misión: ser Creadores de Sonrisas. "
              "Nuestra visión se apoya en cinco pilares: productividad, infraestructura y tecnología, "
              "capital humano, prestaciones y valor agregado.",
    "valores": "Y nuestros valores son: calidad, servicio, eficacia, confiabilidad, "
               "y sobre todo, calidez humana.",
    "especialidades": "Atendemos todas las especialidades: diagnóstico, guardia, endodoncia, "
                      "ortodoncia, implantes, cirugía, odontopediatría, ¡y mucho más!",
    "numeros": "Somos más de cincuenta profesionales y más de sesenta colaboradores, "
               "en treinta y dos consultorios.",
    "pisos": "Hagamos un recorrido rápido. En planta baja: recepción, diagnóstico y guardia. "
             "Primer piso: bioimágenes y esterilización. "
             "Segundo: operatoria, periodoncia, ortodoncia y odontopediatría. "
             "Tercero: gerencias y la central de atención telefónica. "
             "Cuarto: prótesis, implantes, cirugía y endodoncia. "
             "Y en el quinto: laboratorio, digitalización, el SUM y los cambiadores.",
    "trabajo": "¿Cómo trabajamos? Con compromiso y calidad. Somos agentes de salud "
               "que actúan con respeto, coherencia y responsabilidad. "
               "Nuestro compromiso es con la palabra, el equipo y el paciente.",
    "paciente": "El paciente es nuestra prioridad y razón de ser. "
                "Lo escuchamos, lo entendemos y lo atendemos, "
                "para que cada experiencia sea única, cálida y humana.",
    "sonrisas": "Y como también cuidamos tu sonrisa, tenés el programa Creando Sonrisas: "
                "beneficios para la salud bucal de todo el equipo Garden.",
    "capital": "Porque vos sos el corazón de nuestra empresa. "
               "El área de Capital Humano está para acompañarte a crecer dentro de Garden.",
    "cierre": "¡Gracias, y bienvenida o bienvenido al equipo! "
              "Seguinos en Instagram como centros garden. ¡Somos Creadores de Sonrisas!",
}


async def generar(clave: str, texto: str) -> dict:
    mp3 = RAIZ / "public" / "voz" / f"{clave}.mp3"
    palabras = []
    com = edge_tts.Communicate(texto, VOZ, rate="+4%", pitch="+6Hz", boundary="WordBoundary")
    with open(mp3, "wb") as f:
        async for chunk in com.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                palabras.append({
                    "t": chunk["text"],
                    "ini": chunk["offset"] / 1e7,
                    "fin": (chunk["offset"] + chunk["duration"]) / 1e7,
                })
    dur = float(subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "csv=p=0", str(mp3)]).decode().strip())
    return {"duracion": dur, "palabras": palabras}


async def main():
    salida = {}
    for clave, texto in GUION.items():
        salida[clave] = await generar(clave, texto)
        print(f"{clave}: {salida[clave]['duracion']:.1f}s")
    (RAIZ / "src" / "voz.json").write_text(json.dumps(salida, ensure_ascii=False, indent=1))


asyncio.run(main())
