const readline = require('readline');
const fs = require('fs');
const _ = require('lodash');

const rl = readline.createInterface({ // Criar a entrada e saída no console
  input: process.stdin,
  output: process.stdout
});

let palavras = []; //Array vazio palavras para armazenar as Strings digitadas pelo usuário

const recebePalavra = () => {
  rl.question('Digite uma palavra (ou digite "fim" para terminar): ', (resposta) => { //Inicia a função para processar a pergunta ao usuário e recebe a resposta através do callback imposto
    if (resposta === 'fim') { //O usuário permanecerá digitando as palavras até ser digitado fim no console
      palavras = _.uniq(palavras.filter(Boolean)); // Remove duplicatas e palavras nulas com o método filter(Boolean) da biblioteca lodash
      const dados = JSON.stringify(palavras); //Converte o array palavras em uma String JSON com o método stringify() e salva na variável dados
      fs.writeFile('palavras.json', dados, (err) => { //Escreve a string JSON no arquivo "palavras.json"
        if (err) throw err;
        console.log(`As palavras foram salvas no arquivo "palavras.json"`);
        rl.close(); //Fecha o input do console;
      });
    } 
    
    else { //Caso náo seja digitado "fim", a String recebida no input sera adicionada no array palavras e a funcao sera chamada novamente.
      palavras.push(resposta);
      recebePalavra();
    }
  });
};

recebePalavra(); //Chamada da funcao que ira realizar a verificacao necessaria e o salvamento no .JSON
