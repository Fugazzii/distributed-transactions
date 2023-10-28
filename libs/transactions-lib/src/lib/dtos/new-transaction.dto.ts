export class NewTxDto {
    public constructor(
        public readonly toAccountId: number,
        public readonly password: number,
        public readonly amount: number
    ) {}
}