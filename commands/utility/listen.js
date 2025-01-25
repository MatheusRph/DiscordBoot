const { SlashCommandBuilder, CategoryChannel } = require('discord.js');
const { getAnimeList } = require('../../api/mal/mal.js')
const { sendTelegMessage } = require('../../api/telegram/teleg.js')
const Levenshtein = require('levenshtein');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('listen')
        .setDescription('Listen to messages in this channel'),

    async execute(interaction) {
        const channel = interaction.channel;

        await interaction.reply(`Agora ouvindo mensagens no canal: ${channel.name}`);

        const messageListener = async (message) => {

            if (message.channel.id === channel.id) {

                const channelId = '1330240912780955820'; 
                const targetChannel = interaction.client.channels.cache.get(channelId);

                if (targetChannel) {
                    
                    if (message.embeds.length > 0) {
                        
                        console.log("A mensagem contém um embed. Enviando para outro canal.");

                        
                        targetChannel.send("Fazendo requisição ao MAL");

                        const animeUrl = message.embeds[0].url;

                        const animeDiscord = message.embeds[0].title;

                        const regex = /(.*?)\s*(?:\((.*?)\))?\s*- Episódio (\d+)/;

                        const match = animeDiscord.match(regex);

                        const nomeAnimeComParenteses = match ? match[1] : animeDiscord;
                        const episodioNumero = match ? match[3] : null;

                        let nomeAnimeSemParenteses = nomeAnimeComParenteses.replace(/\s?\(.*?\)\s?/g, '').trim();

                        const malChatId = '1330333265701109781'
                        const malChat = interaction.client.channels.cache.get(malChatId);
                        try {

                            const reqmal = await getAnimeList(nomeAnimeSemParenteses, animeUrl);

                            if (reqmal.success) {
                                const malData = reqmal.data; 

                                malChat.send("Requisição ao Mal feita com sucesso")

                                for (let x = 0; x < malData.data.length; x++) {

                                    const animeTitle = malData.data[x]?.node?.title;

                                    const lev = new Levenshtein(nomeAnimeSemParenteses, animeTitle);
                                    const similarityPercentage = (1 - (lev.distance / Math.max(nomeAnimeSemParenteses.length, animeTitle.length))) * 100;

                                    if (similarityPercentage >= 80) {
                                        
                                        const telegId = '1330333151163187220'
                                        const telegChat = interaction.client.channels.cache.get(telegId);
                                        try {
                                            const telgReq = await sendTelegMessage(animeTitle, animeUrl);

                                            if (telgReq.success) {
                                                telegChat.send('Mensagem de notificação enviada ao Telegram!')
                                            } else {
                                                telegChat.send('Mensagem não enviada ao telegram!')
                                            }
                                        } catch (error) {
                                            malChat.send("Falha na requisição ao Telegram");
                                            console.log('Error ao fazer requisição ao Telegram', error);
                                        }
                                    }
                                }

                            } else {
                                malChat.send("Falha na requisição ao MyAnimeList");
                                console.log('Requisição: Not Sucess')
                            }
                        } catch (error) {
                            malChat.send("Falha na requisição ao MyAnimeList");
                            console.log('Error ao fazer requisição ao mal', error);
                        }
                    } else {
                        
                        console.log(`${message.content}`);

                        
                        targetChannel.send(message.content);
                    }
                }

            }
        };        
        interaction.client.on('messageCreate', messageListener);
    },
};
