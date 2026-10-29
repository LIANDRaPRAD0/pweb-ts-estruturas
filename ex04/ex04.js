const formatarReal = (valor) => {
    return `R$ ${valor.toFixed(2)}`;
};
const formatarMeses = (meses) => {
    const anos = Math.floor(meses / 12);
    const mesesRestantes = meses % 12;
    if (anos === 0) {
        return `${mesesRestantes} ${mesesRestantes === 1 ? 'mês' : 'meses'}`;
    }
    if (mesesRestantes === 0) {
        return `${anos} ${anos === 1 ? 'ano' : 'anos'}`;
    }
    return `${anos} ${anos === 1 ? 'ano' : 'anos'} e ${mesesRestantes} ${mesesRestantes === 1 ? 'mês' : 'meses'}`;
};
function calcularMeses(meta, deposito, taxa = 0.5) {
    let saldo = 0;
    let depositado = 0;
    let meses = 0;
    while (saldo < meta) {
        meses++;
        if (meses > 600) {
            break;
        }
        saldo = saldo * (1 + taxa / 100);
        const depositoAtual = meses % 12 === 0 ? deposito * 2 : deposito;
        saldo += depositoAtual;
        depositado += depositoAtual;
    }
    return {
        meses,
        saldo,
        depositado
    };
}
function exibirValor(rotulo, valor, formatar) {
    return `${rotulo}: ${formatar(valor)}`;
}
const campoMeta = document.getElementById('meta');
const campoDeposito = document.getElementById('deposito');
const campoTaxa = document.getElementById('taxa');
const botaoCalcular = document.getElementById('calcular');
const resultado = document.getElementById('resultado');
botaoCalcular.addEventListener('click', () => {
    const meta = campoMeta.valueAsNumber;
    const deposito = campoDeposito.valueAsNumber;
    const taxaTexto = campoTaxa.value.trim();
    if (!Number.isFinite(meta) ||
        !Number.isFinite(deposito) ||
        meta <= 0 ||
        deposito <= 0) {
        resultado.textContent = 'Informe valores positivos';
        resultado.className = 'erro';
        return;
    }
    const simulacao = taxaTexto === ''
        ? calcularMeses(meta, deposito)
        : calcularMeses(meta, deposito, Number(taxaTexto));
    if (taxaTexto !== '' && !Number.isFinite(Number(taxaTexto))) {
        resultado.textContent = 'Informe um rendimento válido';
        resultado.className = 'erro';
        return;
    }
    const atingiuMeta = simulacao.saldo >= meta && simulacao.meses <= 600;
    if (!atingiuMeta) {
        resultado.textContent =
            `Meta inalcançável em 50 anos.\n` +
                exibirValor('Saldo após 600 meses', simulacao.saldo, formatarReal);
        resultado.className = 'erro';
        return;
    }
    const rendimento = simulacao.saldo - simulacao.depositado;
    resultado.textContent =
        `${simulacao.meses} meses (${formatarMeses(simulacao.meses)}).\n` +
            exibirValor('Saldo', simulacao.saldo, formatarReal) + '\n' +
            exibirValor('Depositado', simulacao.depositado, formatarReal) + '\n' +
            exibirValor('Rendimento', rendimento, formatarReal);
    resultado.className = 'sucesso';
});
export {};
//# sourceMappingURL=ex04.js.map