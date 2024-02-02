import locales from "../locales/index.js";
import { bot } from "../main.js";

export async function updateStatus() {
    var lastStatus = 0;
    setInterval(async () => {
        var status = Math.floor(Math.random() * (locales.statuses.length - 1));
        status == lastStatus ? status + 1 != locales.statuses.length ? status += 1 : status -= 1 : undefined;
        await bot.user!.presence.set({
            status: "online", activities: [
                {
                    name: locales.statuses[status].name.replace("{guilds}", bot.guilds.cache.size.toString()),
                    type: locales.statuses[status].type
                }
            ]
        });
        lastStatus = status;
    }, 20 * 1000);
}