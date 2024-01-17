import { dirname, importx } from "@discordx/importer";
import type { Interaction, Message } from "discord.js";
import { IntentsBitField } from "discord.js";
import { Client } from "discordx";
import app from "./api/main.js";
import { checkBans, checkBlocks, checkWarns } from "./subsystems/checkers.js";

export const bot = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.GuildVoiceStates,
    IntentsBitField.Flags.MessageContent
  ],

  silent: false,

  simpleCommand: {
    prefix: "~",
  },
});

bot.once("ready", async () => {
  await bot.initApplicationCommands();

  setInterval(checkBans, 60 * 60 * 1000);
  setInterval(checkBlocks, 60 * 1000);
  setInterval(checkWarns, 60 * 60 * 1000);

  console.log("Bot started");
});

bot.on("interactionCreate", (interaction: Interaction) => {
  bot.executeInteraction(interaction);
});

bot.on("messageCreate", async (message: Message) => {
  await bot.executeCommand(message);
});

async function run() {
  await importx(`${dirname(import.meta.url)}/{events,commands}/**/*.{ts,js}`);

  if (!process.env.BOT_TOKEN) {
    throw Error("Could not find BOT_TOKEN in your environment");
  }

  if (!process.env.API_PORT) {
    throw Error("Could not find API_PORT in your environment");
  }

  app.listen(process.env.API_PORT);

  await bot.login(process.env.BOT_TOKEN);
}

void run();
