import { type CommandInteraction } from "discord.js";
import { Discord, Slash, SlashGroup } from "discordx";

@Discord()
@SlashGroup({
  name: "admin",
  description: "Команды администратора",
  dmPermission: false,
  defaultMemberPermissions: ["Administrator"]
})
@SlashGroup("admin")
export class Admin {
  @Slash({ description: "Пинг" })
  async ping(interaction: CommandInteraction) {
    await interaction.reply("Понг!");
  }
}
