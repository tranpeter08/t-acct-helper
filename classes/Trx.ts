import { v4 as uuidv4 } from 'uuid';
import { TrxData } from '../types';

export default class Trx {
  public id: string = uuidv4();
  public dr: number = 0;
  public cr: number = 0;

  constructor(trxData: TrxData) {
    if (trxData.dr) {
      this.dr = trxData.dr;
    }

    if (trxData.cr) {
      this.cr = trxData.cr;
    }
  }
}
