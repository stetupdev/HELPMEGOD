const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const projectsPath = path.resolve(__dirname, '../projects.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('project')
    .setDescription('Get details about a project')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('Name of the project')
        .setRequired(true)
    ),

  async execute(interaction) {
    const projectName = interaction.options.getString('name');
    try {
      const data = JSON.parse(fs.readFileSync(projectsPath, 'utf-8'));
      const project = data.find(p => p.name.toLowerCase() === projectName.toLowerCase());
      if (!project) {
        await interaction.reply(`❌ Project \`${projectName}\` not found.`);
        return;
      }
      await interaction.reply(
        `📖 **${project.name}**\n` +
        `- Language: ${project.language}\n` +
        `- Status: ${project.status}\n` +
        `- Tags: ${project.tags.join(', ')}\n` +
        `- Path: ${project.path}`
      );
    } catch (error) {
      console.error(error);
      await interaction.reply('Error reading projects.');
    }
  }
};
