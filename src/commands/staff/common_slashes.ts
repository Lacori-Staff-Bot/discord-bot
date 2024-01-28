import { Discord, SlashGroup } from "discordx";

@Discord()
@SlashGroup({
    name: "staff",
    description: "Команды стафа",
    dmPermission: false
})
@SlashGroup("staff")
export class Staff {

}