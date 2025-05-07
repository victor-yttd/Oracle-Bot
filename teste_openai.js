require('dotenv').config();
const axios = require('axios');

(async () => {
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: 'Olá, quem é você?' }],
            max_tokens: 50,
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            }
        });

        console.log("Resposta da IA:", response.data.choices[0].message.content);
    } catch (error) {
        console.error('Erro:', error.response?.data || error.message);
    }
})();
