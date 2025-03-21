require("dotenv").config();
const { Client, IntentsBitField } = require("discord.js");
const cowsay = require("cowsay");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("ready", (c) => {
  console.log(`🟢 ${c.user.tag} is online!`);
});

client.on("interactionCreate", (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "cowsay") {
    let text = interaction.options.get("text");
    let type = interaction.options.get("type");

    interaction.reply(`\`\`\`\n${cowsay.say({ text: text.value, f: type.value })}\n\`\``);
  }
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (message.content === "$cow-list") {
    function get_cows(error, cow_names) {
      if (error) {
        console.log(error);
      } else if (cow_names) {
        message.channel.send(`Number of cows available: ${cow_names.length}`);
        message.channel.send(cow_names.join(", "));
      }
    }

    cowsay.list(get_cows);
  }
  if (message.content === "$cow-help") {
    message.channel.send(
      "## Make the cow say something: /cowsay\n> text = what you want the cow to say\n> type = what kind of cow you want\n## See the list of cow types: $cow-list\n> pick any type, but make sure you write the exact name including numbers, - and _\n> use default for the normal cow\n## Help: $cow-help\n> lets you see this message again"
    );
  }
});

client.login(process.env.TOKEN);
