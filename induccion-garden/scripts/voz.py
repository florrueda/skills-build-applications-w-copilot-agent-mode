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
    "pisos": "Hagamos un recorrido por el edificio. En planta baja están: recepción, diagnóstico, guardia, "
             "asesoría comercial, el baño para personas con discapacidad y la sala de radiografías periapicales. "
             "En el primer piso: el departamento de bioimágenes, el laboratorio de esterilización "
             "y la coordinación de ortodoncia. "
             "En el segundo: recepción, operatoria dental, periodoncia, ortodoncia y ortopedia, odontopediatría, "
             "la isla de asistentes, gerencia clínica, circulantes y otra sala de radiografías periapicales. "
             "En el tercero: recepción, gerencia general, las gerencias operativa, de capital humano y de finanzas, "
             "y la central de atención telefónica. "
             "En el cuarto: recepción, prótesis, implantes, cirugía bucal, endodoncia, la isla de asistentes, "
             "la sala de escáner y otra sala de radiografías periapicales. "
             "Y en el quinto piso: el laboratorio de prótesis, digitalización, el depósito de insumos, "
             "auditoría, el SUM, y los baños y cambiadores.",
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
