# Junta os ficheiros da pasta src/ (HTML) e css/partes/ (CSS)
# no index.html e no css/style.css.
import glob

# HTML: junta os ficheiros de src/ por ordem do nome (00, 01, 10, ...)
partes = sorted(glob.glob("src/*.html"))
html = ""
for p in partes:
    texto = open(p, encoding="utf-8").read()
    if p.endswith("10-inicio.html"):
        html += "  <main>\n\n"      # o <main> abre antes da primeira secção
    if p.endswith("90-rodape.html"):
        html += "  </main>\n\n"     # e fecha antes do rodapé
    html += texto
open("index.html", "w", encoding="utf-8").write(html)

# CSS: junta os ficheiros de css/partes/ pela mesma ordem
css = ""
for p in sorted(glob.glob("css/partes/*.css")):
    css += open(p, encoding="utf-8").read()
open("css/style.css", "w", encoding="utf-8").write(css)

print("index.html e css/style.css gerados.")
