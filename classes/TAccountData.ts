import Trx from './Trx';
import { v4 as uuidv4 } from 'uuid';

export default class TAccountData {
  public id: string = uuidv4();
  public title: string = '';
  public trxs: Trx[] = [];

  constructor(title: string, trxs: Trx[] = []) {
    TAccountData.validateTitle(title);
    this.title = title;

    for (const trx of trxs) {
      TAccountData.validateTrx(trx);
      this.trxs.push(trx);
    }
  }

  static validateTrx(trx: any) {
    if (!('dr' in trx && 'cr' in trx)) {
      throw new Error('missing "credit" and "debit" properties');
    }
  }

  static validateTitle(title: any) {
    if (typeof title !== 'string')
      throw new Error('title needs to be a string');
  }
}
