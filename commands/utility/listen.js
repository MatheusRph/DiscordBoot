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

                    targetChannel.send('Chegou uma mensagem!');

                    if (message.embeds.length > 0) {

                        targetChannel.send('A mensagem contem um embed...')

                        message.embeds.forEach(embed => {
                            targetChannel.send({ embeds: [embed] });
                        });
                        targetChannel.send('Inciando processos...')
                        targetChannel.send("Fazendo requisição ao My Anime List!");


                        const animeUrl = message.embeds[0].url;
                        const animeDiscord = message.embeds[0].title;

                        console.log('Title', animeDiscord);

                        for (let x = 0; x < message.embeds.length; x++) {
                            const testeTitle = message.embeds[x].title;
                            console.log('Title do embed' + x, testeTitle);
                        }

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

                                const telegId = '1330333151163187220'
                                const telegChat = interaction.client.channels.cache.get(telegId);

                                const foundMatch = false;

                                for (let x = 0; x < malData.data.length; x++) {

                                    const animeTitle = malData.data[x]?.node?.title;

                                    const lev = new Levenshtein(nomeAnimeSemParenteses, animeTitle);
                                    const similarityPercentage = (1 - (lev.distance / Math.max(nomeAnimeSemParenteses.length, animeTitle.length))) * 100;

                                    if (similarityPercentage >= 80) {

                                        try {
                                            const telgReq = await sendTelegMessage(animeTitle, animeUrl);

                                            if (telgReq.success) {
                                                telegChat.send(`Mensagem de notificação para ${animeTitle} enviada ao Telegram!`);
                                                foundMatch = true; // Marca que encontramos uma correspondência
                                                break; // Interrompe o loop assim que encontra a primeira correspondência
                                            } else {
                                                telegChat.send(`Mensagem para ${animeTitle} não enviada ao Telegram!`)
                                            }
                                        } catch (error) {
                                            malChat.send("Falha na requisição ao Telegram");
                                            console.log('Error ao fazer requisição ao Telegram', error);
                                        }
                                    }
                                } if (!foundMatch) {
                                    const telegId = '1330333151163187220';
                                    const telegChat = interaction.client.channels.cache.get(telegId);
                                    telegChat.send('O anime não foi encontrado na lista, notificação não necessária.');
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

                        targetChannel.send('A mensagem não é um embed, não a necessidade de processos!');
                    }
                } else {

                    console.log('ChatId não existente!');

                }

            }
        };
        interaction.client.on('messageCreate', messageListener);
    },
};
