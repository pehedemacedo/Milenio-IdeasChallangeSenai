# Milênio — Chão de Fábrica (versão simples)

Protótipo em **HTML, CSS e JavaScript puro**, com Bootstrap 5. Não usa React, build, banco de dados nem servidor de aplicação. Os dados da produção ficam no `localStorage` do navegador.

## Como abrir

1. Extraia o ZIP.
2. Para testar no mesmo computador, abra um terminal na pasta e execute `python3 -m http.server 8000`; depois acesse `http://localhost:8000`.
3. Para ler crachás pela câmera em outro dispositivo, abra o site por um endereço **HTTPS** e permita o acesso à câmera. O vídeo é processado no navegador e não é enviado para um servidor.

## Login por QR de crachá

A tela inicial agora mostra somente o leitor. Clique em **Escanear crachá** e aponte a câmera para um QR cujo conteúdo esteja cadastrado no array `BADGES` em `badge-auth.js`. O perfil é escolhido pelo crachá encontrado:

- **Supervisor — Ana Souza:** acesso a todas as telas e ações.
- **Operador — Carlos Lima:** painel, OPs, máquinas, desenhos em consulta e apontamento de produção, paradas e refugo. Não tem acesso a criação/edição de cadastros, ajustes, alertas, etiquetas administrativas ou ponte para máquinas.

Os dois conteúdos de exemplo configurados no código são `MILENIO|CRACHA|SUP-001` e `MILENIO|CRACHA|OP-001`. Eles não são exibidos na tela. Para usar os crachás físicos existentes, substitua esses valores pelos conteúdos reais dos QR Codes e ajuste nome, identificador e `role` correspondentes. O leitor exige correspondência exata com o valor cadastrado.

A sessão vale para a aba atual; use **Sair** para trocar de perfil.

**Limite importante:** este login é uma demonstração de fluxo e de telas, não uma autenticação segura. Como o projeto é estático em HTML/CSS/JS, a lista e os perfis ficam visíveis no código do navegador e as restrições podem ser contornadas. Para uso real, o QR deve carregar um identificador opaco, validado por servidor, que também confira o usuário, perfil, validade e revogação do crachá.

## Telas e funções

- **Painel:** indicadores, estado das máquinas, gráfico demonstrativo e progresso das OPs.
- **Ordens de produção:** filtros, criação de OP (supervisor), iniciar/pausar/retomar e registro de peças.
- **Máquinas:** cadastro (supervisor), status e registro de produção, paradas e refugo.
- **Produtos e desenhos:** revisão vigente/histórica, visualização; edição e envio demonstrativo reservados ao supervisor.
- **Paradas e refugo:** motivos, retomada, duração e peças descartadas.
- **Alertas e ajustes:** avisos e parâmetros (supervisor).
- **Etiquetas QR:** etiquetas para máquinas e OPs (supervisor).
- **Ponte para máquinas:** simulação local de envio de desenho e medidas, sem conexão real.

A câmera requer permissão do navegador e um contexto seguro (`https://` ou `localhost`). A leitura usa jsQR distribuído localmente (`jsQR-LICENSE.txt`); as etiquetas de máquinas/OP usam QRCode.js (`qrcodejs-LICENSE.txt`).

## Limites da demonstração

A ponte não envia dados a equipamentos. A mensagem “Simulação concluída” e o status `SIMULATED_ONLY` são apenas demonstrativos. Não há banco compartilhado, servidor de usuários, integração ERP, sensores, nem autenticação real.

Para limpar os dados operacionais de demonstração, remova a chave `milenio-chao-fabrica-v1` do armazenamento do site. Para sair da sessão ou alternar perfil, use **Sair** na barra superior.
