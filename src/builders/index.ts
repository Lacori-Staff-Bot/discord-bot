import { StaffButtonBuilders } from "./buttons/staff.js";
import { AdminEmbedBuilders } from "./embeds/admin.js";
import { StaffEmbedBuilders } from "./embeds/staff.js";

export const staffBuilders = {
    buttons: new StaffButtonBuilders(),
    embeds: new StaffEmbedBuilders()
};

export const adminBuilders = {
    embeds: new AdminEmbedBuilders()
};