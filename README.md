# Site do Casamento — Kika & Miguel

Site estático (HTML/CSS/JS puro) pronto para hospedar no GitHub Pages.

## Preview local no Windows

Importante: neste computador o Python está instalado no Anaconda em `C:\Users\migue\anaconda3`. Para evitar erros de PATH, usa sempre o caminho completo quando quiseres servir a página localmente.

No PowerShell, corre:

```powershell
& "C:\Users\migue\anaconda3\python.exe" -m http.server 8000
```

Depois abre no browser:

```text
http://localhost:8000
```

Se preferires, também podes abrir o Anaconda Prompt e correr simplesmente:

```powershell
python -m http.server 8000
```

## Estrutura

```
index.html          → a página principal do site
rsvp.html            → página separada de RSVP (fora do fluxo principal)
css/styles.css       → estilos (usa CSS variables configuráveis)
js/config.js         → datas, cores, fontes, secções, endpoint do RSVP
js/main.js           → toda a lógica (countdown, RSVP, FAQ, animações) — partilhado pelas duas páginas
backend/Code.gs       → script para colar no Google Apps Script (RSVP → Sheet)
admin/index.html      → editor local de configuração — NUNCA publicar
```

## Publicar no GitHub Pages

1. Criar um repositório novo no GitHub (público ou privado — GitHub Pages funciona com ambos em contas com Pages ativo).
2. Fazer commit de todos os ficheiros deste projeto **exceto a pasta `admin/`** (ver nota de segurança abaixo).
3. Nas definições do repositório → "Pages" → escolher a branch (normalmente `main`) e a pasta raiz.
4. Ao fim de um ou dois minutos, o site fica disponível em `https://<o-vosso-utilizador>.github.io/<nome-do-repo>/`.
5. Mais tarde, quando comprarem o domínio, basta configurar um registo `CNAME` a apontar para esse endereço — o GitHub tem um guia próprio para "custom domain".

**Nota sobre a pasta `admin/`:** é só uma ferramenta de desenvolvimento (edita
texto de configuração para copiarem para `config.js`). Não tem nenhuma
informação sensível, mas por ser só para vosso uso, o mais limpo é deixá-la
de fora do repositório publicado, ou pelo menos fora de qualquer link do
site. Podem mantê-la num repositório/pasta separada apenas no vosso
computador.

## Ligar o RSVP ao Google Sheets (sem expor credenciais)

Como pediram: a única coisa que o site publicado conhece é o **URL público**
do Web App do Apps Script — nunca uma password, chave de API, ou token de
acesso à vossa conta Google. O script corre do lado do Google, "como vocês",
e só sabe fazer uma coisa: adicionar uma linha à Sheet. Não há nenhum
endpoint de leitura, por isso mesmo sendo o URL público, ninguém consegue
ler a lista de convidados através dele.

Passos:

1. Criar uma Google Sheet nova (ex.: "Casamento — RSVPs").
2. Extensões → Apps Script.
3. Apagar o código de exemplo e colar o conteúdo de `backend/Code.gs`.
4. Implementar → Nova implementação → tipo "Aplicação Web".
   - Executar como: **Eu**
   - Quem tem acesso: **Qualquer pessoa**
5. Copiar o URL gerado (termina em `/exec`).
6. Colar esse URL em `js/config.js`, no campo `rsvpEndpoint`.
7. Fazer commit/push, testar uma submissão no site publicado, e confirmar que aparece uma linha na Sheet.

Sempre que alterarem `Code.gs`, é preciso criar uma **nova versão** da
implementação (Implementar → Gerir implementações → editar → nova versão)
para as alterações entrarem em vigor.

## Editar o conteúdo e o design

- **Texto** (títulos, parágrafos, perguntas do FAQ, etc.): editar diretamente `index.html` (página principal) ou `rsvp.html` (RSVP) — está tudo em português, organizado por secção com comentários.
- **A Nossa História**: está estruturada como 4 momentos sequenciais em `index.html` — McKinsey (1 foto), Primeiro Encontro (1 foto), A Divertirmo-nos (3 fotos), O Pedido (4 fotos). O texto do "Primeiro Encontro" é só um placeholder — substituam quando tiverem a história real.
- **Cores, fontes, datas, secções visíveis**: editar `js/config.js` à mão, ou abrir `admin/index.html` localmente (ex.: dando duplo-clique no ficheiro) para uma interface simples que gera o novo conteúdo de `config.js` para copiarem.
- **Prazo de RSVP**: já está definido para **30 de novembro de 2026** em `js/config.js` (`rsvpDeadline`). Depois dessa data, o formulário em `rsvp.html` é automaticamente substituído pela mensagem "Respostas fechadas".

## Mapas / planta da Estufa Fria — para desenharem o caminho

Não encontrei uma planta oficial "para imprimir" do jardim, mas estas fontes
dão uma boa base visual para marcarem o percurso:

- Vista de satélite/mapa da zona (a melhor base para desenhar por cima): https://www.google.com/maps/place/Estufa+Fria+de+Lisboa
- Página oficial da Câmara Municipal de Lisboa sobre a Estufa Fria (pode ter uma planta ou indicações mais recentes): pesquisar "Estufa Fria" em lisboa.pt
- Vista geral do Parque Eduardo VII com a localização da Estufa Fria assinalada: https://aviewoncities.com/lisbon/parqueeduardovii.htm

Assim que tiverem o caminho marcado (mesmo que seja uma foto de ecrã com uma
linha desenhada por cima), enviem-me e eu transformo isso num gráfico
simples para a secção de FAQ.

## Placeholders ainda por substituir

- Fotografias (hero, "A Nossa História", galeria) — atualmente blocos com padrão geométrico, claramente marcados como placeholder.
- IBAN / dados bancários na secção "Presentes".
- As 5 ideias de presente (nome, descrição, eventualmente um link).
- Email e telefone de contacto no rodapé da secção "Contacto".
- `rsvpEndpoint` em `config.js`, depois de implementarem o Apps Script.

## Pendente da vossa parte (research a confirmar)

Os preços e horários de estacionamento mencionados no FAQ (perto da Igreja
das Mercês e da Estufa Fria) são uma pesquisa preliminar — convém confirmar
os valores atuais antes de considerarem essa secção como definitiva.
