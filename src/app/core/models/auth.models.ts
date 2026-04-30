import { UserRole } from "src/app/util/user-role.util";

export class User {
    _id: string;
    // username: string;
    // password: string;
    firstName?: string;
    lastName?: string;
    token: string;
    email: string;
    role: UserRole[];
}
