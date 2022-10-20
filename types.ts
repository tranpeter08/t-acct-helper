import { FormEvent } from 'react';
import Trx from './classes/Trx';

export type TrxData = {
  dr?: number;
  cr?: number;
};

export type AppCtxInterface = {
  addTAccount: (e: FormEvent) => {};
  removeTAccount: (id: string) => {};
  addTrx: (tAccountId: string, trx: Trx) => {};
  removeTrx: (tAccountId: string, trxId: string) => {};
  handleCancelAddTAcct: () => void;
};
