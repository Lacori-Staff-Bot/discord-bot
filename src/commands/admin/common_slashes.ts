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
@SlashGroup({
  root: "admin",
  name: "report",
  description: "Система репортов"
})
export class Admin {

}