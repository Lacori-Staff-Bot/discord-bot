import { Discord, SlashGroup } from "discordx";

@Discord()
@SlashGroup({
  name: "admin",
  description: "Команды администратора",
  dmPermission: false,
  defaultMemberPermissions: ["Administrator"]
})
@SlashGroup({
  root: "admin",
  name: "gendersystem",
  description: "Гендр система"
})
@SlashGroup({
  root: "admin",
  name: "restrict",
  description: "Система ограничений"
})
@SlashGroup("admin")
export class Admin {

}