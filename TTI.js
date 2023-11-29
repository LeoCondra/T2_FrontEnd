const axios = require('axios');
const apiKey = '5e9820182cb91d381baaee523432475b';

// Nome da cidade:
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function consultaCoordenadas(cidade) {
  return new Promise(async (resolve, reject) => {
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${cidade}&limit=1&appid=${apiKey}&lang=pt`;
    try {
      const response = await axios.get(url);
      const coordenadas = response.data[0].lat + ',' + response.data[0].lon;
      console.log('latitude: ' + coordenadas.split(',')[0] + ' \nlongitude: ' + coordenadas.split(',')[1])
      resolve(coordenadas);
    } catch (erro) {
      console.error('erro:', erro.message);
      reject(erro);
    }
  });
}

async function consultaCondicaoAtuais(coordenadas) {
  const url = `http://api.openweathermap.org/data/2.5/weather?lat=${coordenadas.split(',')[0]}&lon=${coordenadas.split(',')[1]}&appid=${apiKey}&units=metric&lang=pt`;
  try {
    const response = await axios.get(url);
    const sensacaoTermica = response.data.main.feels_like;
    const descricao = response.data.weather[0].description;
    console.log('sensação térmica (°C):', sensacaoTermica);
    console.log('descrição:', descricao);
  } catch (erro) {
    console.error('erro:', erro.message);
    throw erro;
  }
}

async function main() {
  try {
    rl.question('Escolha uma cidade: ', async function (cidade) {
      const coordenadas = await consultaCoordenadas(cidade);
      await consultaCondicaoAtuais(coordenadas);
      rl.close();
    });
  } catch (erro) {
    console.error('erro:', erro.message);
  }
}

main();