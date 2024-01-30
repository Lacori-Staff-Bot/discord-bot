import { AdminButtonBuilders } from "./buttons/admin.js";
import { StaffButtonBuilders } from "./buttons/staff.js";
import { AdminEmbedBuilders } from "./embeds/admin.js";
import { StaffEmbedBuilders } from "./embeds/staff.js";
import { AdminModalBuilders } from "./modals/admin.js";

export const staffBuilders = {
    buttons: new StaffButtonBuilders(),
    embeds: new StaffEmbedBuilders()
};

export const adminBuilders = {
    buttons: new AdminButtonBuilders(),
    embeds: new AdminEmbedBuilders(),
    modals: new AdminModalBuilders()
};