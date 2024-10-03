import { roles } from "../../Middleware/auth.middleware.js";

export const endPoint={
    create:[roles.Admin,roles.User.Donor],
    update:[roles.Admin,roles.User.Donor],
    get:[roles.Admin,roles.User.Donor],
}