const { messageLink } = require('discord.js')
const { token, chatId } = require('./telegConfig.json')

const apiUrl = `https://api.telegram.org/bot${token}/sendMessage`

exports.sendTelegMessage = async function (texto, url, ep) {

    let message = `
        🎉 *Novo Episódio Lançado!* 🎉
    
*${texto}*
    
*Episódio ${ep}*  
    
[VEJA AGORA](${url})
    
\`Dev for MatheusRph\`
    `; 

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown', // Use 'HTML' para HTML
                disable_web_page_preview: true // Impede a pré-visualização da URL
            })

        });

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        const data = await response.json();

        return { success: true }; // Retorna sucesso se tudo correr bem

    } catch (error) {
        console.error('Erro na requisição', error);
        return { success: false, error: error.message }; // Retorna erro se falhar
    }
}