#!/usr/bin/env python3
"""Reconstruye un HTML único (Trepalace.html) a partir de index.html y los recursos locales."""
from pathlib import Path
import re
ROOT=Path(__file__).resolve().parent
html=(ROOT/'index.html').read_text(encoding='utf-8')
css=(ROOT/'css/estilos.css').read_text(encoding='utf-8')
html=html.replace('<link rel="stylesheet" href="css/estilos.css">','<style>\n'+css+'\n</style>')
html=re.sub(r'<script src="([^"]+)"></script>',lambda m:'<script>\n'+(ROOT/m.group(1)).read_text(encoding='utf-8')+'\n</script>',html)
(ROOT/'Trepalace.html').write_text(html,encoding='utf-8')
print('Creado:',ROOT/'Trepalace.html')
