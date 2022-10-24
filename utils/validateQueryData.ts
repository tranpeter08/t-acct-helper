import TAccountData from '../classes/TAccountData';

export default function validateQueryData(queryData: any) {
  const errorMsg = 'Invalid data from query param';

  if (!Array.isArray(queryData)) throw new Error(errorMsg);

  for (const tAcctData of queryData) {
    TAccountData.validateTitle(tAcctData.title);

    if (!Array.isArray(tAcctData.trxs)) throw new Error(errorMsg);

    for (const trx of tAcctData.trxs) {
      TAccountData.validateTrx(trx);
    }
  }
}
