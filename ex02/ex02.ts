type TipoCliente = 'residencial' | 'rural' | 'comercial' | 'industrial';
type Bandeira = 'verde' | 'amarela' | 'vermelha1' | 'vermelha2';

function tarifaPorKwh(tipo: TipoCliente): number {
  switch (tipo) {
    case 'residencial':
    case 'rural':
      return 0.80;

    case 'comercial':
    case 'industrial':
      return 0.95;

    default:
      return 0;
  }
}

function adicionalBandeira(
  consumo: number,
  bandeira: Bandeira = 'verde'
): number {
  switch (bandeira) {
    case 'verde':
      return consumo * 0;

    case 'amarela':
      return consumo * 0.02;

    case 'vermelha1':
      return consumo * 0.04;

    case 'vermelha2':
      return consumo * 0.08;

    default:
      return 0;
  }
}

function mensagemBandeira(bandeira: Bandeira): string {
  switch (bandeira) {
    case 'verde':
      return 'Condições favoráveis de geração de energia.';

    case 'amarela':
      return 'Condições de geração menos favoráveis.';

    case 'vermelha1':
    case 'vermelha2':
      return 'Condições mais caras de geração. Economize!';

    default:
      return 'Bandeira tarifária desconhecida.';
  }
}

const campoConsumo = document.getElementById('consumo') as HTMLInputElement;
const campoTipo = document.getElementById('tipo') as HTMLSelectElement;
const campoBandeira = document.getElementById('bandeira') as HTMLSelectElement;
const botaoCalcular = document.getElementById('calcular') as HTMLButtonElement;
const resultado = document.getElementById('resultado') as HTMLElement;

botaoCalcular.addEventListener('click', () => {
  const consumo = campoConsumo.valueAsNumber;
  const tipo = campoTipo.value as TipoCliente;
  const bandeira = campoBandeira.value as Bandeira;

  if (!Number.isFinite(consumo) || consumo <= 0) {
    resultado.textContent = 'Informe um consumo válido';
    resultado.className = 'erro';
    return;
  }

  const energia = consumo * tarifaPorKwh(tipo);
  const adicional = adicionalBandeira(consumo, bandeira);
  const total = energia + adicional;
  const mensagem = mensagemBandeira(bandeira);

  resultado.textContent =
    `Energia: R$ ${energia.toFixed(2)}\n` +
    `Bandeira ${bandeira}: R$ ${adicional.toFixed(2)}\n` +
    `Total: R$ ${total.toFixed(2)}\n` +
    mensagem;

  resultado.className = bandeira === 'verde' ? '' : 'alerta';
});

// Resultado: 0. Motivo: o parâmetro padrão é 'verde', cujo adicional é zero.
console.log(adicionalBandeira(100));