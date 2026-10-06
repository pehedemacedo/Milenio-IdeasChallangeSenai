// ===== Dados (troque por sua API/banco) =====
const dias = [
  { dia: 'Seg',        valor: 8200 },
  { dia: 'Ter',        valor: 9400 },
  { dia: 'Qua',        valor: 10100 },
  { dia: 'Qui',        valor: 7600 },
  { dia: 'Sex',        valor: 11200 },
  { dia: 'Sáb (hoje)', valor: 12480, hoje: true },
  { dia: 'Dom',        valor: 0 },
];

const ALTURA_MAX = 210; // altura máxima da barra em px

const fmt = n => n.toLocaleString('pt-BR');

function desenharGrafico(dados) {
  const chart  = document.getElementById('chart');
  const labels = document.getElementById('labels');
  const maior  = Math.max(...dados.map(d => d.valor)) || 1;

  chart.innerHTML = dados.map(d => `
    <div class="bar-col">
      ${d.valor ? `<div class="bar-value">${fmt(d.valor)}</div>` : ''}
      <div class="bar ${d.hoje ? 'today' : ''}"
           data-h="${(d.valor / maior) * ALTURA_MAX}"
           style="height:0"></div>
    </div>`).join('');

  labels.innerHTML = dados.map(d => `<span>${d.dia}</span>`).join('');

  // animação de entrada
  requestAnimationFrame(() => {
    chart.querySelectorAll('.bar').forEach(b => {
      b.style.height = b.dataset.h + 'px';
    });
  });
}

desenharGrafico(dias);

// Filtro por máquina: aqui você buscaria os dados filtrados e chamaria
// desenharGrafico(novosDados)
document.getElementById('filtro').addEventListener('change', e => {
  console.log('Máquina selecionada:', e.target.value);
});