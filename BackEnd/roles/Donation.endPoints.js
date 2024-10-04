import { roles } from "../middlewares/authMiddleware.js";

export const endPoint={
    create:[roles.Admin,roles.User.Donor],
    update:[roles.Admin,roles.User.Donor],
    get:[roles.Admin,roles.User.Donor],
}