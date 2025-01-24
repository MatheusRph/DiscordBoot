// Informações do cliente
const client_id = '';
const client_secret = ''; // Se não tiver client_secret, deixe como string vazia
const refresh_token = ''; // O refresh_token obtido previamente

// Codificar client_id e client_secret no formato Base64
const credentials = btoa(`${client_id}:${client_secret}`);

// Construir o corpo da solicitação (body)
const body = new URLSearchParams();
body.append('grant_type', 'refresh_token');
body.append('refresh_token', refresh_token);

// Fazer o POST para o endpoint de token
fetch('https://myanimelist.net/v1/oauth2/token', {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${credentials}`, // Cabeçalho de autenticação HTTP Basic
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: body.toString(),
})
  .then(response => response.json())
  .then(data => {
    if (data.access_token) {
      console.log('New Access Token:', data.access_token);
      console.log('New Refresh Token:', data.refresh_token); // Caso o refresh_token também seja renovado
    } else {
      console.error('Error:', data);
    }
  })
  .catch(error => console.error('Request failed:', error));
