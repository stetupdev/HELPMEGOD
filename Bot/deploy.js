const { REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const commands = [
  new SlashCommandBuilder()
    .setName('projects')
    .setDescription('List your coding projects'),
  new SlashCommandBuilder()
    .setName('project')
    .setDescription('Get details about a project')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('Name of the project')
        .setRequired(true))
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Registering global slash commands...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands },
    );
    console.log('Global slash commands registered!');
  } catch (error) {
    console.error(error);
  }
})();
