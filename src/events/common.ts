import type { ArgsOf } from "discordx";
import { Discord, On } from "discordx";
import guildsModel from "../mysqlModels/guilds.js";
import restrictionsModel from "../mysqlModels/restrictions.js";

@Discord()
export class Common {
  @On()
  async guildCreate([guild]: ArgsOf<"guildCreate">) {
    const getGuild = await guildsModel.getGuild(guild.id);

    if (!getGuild.status) {
      await guildsModel.addGuild(guild.id);
      await restrictionsModel.addRestriction(guild.id);
    }
  }

  async guildDelete([guild]: ArgsOf<"guildDelete">) {
    await restrictionsModel.removeRestriction(guild.id);
    await guildsModel.removeGuild(guild.id);
  }
}
