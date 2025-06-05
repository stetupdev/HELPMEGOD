const { Client, GatewayIntentBits, Events } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const projectsPath = './projects.json';

client.once(Events.ClientReady, () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'projects') {
    try {
      const data = JSON.parse(fs.readFileSync(projectsPath, 'utf-8'));
      if (data.length === 0) {
        await interaction.reply('No projects found.');
        return;
      }
      const projectList = data.map(p => `• **${p.name}** (${p.language}) [${p.status}]`).join('\n');
      await interaction.reply(`📚 **Your Projects:**\n${projectList}`);
    } catch (err) {
      console.error(err);
      await interaction.reply('Error reading projects.');
    }
  }

  else if (interaction.commandName === 'project') {
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
    } catch (err) {
      console.error(err);
      await interaction.reply('Error reading projects.');
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
