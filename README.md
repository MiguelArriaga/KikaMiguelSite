# Site do Casamento — Kika & Miguel

Site estático em português de Portugal para 23 de janeiro de 2027, em Lisboa.
O site público não precisa de backend nem de autenticação.

## Ver localmente

No PowerShell, na raiz do projeto:

```powershell
& "C:\Users\migue\anaconda3\python.exe" tools/dev.py
```

Abra http://127.0.0.1:8000/. Pare com `Ctrl+C`.
O servidor faz o build e serve apenas `dist/`, na interface local.

## Alterar conteúdo e design

- `content/site.json`: textos, cores, fontes, data e secções visíveis.
- `index.html`: estrutura da página, fotografias e links.
- `css/styles.css`: estilos responsivos e animações.
- `js/main.js`: navegação, countdown, FAQ e galeria.

Depois de alterar os ficheiros, faça o build e recarregue o browser:

```powershell
& "C:\Users\migue\anaconda3\python.exe" tools/build.py
```

O build atualiza `index.html`, gera `js/config.js` e cria `dist/`.
Não edite diretamente `js/config.js` nem os ficheiros dentro de `dist/`.
A data inclui o fuso horário e é apresentada na hora de Lisboa.

Para acrescentar texto configurável, use `data-content="uma.chave"` num elemento
com apenas texto e acrescente a mesma chave ao JSON.

## Validação

```powershell
& "C:\Users\migue\anaconda3\python.exe" tools/test_site.py
node --check js/main.js
```

O teste de browser opcional `tools/browser-check.mjs` usa Chrome no Windows e
requer o servidor local ativo. Limpa os perfis e screenshots temporários ao terminar.

Python 3.9 ou superior é necessário; pode usar `python` se estiver no PATH.
O build usa a base de fusos horários IANA (`tzdata` no Windows, disponível neste Anaconda).

## Publicar no GitHub Pages

1. Em Settings → Pages → Build and deployment → Source, selecione **GitHub Actions**.
2. Faça commit e push para `master` ou `main`.
3. O workflow valida o site e publica apenas o artefacto `dist/`.
4. Confirme a publicação no separador Actions e teste o URL apresentado.

O JSON de origem, as ferramentas e a documentação ficam fora da publicação.
Consulte [a documentação oficial do GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
Quando escolherem um domínio, configurem-no nas definições do Pages e no DNS.
O build copia um ficheiro `CNAME` da raiz, se existir.

## Conteúdo

- Lua de mel na Patagónia como presente principal; fotografias de El Chaltén e Torres del Paine.
- Painel integrado de fotografias e fundo de lua de mel, com as fotografias fornecidas: `ElChalten.jpg` e `torres_del_paine.jpg`.
- Secção “Outros presentes” com três alternativas discretas: Bimby e dois placeholders; nota para avisar quando um presente for comprado.
- IBAN e BIC fornecidos mantidos; linha do titular retirada a pedido do casal.
- Email confirmado: kikaemiguel2027@gmail.com. Telefone opcional; manter o placeholder visível até ser fornecido.
- História: McKinsey, momentos juntos e pedido em Paris/Disneyland; primeiro encontro adiado.
- Planta da Estufa Fria com o percurso a verde da entrada até à Nave.
- Igreja: [Parque Largo de Jesus Telpark](https://www.telpark.com/pt/cidades/lisboa/parque-largo-de-jesus/), junto à igreja; 24h; primeira hora 2 €.
- Estufa Fria: estacionamento na rua na Alameda Edgar Cardoso ou no [Saba Alto do Parque](https://www.saba.pt/pt/estacionamento-lisboa/parque-de-estacionamento-saba-alto-do-parque); Uber até à porta, segundo as indicações do casal.

As tarifas podem mudar até ao casamento. Consulte [TODO.md](TODO.md) para as pendências.

Os textos em itálico antes dos títulos das secções foram retirados. As chaves de conteúdo usam nomes descritivos (por exemplo, `details.title` e `gifts.intro`).
