const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Deletes all messages in the channel.'),

	async execute(interaction) {
		// Verifica se o usuário tem permissão para deletar mensagens
		if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
			return interaction.reply({
				content: 'Você precisa da permissão "Gerenciar Mensagens" para usar este comando.',
				ephemeral: true,
			});
		}

		// Deleta todas as mensagens do canal
		try {
			const messages = await interaction.channel.messages.fetch();
			await interaction.channel.bulkDelete(messages);
			await interaction.reply({ content: 'Todas as mensagens foram deletadas!', ephemeral: true });
		} catch (error) {
			console.error('Erro ao tentar deletar mensagens:', error);
			await interaction.reply({
				content: 'Ocorreu um erro ao tentar deletar as mensagens.',
				ephemeral: true,
			});
		}
	},
};