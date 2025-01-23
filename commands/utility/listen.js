const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('listen')
        .setDescription('Listen to messages in this channel'),

    async execute(interaction) {
        // Captura o canal onde o comando foi chamado
        const channel = interaction.channel;

        // Envia uma mensagem confirmando que o bot começará a ouvir as mensagens no canal
        await interaction.reply(`Agora ouvindo mensagens no canal: ${channel.name}`);

        // A função de escuta das mensagens é registrada globalmente,
        // mas só reagirá às mensagens do canal onde o comando foi chamado.
        const messageListener = (message) => {
            // Verifica se a mensagem é do canal correto e não é de outro bot
            if (message.channel.id === channel.id) {

                const channelId = '1330240912780955820'; // Coloque o ID do canal onde deseja enviar a mensagem
                const targetChannel = interaction.client.channels.cache.get(channelId);

                if (targetChannel) {
                    // Verifica se a mensagem contém embed
                    if (message.embeds.length > 0) {
                        // Se a mensagem contiver embed, você pode replicá-lo ou enviar uma nova mensagem no outro canal
                        console.log("A mensagem contém um embed. Enviando para outro canal.");

                        // Aqui você pode enviar a mensagem com embed para o canal destino
                        targetChannel.send(message.embeds[0].title);

                    } else {
                        // Caso contrário, só envia o conteúdo da mensagem
                        console.log(`${message.content}`); // Apenas loga o conteúdo da mensagem

                        // Envia a mensagem simples (sem embed) para o canal destino
                        targetChannel.send(message.content);
                    }
                }

            }
        };

        // Registra o listener para o evento 'messageCreate'
        interaction.client.on('messageCreate', messageListener);

        // Opcional: desregistrar o listener quando não for mais necessário
        // Para isso, você poderia usar um timeout ou outro critério para parar a escuta.
    },
};
