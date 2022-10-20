import { FormEvent, useContext, useState, useEffect, useRef } from 'react';
import {
  Grid,
  GridItem,
  Heading,
  IconButton,
  Input,
  Text,
  Divider as ChakraDivider,
} from '@chakra-ui/react';
import { AddIcon, CheckIcon, SmallCloseIcon } from '@chakra-ui/icons';
import TrxRow from './TrxRow';
import TAccountData from '../classes/TAccountData';
import Trx from '../classes/Trx';
import { AppCtx } from '../pages/index';
import { AppCtxInterface } from '../types';

export default function TAccount(props: TAccountData) {
  const { id, title, trxs } = props;
  const ctx = useContext(AppCtx) as AppCtxInterface;
  const [credit, setCredit] = useState<string>('');
  const [debit, setDebit] = useState<string>('');
  const [shouldAddTrx, setShouldAddTrx] = useState<boolean>(false);
  const inputField = useRef<HTMLInputElement>(null);

  const invalidValues = ['', '0'];
  const isDisabledAddTrx = !validateInput(credit) && !validateInput(debit);

  let endingBalance = 0;

  function validateInput(input: string) {
    if (invalidValues.includes(input)) return false;

    const value = parseInt(input);

    if (isNaN(value) || value === 0) return false;

    return true;
  }

  function mapTrxs(trx: Trx) {
    endingBalance += trx.dr;
    endingBalance -= trx.cr;

    return <TrxRow key={trx.id} trx={trx} tAcctId={id} />;
  }

  function clearInputs() {
    setDebit('');
    setCredit('');
  }

  function normalizeInput(input: string) {
    return invalidValues.includes(input) ? 0 : parseInt(input);
  }

  function handleAddTrx(e: FormEvent) {
    e.preventDefault();
    const dr = normalizeInput(debit);
    const cr = normalizeInput(credit);
    const trx = new Trx({ dr, cr });
    ctx.addTrx(id, trx);
    clearInputs();
    setShouldAddTrx(false);
  }

  function handleCancel() {
    setShouldAddTrx(false);
    clearInputs();
  }

  useEffect(() => {
    if (shouldAddTrx && inputField.current) {
      inputField.current.focus();
    }
  }, [shouldAddTrx]);

  return (
    <Grid id={id} templateColumns='repeat(10, 1fr)' templateRows='auto' p={2}>
      <GridItem borderBottom='1px solid black' colSpan={8}>
        <Heading as='h3' textAlign='center' size='lg' p={2}>
          {title}
        </Heading>
      </GridItem>

      <GridItem colStart={10} colSpan={1}>
        <IconButton
          aria-label='Remove T-Account'
          icon={<SmallCloseIcon />}
          onClick={() => ctx.removeTAccount(id)}
          size='xs'
          title='Remove T-Account'
        />
      </GridItem>

      {trxs.map(mapTrxs)}

      {/* form to add new trx */}
      <GridItem colSpan={10}>
        {shouldAddTrx ? (
          <Grid
            as='form'
            gridTemplateColumns='repeat(10, 1fr)'
            onSubmit={handleAddTrx}
            alignItems='center'
            className='add-trx-form'
          >
            {/* Debit */}
            <GridItem colStart={1} colSpan={4} p={1}>
              <Input
                className='debit'
                name='debit'
                type='number'
                min={0}
                value={debit}
                onChange={(e) => setDebit(e.target.value)}
                textAlign='right'
                ref={inputField}
              />
            </GridItem>

            {/* Credit */}
            <GridItem
              colStart={5}
              colSpan={4}
              borderLeft='1px solid black'
              p={1}
            >
              <Input
                className='credit'
                name='credit'
                type='number'
                min={0}
                value={credit}
                onChange={(e) => setCredit(e.target.value)}
                textAlign='right'
              />
            </GridItem>

            {/* Submit */}
            <GridItem colStart={9} colSpan={1}>
              <IconButton
                aria-label='Submit Trx'
                disabled={isDisabledAddTrx}
                icon={<CheckIcon />}
                size='xs'
                type='submit'
                marginLeft={1}
                title='Submit'
              />
            </GridItem>

            {/* Cancel */}
            <GridItem colStart={10} colSpan={1}>
              <IconButton
                aria-label='Cancel'
                icon={<SmallCloseIcon />}
                size='xs'
                onClick={handleCancel}
                title='Cancel'
              />
            </GridItem>
          </Grid>
        ) : (
          <Grid gridTemplateColumns='repeat(10, 1fr)' alignItems='center'>
            <GridItem
              colStart={5}
              borderLeft='1px solid black'
              height='48px'
            ></GridItem>
            <GridItem colStart={9} colSpan={1}>
              <IconButton
                aria-label='Add Transaction'
                icon={<AddIcon />}
                size='xs'
                onClick={() => setShouldAddTrx(true)}
                marginLeft={1}
                title='Add a Transaction'
              />
            </GridItem>
          </Grid>
        )}
      </GridItem>

      {/* total */}
      <GridItem colSpan={8} borderTop='1px solid black' height={0}></GridItem>

      {/* debits */}
      <GridItem colStart={1} colSpan={4} p={1}>
        <Text aira-aria-label='Total Debits' textAlign='right'>
          {endingBalance > 0 ? endingBalance : ''}
        </Text>
      </GridItem>

      {/* credits */}
      <GridItem colStart={5} colSpan={4} p={1} borderLeft='1px solid black'>
        <Text aria-label='Total Credits' textAlign='right'>
          {endingBalance <= 0 ? -1 * endingBalance : ''}
        </Text>
      </GridItem>
    </Grid>
  );
}
