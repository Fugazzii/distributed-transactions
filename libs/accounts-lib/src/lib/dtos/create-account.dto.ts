export class CreateAccountDto {
    public constructor(
        public readonly username: string,
        public readonly password: string
    ) {}
}