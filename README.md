# 🏭 Milênio · Chão de Fábrica

Sistema web para acompanhamento da produção e rastreabilidade no chão de fábrica da **Milênio Embalagens**.

O projeto foi desenvolvido como parte do **Desafio de Ideias SENAI**, buscando solucionar problemas relacionados ao registro manual de informações, acompanhamento da produção e acesso às Ordens de Produção (OPs) e desenhos técnicos.

---

## 🎯 Objetivo

Centralizar as principais informações da produção em uma única interface, permitindo que operadores e responsáveis acompanhem o processo de fabricação de forma mais rápida e visual.

A proposta busca reduzir a dependência de:

- Registros manuais em papel
- Consulta de OPs impressas
- Desenhos técnicos físicos
- Atualizações manuais no ERP
- Informações espalhadas entre diferentes locais

---

## 🖥️ Funcionalidades

### 📊 Painel de Produção

O dashboard apresenta uma visão geral da fábrica:

- Quantidade de peças produzidas
- Máquinas em produção
- OPs em andamento
- Tempo de máquinas paradas
- Status individual das máquinas
- Gráfico de produção
- Progresso das Ordens de Produção

### ⚙️ Máquinas

Página destinada ao acompanhamento das máquinas da fábrica.

Cada máquina apresenta:

- Nome e tipo
- Status atual
- OP em produção
- Quantidade produzida
- Situação de produção

Status disponíveis:

🟢 Produzindo  
🔴 Parado

---

### 📋 Ordens de Produção

Área para consulta das OPs cadastradas.

Informações apresentadas:

- Número da OP
- Cliente
- Produto
- Quantidade produzida
- Quantidade planejada
- Prazo
- Status

Também possui filtros e pesquisa.

---

### 📐 Desenhos Técnicos

Centralização dos desenhos relacionados às Ordens de Produção.

A proposta é permitir que o operador consulte o desenho diretamente pelo sistema, evitando a necessidade de utilizar documentos impressos.

---

### 🖨️ Tela da Máquina

Página específica para acompanhar uma máquina em produção.

A tela apresenta:

- Máquina atual
- Status de produção
- OP vinculada
- Cliente
- Produto
- Prazo
- Tinta
- Clichê / Faca
- Ferramental
- Produção atual
- Meta da OP
- Velocidade de produção
- Desenho técnico
- Registro de parada
- Finalização da OP

---

## 🛠️ Tecnologias

O projeto utiliza tecnologias web simples para facilitar a implementação e manutenção:

- HTML5
- CSS3
- JavaScript
- Bootstrap 5

Não é necessário utilizar um framework para executar o protótipo.
