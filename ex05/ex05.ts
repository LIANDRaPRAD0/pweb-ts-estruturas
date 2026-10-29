type Formatador = (valor: number) => string;

function lerPrecos(texto: string): { precos: number[]; ignorados: number } {
  const linhas = texto.split('\n');
  const precos: number[] = [];
  let ignorados = 0;

  for (const linha of linhas) {
    if (precos.length >= 20) {
      break;
    }

    const textoPreco = linha.trim();

    if (textoPreco === '') {
      continue;
    }

    const preco = Number(textoPreco.replace(',', '.'));

    if (!Number.isFinite(preco) || preco <= 0) {
      ignorados++;
      continue;
    }

    precos.push(preco);
  }

  return { precos, ignorados };
}

function somarItens(...precos: number[]): number {
  let total = 0;

  for (const preco of precos) {
    total += preco;
  }

  return total;
}

function calcularDesconto(total: number, percentual: number): number;
function calcularDesconto(total: number, cupom: string): number;

function calcularDesconto(
  total: number,
  desconto: number | string
): number {
  if (typeof desconto === 'number') {
    return total * desconto / 100;
  }

  switch (desconto.toUpperCase()) {
    case 'BEMVINDO':
      return total * 0.10;

    case 'PROMO20':
      return total * 0.20;

    case 'MENOS15':
      return total >= 100 ? 15 : 0;

    default:
      return 0;
  }
}

const formatarReal: Formatador = (valor: number): string => {
  return `R$ ${valor.toFixed(2)}`;
};

const campoItens = document.getElementById('itens') as HTMLTextAreaElement;
const campoCupom = document.getElementById('cupom') as HTMLInputElement;
const campoFidelidade = document.getElementById('fidelidade') as HTMLInputElement;
const botaoFechar = document.getElementById('fechar') as HTMLButtonElement;
const resultado = document.getElementById('resultado') as HTMLElement;

botaoFechar.addEventListener('click', () => {
  const leitura = lerPrecos(campoItens.value);
  const precos = leitura.precos;
  const ignorados = leitura.ignorados;

  if (precos.length === 0) {
    resultado.textContent = 'Nenhum item válido';
    resultado.className = 'erro';
    return;
  }

  const subtotal = somarItens(...precos);
  const cupom = campoCupom.value.trim();
  let descontoCupom = 0;
  let mensagemCupom = '';

  if (cupom !== '') {
    const cupomMaiusculo = cupom.toUpperCase();

    descontoCupom = calcularDesconto(subtotal, cupomMaiusculo);

    const cupomValido =
      cupomMaiusculo === 'BEMVINDO' ||
      cupomMaiusculo === 'PROMO20' ||
      (cupomMaiusculo === 'MENOS15' && subtotal >= 100);

    if (cupomValido) {
      mensagemCupom =
        `Cupom ${cupomMaiusculo}: -${formatarReal(descontoCupom)}\n`;
    } else {
      mensagemCupom = 'Cupom inválido ou não aplicável\n';
    }
  }

  const aposCupom = subtotal - descontoCupom;
  let descontoFidelidade = 0;

  if (campoFidelidade.checked) {
    descontoFidelidade = calcularDesconto(aposCupom, 5);
  }

  const total = aposCupom - descontoFidelidade;

  let mensagem = `Itens: ${precos.length}`;

  if (ignorados > 0) {
    mensagem += ` (${ignorados} ${ignorados === 1 ? 'linha ignorada' : 'linhas ignoradas'})`;
  }

  mensagem += `\nSubtotal: ${formatarReal(subtotal)}\n`;
  mensagem += mensagemCupom;

  if (campoFidelidade.checked) {
    mensagem += `Fidelidade (5%): -${formatarReal(descontoFidelidade)}\n`;
  }

  mensagem += `Total a pagar: ${formatarReal(total)}`;

  resultado.textContent = mensagem;
  resultado.className = 'sucesso';
});