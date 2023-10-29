export class NewTxDto {
    public constructor(
        public readonly fromAccountId: number,
        public readonly toAccountId: number,
        public readonly password: number,
        public readonly amount: number
    ) {}
}