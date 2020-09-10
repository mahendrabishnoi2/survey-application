export class Admin {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    isPrimaryAdmin: number;

    initialize() {
        this.id = null;
        this.email = "";
        this.firstName = "";
        this.lastName = "";
        this.password = "";
        this.isPrimaryAdmin = 1;
    }
}
