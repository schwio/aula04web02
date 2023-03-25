const args = process.argv.slice(2); //Pega a somente os numeros inseridos removendo o "npm" e "start" que antecedem o trecho
let soma = 0;

for (let i = 0; i < args.length; i++) {
  const arg = Number(args[i]); //Transforma cada elemento capturado em numero atraves do for e do metodo Number

  if (arg % 2 === 0) { //Verifica se o numero da iteracao e divisivel por 2
    soma += arg; //Adiciona os valores e soma colocando na variavel soma
  }
}

console.log(`Soma dos argumentos divisíveis por 2: ${soma}`);
