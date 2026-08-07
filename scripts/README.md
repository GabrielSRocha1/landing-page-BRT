# scripts

Utilitários de manutenção usados durante o desenvolvimento. **Não fazem parte do
site publicado** — ficam fora de `public/`, que é o `outputDirectory` do deploy
na Vercel.

## Estado atual

Ambos os scripts são de uso pontual e estão **obsoletos**: operam sobre o arquivo
`brutos-coin-landing (1).html`, que não existe mais no projeto (a landing vigente
é `public/index.html`). Foram mantidos apenas como referência histórica.

| Arquivo | O que fazia |
| --- | --- |
| `fix_image.py` | Corrigia a indentação do atributo `alt` de uma `<img>` numa linha específica. |
| `replace_images.ps1` | Trocava o `src` de duas `<img>` por `public/BRUTOS.png`. Contém um caminho absoluto de outra máquina. |

Antes de reaproveitar qualquer um deles, ajuste o caminho do arquivo alvo.
