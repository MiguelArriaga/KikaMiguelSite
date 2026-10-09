"""Bake editable JSON into a static, public-only GitHub Pages artifact."""
import html
import json
import re
import shutil
import os
import tempfile
import time
from datetime import datetime
from pathlib import Path
from urllib.parse import urlsplit
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[1]
CONFIG = ROOT / "content/site.json"
FONTS = {"Playfair Display|Work Sans", "Bodoni MT Bold|Work Sans", "Bodoni MT Black|Work Sans", "Instrument Serif|Work Sans", "Fraunces|Inter", "Newsreader|Manrope", "Cormorant|Sora"}


def retry_io(operation):
    # Dropbox and antivirus can briefly hold Windows files during synchronization.
    for attempt in range(10):
        try:
            return operation()
        except PermissionError:
            if attempt == 9:
                raise
            time.sleep(0.1)


def atomic_write(path, text):
    with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", dir=path.parent, delete=False, suffix=".tmp") as file:
        temporary = Path(file.name)
        file.write(text)
    try:
        retry_io(lambda: os.replace(temporary, path))
    finally:
        if temporary.exists():
            temporary.unlink()


def validate(config):
    baseline = json.loads(CONFIG.read_text(encoding="utf-8"))
    if not isinstance(config, dict) or set(config) != set(baseline):
        raise ValueError("Configuração inválida.")
    for group in ("content", "sections", "theme"):
        if not isinstance(config[group], dict) or set(config[group]) != set(baseline[group]):
            raise ValueError("Campos inválidos: " + group)
    if any(not isinstance(v, str) or len(v) > 5000 for v in config["content"].values()):
        raise ValueError("Texto inválido ou demasiado longo.")
    if any(type(v) is not bool for v in config["sections"].values()):
        raise ValueError("Secções inválidas.")
    if not isinstance(config["weddingDateTime"], str):
        raise ValueError("Data inválida.")
    date = datetime.fromisoformat(config["weddingDateTime"])
    if date.utcoffset() is None:
        raise ValueError("A data deve incluir o fuso horário.")
    theme = config["theme"]
    if not isinstance(theme["colors"], dict) or set(theme["colors"]) != set(baseline["theme"]["colors"]):
        raise ValueError("Cores inválidas.")
    if any(not isinstance(v, str) or not re.fullmatch(r"#[0-9a-fA-F]{6}", v) for v in theme["colors"].values()):
        raise ValueError("Use cores hexadecimais de seis dígitos.")
    if theme["fontPair"] not in FONTS:
        raise ValueError("Combinação de fontes inválida.")
    form = config.get("giftForm")
    if not isinstance(form, dict) or set(form) != {"url"}:
        raise ValueError("Configuração do formulário inválida.")
    url = form["url"]
    if not isinstance(url, str) or len(url) > 2048:
        raise ValueError("Endereço do formulário inválido.")
    if url:
        parsed = urlsplit(url)
        if (parsed.scheme != "https" or parsed.netloc != "docs.google.com"
                or not re.fullmatch(r"/forms/d/e/[A-Za-z0-9_-]+/viewform", parsed.path)
                or parsed.query or parsed.fragment):
            raise ValueError("Use o endereço público completo do Google Forms, sem parâmetros.")
    return config


def render(config):
    source = (ROOT / "index.html").read_text(encoding="utf-8")
    def replace(match):
        key = match.group(2)
        return match.group(1) + html.escape(config["content"][key]) + match.group(3)
    source = re.sub(r'(<[^>]+data-content="([^"]+)"[^>]*>)[^<]*(</[^>]+>)', replace, source)
    def replace_alt(match):
        tag = match.group(0)
        value = html.escape(config["content"][match.group(1)], quote=True)
        return re.sub(r'\salt="[^"]*"', lambda _: ' alt="' + value + '"', tag)
    source = re.sub(r'<img\b[^>]*\bdata-content-alt="([^"]+)"[^>]*>', replace_alt, source)
    date = datetime.fromisoformat(config["weddingDateTime"]).astimezone(ZoneInfo("Europe/Lisbon"))
    months = "janeiro fevereiro março abril maio junho julho agosto setembro outubro novembro dezembro".split()
    label = f"{date.day} de {months[date.month-1]} de {date.year}"
    dates = {"date": label, "clock": date.strftime("%H:%M"), "time": label + " · " + date.strftime("%H:%M"), "place": label + " · Lisboa", "reception": label + " · a seguir à missa"}
    source = re.sub(r'(<[^>]+data-date="([^"]+)"[^>]*>)[^<]*(</[^>]+>)', lambda m: m[1] + dates[m[2]] + m[3], source)
    source = re.sub(r'<title>.*?</title>', '<title>' + html.escape(config['content']['couple.name']) + ' — ' + label + '</title>', source)
    # Bake the integration into HTML so it also works without JavaScript.
    # Never load an empty iframe URL: it could embed the website inside itself.
    form_url = config["giftForm"]["url"]
    def form_container(match):
        tag = re.sub(r'\s+hidden(?:="[^"]*")?', '', match.group(0))
        return tag if form_url else tag[:-1] + ' hidden>'
    source = re.sub(r'<div\b[^>]*\bid="giftForm"[^>]*>', form_container, source)
    def form_frame(match):
        tag = re.sub(r'\s+src="[^"]*"', '', match.group(0))
        if form_url:
            tag = tag[:-1] + ' src="' + html.escape(form_url + '?embedded=true', quote=True) + '">'
        return tag
    source = re.sub(r'<iframe\b[^>]*\bid="giftFormFrame"[^>]*>', form_frame, source)
    source = re.sub(r'(<a\b[^>]*\bid="giftFormLink"[^>]*\bhref=")[^"]*(")',
                    lambda m: m[1] + html.escape(form_url or '#presentes', quote=True) + m[2], source)
    return source


def bake(config):
    atomic_write(ROOT / "index.html", render(config))
    script = "// Generated from content/site.json by tools/build.py.\nwindow.SITE_CONFIG = "
    # Escape '<' so generated JS is also safe to embed in HTML if needed.
    script += json.dumps(config, ensure_ascii=False, indent=2).replace("<", "\\u003c") + ";\n"
    atomic_write(ROOT / "js/config.js", script)


def build():
    config = validate(json.loads(CONFIG.read_text(encoding="utf-8")))
    bake(config)
    output = ROOT / "dist"
    # This constant target is always within the repository.
    output.mkdir(exist_ok=True)
    for child in output.iterdir():
        if child.is_dir() and not child.is_symlink():
            shutil.rmtree(child)
        else:
            child.unlink()
    shutil.copy2(ROOT / "index.html", output / "index.html")
    for folder in ("css", "js", "pictures"):
        shutil.copytree(ROOT / folder, output / folder)
    (output / ".nojekyll").touch()
    if (ROOT / "CNAME").exists():
        shutil.copy2(ROOT / "CNAME", output / "CNAME")
    print("Static site built in dist/; local tools excluded.")


if __name__ == "__main__":
    build()
