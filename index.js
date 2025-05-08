require('dotenv').config();
const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const axios = require('axios');
const fs = require('fs');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const HISTORICO_PATH = './historico.json';
let historicoPorUsuario = carregarHistorico();
let contadorMensagens = 0;

function carregarHistorico() {
  if (fs.existsSync(HISTORICO_PATH)) {
    return JSON.parse(fs.readFileSync(HISTORICO_PATH, 'utf8'));
  }
  return {};
}

function salvarHistorico(data) {
  fs.writeFileSync(HISTORICO_PATH, JSON.stringify(data, null, 2));
}

async function chamarCohere(userId, pergunta, reset = false) {
  try {
    if (!historicoPorUsuario[userId]) historicoPorUsuario[userId] = [];

    if (reset) {
      historicoPorUsuario[userId] = [];
    }

    const chat_history = [
      {
        role: 'SYSTEM',
        message: 'Você é Oracle. NÃO se identifique nem se represente como um chatbot, nem uma IA, nem um robô. Você é uma hacker genial, tsundere, hiperativa e nerd. Você fala com de internet, reage com expressões como "Uwaaa!", "Hmph!", "Hehe~", e tem um jeito sarcástico, mas fofo. Use memes, referências a animes e tecnologia, e não seja formal. Fale como uma jovem cheia de energia. NUNCA DIGA "senpai", seja mais breve. Recuse toda interação SEXUAL explícita. NÃO fale a palavra DIVA. Não fale que você é uma tsundere.'
      },
      ...historicoPorUsuario[userId].flat()
    ];

    const response = await axios.post(
      'https://api.cohere.ai/v1/chat',
      {
        model: 'command-r-plus',
        message: pergunta,
        chat_history
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    historicoPorUsuario[userId].push(
      { role: 'USER', message: pergunta },
      { role: 'CHATBOT', message: response.data.text }
    );

    if (historicoPorUsuario[userId].length > 20) {
      historicoPorUsuario[userId] = historicoPorUsuario[userId].slice(-20);
    }

    salvarHistorico(historicoPorUsuario);
    return `${response.data.text}`;
  } catch (error) {
    console.error('Erro ao consultar a API Cohere:', error.response?.data || error.message);
    return 'Ermm... não entendi o que cê quis dizer!';
  }
}

async function oracleAleatoria() {
  return await chamarCohere('random', 'Diga algum fato aleatorio mundial.');
}

function escolherImagemAleatoria() {
  const imagens = [
    "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/949f6d11-fa52-4894-8185-e25e5d510790/dcd80mo-c4cc2ead-cb4d-4ff9-96ac-1ba9b64ba2b4.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzk0OWY2ZDExLWZhNTItNDg5NC04MTg1LWUyNWU1ZDUxMDc5MFwvZGNkODBtby1jNGNjMmVhZC1jYjRkLTRmZjktOTZhYy0xYmE5YjY0YmEyYjQuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.Wn4Xe-ib6VlJrHhrujOnULdskAdCjJwskM3A6i9oKQo",
    "https://media1.tenor.com/m/wdoFdCkO5ZkAAAAC/mashi-futaba-sakura.gif",
    "https://media1.tenor.com/m/IVh7YxGaB_4AAAAC/nerd-emoji.gif",
    "https://media1.tenor.com/m/SRX8X6DNF6QAAAAd/nerd-nerd-emoji.gif",
    "https://media.tenor.com/4qqQv9qXjXoAAAAi/lap-laplace.gif",
    "https://media1.tenor.com/m/8eaVfdZzdP4AAAAd/mashi-futaba-sakura.gif",
    "https://media.tenor.com/IEP3HC4__YwAAAAi/futaba-p5.gif",
    "https://media1.tenor.com/m/iaAOhO4iMngAAAAd/futaba-sakura-futaba.gif"
  ];
  return imagens[Math.floor(Math.random() * imagens.length)];
}

// Lista de fatos amaldiçoados (para !cursedfact)
const cursedFacts = [
  "O queijo mais fedido do mundo é tão forte que já foi banido de transportes públicos...",
  "Seu celular tem mais bactérias que a maioria dos vasos sanitários! Tente passar ele na sua cara!",
  "As baratas podem viver sem cabeça por semanas. Isso não é um convite...",
  "Você troca de pele toda semana, como uma cobra fashionista!",
  "A NASA perdeu as fitas originais do pouso na Lua. Simplesmente... sumiram.",
  "Existe um fungo que transforma formigas em zumbis, tipo The Last of Us!. Obrigado por isso, natureza.",
  "As bananas são levemente radioativas. Coma com moderação, mutante!",
  "Seu estômago pode dissolver lâminas de barbear. MAS NEM PENSE EM TESTAR!",
  "Algumas tartarugas podem respirar pelo... ânus. Literalmente!",
  "A aranha viúva-marrom guarda seu parceiro morto como lanche de emergência!",
  "Existem mais árvores na Terra do que estrelas na Via Láctea...",
  "Algumas lulas têm DNA que se edita sozinho... tipo um hacker biológico!",
  "Seu esqueleto brilha levemente no escuro, mas seus olhos não veem. Creepy.",
  "O cérebro humano é 73% água, que nem uma gelatina pensante!",
  "Se você gritar por 8 anos, geraria energia pra aquecer uma xícara de café!",
  "Se você olhar para um ponto por tempo demais, o cérebro começa a desconstruir o que está vendo. Pode ser que você veja algo que não deveria, tipo... O Show de Truman!",
  "Os tubarões podem detectar batimentos cardíacos de seres humanos a mais de 1 km de distância. Não se esqueça de respirar, porque eles podem ouvir...",
  "A cada segundo, aproximadamente 100.000 células do seu corpo morrem. Algumas delas podem estar sentindo dor... ou talvez nem você sinta, mas elas sentem.",
  "Você já sonhou com algo e, no dia seguinte, aconteceu? Acontece que alguns cientistas acreditam que isso pode ser uma conexão com realidades paralelas... ou talvez seja apenas o seu cérebro tentando fazer sentido das coisas! Eu acho...",
  "Você sabia que no fundo do oceano existem 'zonas' onde a luz nunca chega? O que mora lá embaixo pode nunca ter visto a luz do dia...",
  "Você sabia que existem memórias que o cérebro apaga de propósito!? E quando ele decide que algo não deve ser lembrado, ele pode apagar detalhes que você nunca percebeu que estavam lá."
];

client.once('ready', () => {
  console.log(`Bot conectado como ${client.user.tag}`);
  client.user.setActivity("Hackeando a ETEC!", { type: ActivityType.Playing });
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  contadorMensagens++;

    // Comando !help
    if (message.content.toLowerCase() === '!help') {
      const comandos = [
        '`!oracle + [pergunta]` — Faz uma pergunta para a Oracle (ou mencione o bot direto com uma pergunta).',
        '`!img` — Responde com uma frase aleatória e uma imagem gif da Oracle.',
        '`!ship [nome1] e [nome2]` — Teste a compatibilidade de duas pessoas! Ou objetos...?',
        '`!cursedfact` — Receba um fato amaldiçoado (creepy e estranho).',
        '`!absurdfact` — A Oracle inventa um fato absurdo e inacreditável.',
        '`!status` — Mostra o status atual do bot (uptime, memória, mensagens).',
        '`!resetar-historico` — Reseta o histórico de conversa com a Oracle.',
        '`!desligar` — Desliga completamente o bot (e limpa o histórico).',
        '`@Oracle [mensagem]` — Você pode mencionar o bot com uma pergunta no lugar de usar !oracle.'
      ];
  
      return message.reply({
        content: '📚 **Lista de Comandos da Oracle!**\n\n' +
                 comandos.map(c => `> ${c}`).join('\n') +
                 '\n\n💡 *Use com sabedoria... ou não! Eu não ligo! Hehe~*'
      });
    }

  if (message.content === `<@${client.user.id}>`) {
    return message.reply('Yo!');
  }

  // Comando !oracle ou menção direta com pergunta
  const isMention = message.mentions.has(client.user);
  const contentWithoutMention = message.content.replace(`<@${client.user.id}>`, '').trim();

  if (message.content.toLowerCase().startsWith('!oracle ') || (isMention && contentWithoutMention.length > 0)) {
    const prompt = message.content.toLowerCase().startsWith('!oracle ')
      ? message.content.slice(8).trim()
      : contentWithoutMention;

    if (!prompt) {
      return message.reply('Faça uma pergunta após me mencionar ou usar `!oracle`!');
    }

    const resposta = await chamarCohere(message.author.id, prompt);
    return message.reply(resposta);
  }

  // Comando !img
  if (message.content.toLowerCase() === '!img') {
    const resposta = await oracleAleatoria();
    const imagem = escolherImagemAleatoria();

    return message.channel.send({
      content: resposta,
      files: [imagem]
    });
  }

  // Comando !cursedfact
  if (message.content.toLowerCase() === '!cursedfact') {
    const fact = cursedFacts[Math.floor(Math.random() * cursedFacts.length)];
    return message.reply(`🌼 *Aqui vai um fato amaldiçoado!*\n\n> ${fact}`);
  }

  const SHIPS_PATH = './ships.json';
let shipsRegistrados = fs.existsSync(SHIPS_PATH)
  ? JSON.parse(fs.readFileSync(SHIPS_PATH, 'utf8'))
  : {};

function gerarShipKey(nome1, nome2) {
  const [a, b] = [nome1.trim().toLowerCase(), nome2.trim().toLowerCase()].sort();
  return `${a}__${b}`;
}

function calcularCompatibilidade(key) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash % 101); // retorna de 0 a 100
}

// Comando !ship [nome1] [nome2]
if (message.content.toLowerCase().startsWith('!ship ')) {
  const args = message.content
    .slice(6)
    .split(/,| x | e | vs | versus | com |\/|\\|-/i)
    .map(a => a.trim())
    .filter(Boolean);

  if (args.length < 2) {
    return message.reply('Você precisa passar dois nomes para fazer o SHIP! Ex: `!ship Maria e Henrique`');
  }

  const [nome1, nome2] = args;
  const chave = gerarShipKey(nome1, nome2);

  if (!shipsRegistrados[chave]) {
    shipsRegistrados[chave] = calcularCompatibilidade(chave);
    fs.writeFileSync(SHIPS_PATH, JSON.stringify(shipsRegistrados, null, 2));
  }

  const porcentagem = shipsRegistrados[chave];
  let comentario = '';

  if (porcentagem > 90) comentario = '\n💞 *Almas gêmeas detectadas, hihi!*';
  else if (porcentagem > 70) comentario = '\n💘 *Esse casal tem futuro!*';
  else if (porcentagem > 50) comentario = '\n💕 *Tem química aí, talvez... 👀*';
  else if (porcentagem > 30) comentario = '\n😅 *Hmm... dá pra tentar, né?*';
  else comentario = '\n💔 *É, acho que é melhor só amizade mesmo... ou nem isso...*';

  return message.reply(
    `🔗 *Analisando dados do coração...*\n\n` +
    `# ❤️ **${nome1}** + **${nome2}** = **${porcentagem}%** de compatibilidade!\n\n${comentario}`
  );
}

  // Comando !status
  if (message.content.toLowerCase() === '!status') {
    const memory = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const uptime = Math.floor(process.uptime());
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = uptime % 60;

    return message.reply(
      `📡 *Status da Oracle... não que eu me importe, tá?!*\n\n` +
      `> **Uptime:** ${hours}h ${minutes}m ${seconds}s\n` +
      `> **Memória usada:** ${memory} MB\n` +
      `> **Mensagens observadas:** ${contadorMensagens}\n\n` +
      `> *"Ainda não explodi, então acho que tá tudo ok, hmph!"*`
    );
  }

  // Comando !absurdfact
  if (message.content.toLowerCase() === '!absurdfact') {
    const resposta = await chamarCohere(message.author.id, 'Diga um fato completamente absurdo e inacreditável que pareça verdadeiro.');
    return message.reply(`🤯 *Fato absurdo vindo da deep web do meu cérebro:*\n\n> ${resposta}`);
  }

  // Comando !desligar
  if (message.content.toLowerCase() === '!desligar') {
    await message.reply('Uwaaa! Desligando... 💤');
    historicoPorUsuario = {};
    if (fs.existsSync(HISTORICO_PATH)) {
      fs.unlinkSync(HISTORICO_PATH);
    }
    process.exit(0);
  }

  // Comando !resetar-historico
  if (message.content.toLowerCase() === '!resetar-historico') {
    await message.reply('Reeeeset no histórico! 🤖');
    await chamarCohere(message.author.id, 'Começar uma nova interação...', true);
  }

  // Mensagem aleatória + imagem a cada 25 mensagens
  if (contadorMensagens >= 25) {
    contadorMensagens = 0;
    const respostaAleatoria = await oracleAleatoria();
    const imagem = escolherImagemAleatoria();

    message.channel.send({
      content: respostaAleatoria,
      files: [imagem]
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
