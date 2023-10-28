export interface BlacklistEntity {
    id: number;
    accountId: number;
    reason?: string;
    expiration?: number;
}