import Trx from './Trx';
import { v4 as uuidv4 } from 'uuid';

export default class TAccountData {
  public id: string = uuidv4();
  public trxs: Trx[] = [];

  constructor(public title: string) {}
}
