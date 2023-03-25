const readline = require('readline');
const fs = require('fs');
const https = require('https')

const rl = readline.createInterface(process.stdin, process.stdout); // Criar a entrada e saída no console

let numQuery = [] //Vetor para armazenar os numeros digitados pelo usuario 
let heroes = []; // Novo vetor para armazenar informações dos heróis

function readInput() { //Função que irá realizar a leitura do input no console
    rl.question('Digite um número entre 1 e 999 ou "fim" para sair: ', (input) => { //Metodo question do readline que irá receber e processar o input com a função callback
      if (input.toLowerCase() === 'fim') { //Verifica se o usuário digitou fim no console para parar a aplicacao
        rl.close(); //Método close que irá encerrar o input atraves do console
        console.log('Números digitados:', numQuery); //Irá exibir os numeros digitados pelo usuario dentro do vetor numQuery
        numQuery.forEach(getdadosHeroi); //ForEach de cada numero dentro do vetor numQuery irá ser passado para a função getdadosHeroi para a requisição HTTP
      } else {
        const num = parseInt(input); //Caso o input seja != fim, a String do console será transformada em inteiro(Int)
        if (isNaN(num) || num < 1 || num > 999) { //Caso o usuário digite algo diferente da instrução será encaminado para o if que encerrará o programa.
          console.error('Entrada inválida. Digite um número entre 1 e 999.');
          process.exit(1);
        }
  
        numQuery.push(num); //Adiciona cada número dentro do vetor numQuery
        readInput(); //Chama novamente a função para continuar adicionando ao vetor.
      }
    });
  }
  

  function getdadosHeroi(number) { //Função para realizar a requisição GET HTTP com a API disponibilizada
    const url = `https://akabab.github.io/superhero-api/api/id/${number}.json`; //URL concatenada com o ID do personagem informado pelo usuário no console
  
    https.get(url, (response) => { //Requisição HTTP GET para a URL especificada, usando o método get do módulo https. 
      let data = ''; 
  
      response.on('data', (chunk) => {
        data += chunk; //Adiciona os dados recebidos a variavel data com o metodo on do objeto response
      });
  
      response.on('end', () => {
        const hero = JSON.parse(data);
        const { id, name, slug, appearance, images } = hero;  //Operador Destructuring {} que quebra e extrai cada informacao de forma individdal do objeto hero (JSON)
  
        const dadosHeroi = { //Inclui as propriedades id, name, slug, appearance e images que foram extraídas do objeto hero usando o destructuring.
          id,
          name,
          slug,
          race: appearance.race,
          image: images.md,
        };
  
        heroes.push(dadosHeroi); //Adiciona o novo objeto dadosHeroi no vetor heroes para ser impresso posteriormente
  
        console.log(dadosHeroi); // Imprime no console informações dos heróis
        heroes.forEach(salvarDadosHeroi); //Encaminha individualmente os objetos para a funcao salvarDadosHeroi que ira retornar um arquivo JSON com estas informacoes.
      });
    })
    
    .on('error', (error) => { //Retorna o erro no console caso a requisicao falhe
      console.error(`Erro ao fazer a requisição para o herói ${number}: ${error}`);
    });
  }

    function salvarDadosHeroi(dadosHeroi) { //Função que irá salvar os dados de cada herói em um arquivo JSON.
        const { id, name } = dadosHeroi; //Extrai as propriedades `id` e `name` do objeto dadosHeroi
        const fileName = `${id}-${name}.json`; //Cria o nome do arquivo concatenando o `id` e `name` separados por hífen e com a extensão `.json`
        const filePath = `./${fileName}`; //Armazena o caminho completo do arquivo (raiz do projeto)
      
        try {
          const fileData = JSON.stringify(dadosHeroi, null, 2); //Armazena os dados do objeto dadosHerois e transforma-o em um JSON com o método stringify() com uma identação de 2 espaços.
      
          if (fs.existsSync(filePath)) { //Verifica se o arquivo já existe usando o método existsSync() do módulo fs.
            fs.writeFile(filePath, fileData, (err) => { //Se o arquivo já existir, a função atualiza o conteúdo do arquivo usando o método writeFile(), caso contrário, cria um novo arquivo usando o mesmo método.
              if (err) {
                console.error(`Erro ao atualizar o arquivo ${fileName}: ${err}`);
              } else {
                console.log(`Arquivo ${fileName} atualizado.`);
              }
            });
          } 
          else {
            fs.writeFile(filePath, fileData, (err) => {
              if (err) {
                console.error(`Erro ao criar o arquivo ${fileName}: ${err}`);
              } else {
                console.log(`Arquivo ${fileName} criado.`);
              }
            });
          }
        } catch (err) {
          console.error(`Erro ao salvar os dados do herói ${name} (${id}): ${err}`); //Em caso de erro ao escrever ou atualizar o arquivo, a função emite uma mensagem de erro no console.
        }
    }
      
    readInput(); //Faz a chamada da função para ler os inputs no console
  

