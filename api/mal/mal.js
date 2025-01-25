const { token, client_id, redirect_uri, state, client_secret, authorization_code, code_verifier } = require('./malConfig.json');
const credentials = btoa(`${client_id}:${client_secret}`);
const apiUrl = "https://api.myanimelist.net/v2/users/@me/animelist?limit=100&status=watching"

exports.getAnimeList = async function(){
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `${token}`, // Cabeçalho de autenticação HTTP Basic
            }
        });

        if (!response.ok) {
            throw new Error(`Erro: ${response.status} - ${response.statusText}`);
        } else {
            const json = await response.json(); // Espera a conversão para JSON
            return { success: true, data: json }; // Retorna os dados ao chamar a função
        }

    } catch (error) {
        console.error('Erro ao buscar os animes:', error.message);
        return { success: false, error: error.message }; // Retorna erro se falhar
    }
}