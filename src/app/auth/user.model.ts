export class User {
    constructor(
        public email: string,
        public id: string,
        private pToken: string,
        private tokenExpirationDate: Date
    ) {}

    get token(): string {
        if (!this.tokenExpirationDate || new Date() > this.tokenExpirationDate) {
            return null;
        }

        return this.pToken;
    }
}
