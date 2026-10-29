function calcularTotal(valor, parcelas) {
    if (parcelas <= 3) {
        return valor;
    }
    return valor * 1.02 ** parcelas;
}
function simularParcelamento(preco, entrada) {
    let financiado = preco;
    if (typeof entrada !== 'undefined') {
        financiado = preco - entrada;
    }
    let linhas = '';
    for (let parcelas = 1; parcelas <= 12; parcelas++) {
        if ([7, 8, 9, 11].includes(parcelas)) {
            continue;
        }
        const total = calcularTotal(financiado, parcelas);
        const valorParcela = total / parcelas;
        if (valorParcela < 50) {
            break;
        }
        const juros = parcelas <= 3 ? 'sem juros' : '2% a.m.';
        linhas += `
      <tr>
        <td>${parcelas}x</td>
        <td>R$ ${valorParcela.toFixed(2)}</td>
        <td>R$ ${total.toFixed(2)}</td>
        <td>${juros}</td>
      </tr>
    `;
    }
    return linhas;
}
const campoPreco = document.getElementById('preco');
const campoEntrada = document.getElementById('entrada');
const botaoSimular = document.getElementById('simular');
const resultado = document.getElementById('resultado');
const tabelaParcelas = document.getElementById('parcelas');
botaoSimular.addEventListener('click', () => {
    const preco = campoPreco.valueAsNumber;
    const textoEntrada = campoEntrada.value.trim();
    tabelaParcelas.innerHTML = '';
    if (!Number.isFinite(preco) || preco <= 0) {
        resultado.textContent = 'Informe um preço válido.';
        resultado.className = 'erro';
        return;
    }
    const entrada = textoEntrada === '' ? undefined : Number(textoEntrada);
    if (typeof entrada !== 'undefined' &&
        (!Number.isFinite(entrada) || entrada < 0)) {
        resultado.textContent = 'Informe uma entrada válida.';
        resultado.className = 'erro';
        return;
    }
    if (typeof entrada !== 'undefined' && entrada >= preco) {
        resultado.textContent =
            'A entrada cobre o valor total. Não há parcelas.';
        resultado.className = 'alerta';
        return;
    }
    const financiado = typeof entrada === 'undefined' ? preco : preco - entrada;
    resultado.textContent = `Valor financiado: R$ ${financiado.toFixed(2)}`;
    resultado.className = 'sucesso';
    if (typeof entrada === 'undefined') {
        tabelaParcelas.innerHTML = simularParcelamento(preco);
    }
    else {
        tabelaParcelas.innerHTML = simularParcelamento(preco, entrada);
    }
});
export {};
//# sourceMappingURL=ex03.js.map