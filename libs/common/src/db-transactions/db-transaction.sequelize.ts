import { Transaction } from 'sequelize';
import { ITransaction } from './db-transaction.interface';

export class SequelizeTransaction implements ITransaction {

  public constructor(private transaction: Transaction) {}

  public async begin(): Promise<void> {
    // Sequelize transactions are automatically started when created, no explicit "begin" is required
  }

  public async commit(): Promise<void> {
    await this.transaction.commit();
  }

  public async rollback(): Promise<void> {
    await this.transaction.rollback();
  }

}
