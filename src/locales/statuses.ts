import { ActivityType } from "discord.js";

export type Statuses = {
    name: string,
    type: ActivityType
}[]


export const statuses: Statuses = [
    {
        name: `на {guilds} серверов`,
        type: ActivityType.Watching
    },
    {
        name: "Майнкрафт",
        type: ActivityType.Playing
    }
];