const fs = require('fs');
const path = require('path');
const { connect } = require("puppeteer-real-browser");

(async () => {
  const { page, browser } = await connect({
    headless: false, // abre o navegador para login manual
    turnstile: true, // lida com proteções como Cloudflare
  });

  console.log("Acesse o site e faça login manualmente.");
  await page.goto("https://chat.deepseek.com", { waitUntil: "networkidle2" });

  // Aguarda você terminar o login
  console.log("Depois de logar, pressione Enter aqui no terminal...");
  process.stdin.once("data", async () => {
    const cookies = await page.cookies();
    fs.writeFileSync(path.join(__dirname, 'cookies.json'), JSON.stringify(cookies, null, 2));
    console.log("Cookies salvos com sucesso em cookies.json");
    await browser.close();
    process.exit(0);
  });
})();
