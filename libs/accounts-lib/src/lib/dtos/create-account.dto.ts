export class CreateAccountDto {
    public constructor(
        public readonly fullName: string,
        public readonly password: string
    ) {}
}