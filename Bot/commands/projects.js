const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const projectsPath = path.resolve(__dirname, '../projects.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('projects')
    .setDescription('List your coding projects'),

  async execute(interaction) {
    try {
      const data = JSON.parse(fs.readFileSync(projectsPath, 'utf-8'));
      if (data.length === 0) {
        await interaction.reply('No projects found.');
        return;
      }
      const projectList = data.map(p => `• **${p.name}** (${p.language}) [${p.status}]`).join('\n');
      await interaction.reply(`📚 **Your Projects:**\n${projectList}`);
    } catch (error) {
      console.error(error);
      await interaction.reply('Error reading projects.');
    }
  }
};
