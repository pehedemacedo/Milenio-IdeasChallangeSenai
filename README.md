# Milênio — Chão de Fábrica (versão simples)

Protótipo em **HTML, CSS e JavaScript puro**, com Bootstrap 5. Não usa React, build, banco de dados nem servidor de aplicação. Os dados da produção ficam no `localStorage` do navegador.

## Como abrir

1. Extraia o ZIP.
2. Para abrir no mesmo computador, execute `python3 -m http.server 8000` na pasta e acesse `http://localhost:8000`.
3. Para ler crachás pela câmera em outro dispositivo, use um endereço **HTTPS** e permita o acesso à câmera. O vídeo é processado no navegador e não é enviado para um servidor.

## Login por QR de crachá

A tela inicial mostra o leitor. Clique em **Escanear crachá** e aponte a câmera para um QR cujo conteúdo esteja cadastrado no array `BADGES` em `badge-auth.js`.

- **Supervisor — Ana Souza:** acesso a todas as telas e ações.
- **Operador — Carlos Lima:** telas de operação e apontamentos; sem acesso a cadastros, ajustes, alertas, etiquetas administrativas ou ponte para máquinas.

Os dois conteúdos de exemplo configurados no código são `MILENIO|CRACHA|SUP-001` e `MILENIO|CRACHA|OP-001`. Para usar crachás físicos existentes, troque esses valores pelos conteúdos reais dos QRs e ajuste nome, identificador e `role`. A correspondência é exata. A sessão vale para a aba atual; use **Sair** para trocar de perfil.

**Limite importante:** este login demonstra o fluxo, não é autenticação segura. Como o projeto é estático, os códigos e perfis ficam no navegador e as restrições podem ser contornadas. Para uso real, os identificadores precisam ser validados por servidor.

## Acessibilidade e visualização

Depois de entrar, clique em **Ajustes**. Na seção **Preferências de visualização**, os controles podem ser usados imediatamente, sem precisar salvar os ajustes de produção:

- **Claro / Escuro:** troca o tema do painel.
- **− / +:** diminui ou aumenta o tamanho do conteúdo em passos de 10%, entre 80% e 140%.
- **Daltonismo:** ativa uma paleta alternativa, usando cores mais distinguíveis e mantendo os rótulos de status.

As preferências são salvas neste navegador. O módulo está em `accessibility.js` e usa a chave local `milenio-accessibility-v1`.

## Telas e funções

- **Painel:** indicadores, estado das máquinas, gráfico demonstrativo e progresso das OPs.
- **OEE:** disponibilidade, performance, qualidade e OEE por máquina, em uma janela móvel de 8 horas.
- **Ordens de produção:** filtros, criação de OP (supervisor), iniciar/pausar/retomar e registro de peças.
- **Máquinas:** cadastro (supervisor), status e registro de produção, paradas e refugo.
- **Produtos e desenhos:** revisão vigente/histórica, visualização e envio demonstrativo (supervisor).
- **Paradas e refugo:** motivos, retomada, duração e peças descartadas.
- **Alertas e ajustes:** avisos e parâmetros (supervisor).
- **Etiquetas QR:** etiquetas para máquinas e OPs (supervisor).
- **Ponte para máquinas:** simulação local, sem conexão real.

O OEE usa novos apontamentos de produção com horário, paradas e refugos registrados dentro da janela. Disponibilidade = tempo operando / planejado; performance = peças produzidas / capacidade nominal; qualidade = (produzidas − refugo) / produzidas. Os contadores demonstrativos que já existiam não têm histórico de horário e, por isso, não entram no cálculo; antes de novos apontamentos, o indicador aparece como **—**.

A câmera requer permissão e HTTPS ou `localhost`; usa jsQR distribuído localmente (`jsQR-LICENSE.txt`). As etiquetas de máquinas/OP usam QRCode.js (`qrcodejs-LICENSE.txt`).

## Limites da demonstração

A ponte não envia dados a equipamentos. Não há banco compartilhado, servidor de usuários, integração ERP, sensores nem autenticação real. Para limpar os dados operacionais, remova `milenio-chao-fabrica-v1` do armazenamento do site. Para sair, use **Sair** na barra superior.
