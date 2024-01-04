import type { ArgsOf, Client } from "discordx";
import { Discord, On } from "discordx";

@Discord()
export class Example {
  @On()
  async messageDelete([message]: ArgsOf<"messageDelete">, client: Client) {
    console.log("Message Deleted", client.user?.username, message.content);
  }
}
