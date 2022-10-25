import { FormEvent, useContext, useState, useEffect, useRef } from 'react';
import {
  Grid,
  GridItem,
  Heading,
  IconButton,
  Input,
  Text,
  Box,
  Flex,
} from '@chakra-ui/react';
import { AddIcon, CheckIcon, SmallCloseIcon } from '@chakra-ui/icons';
import { AppCtx } from '../pages/index';
import { AppCtxInterface } from '../types';

export type handleAddTrxSubmit = (
  debit: number,
  credit: number,
  resetForm: () => void
) => void;
export type handleAddTrxCancel = () => void;

export interface AddTrxFormProps {
  handleSubmit: handleAddTrxSubmit;
  handleCancel: handleAddTrxCancel;
}

export default function AddTrxForm(props: AddTrxFormProps) {
  const { handleSubmit, handleCancel } = props;
  const ctx = useContext(AppCtx) as AppCtxInterface;
  const [credit, setCredit] = useState<string>('');
  const [debit, setDebit] = useState<string>('');
  const inputField = useRef<HTMLInputElement>(null);
  const invalidValues = ['', '0'];
  const isDisabledAddTrx = !validateInput(credit) && !validateInput(debit);

  function validateInput(input: string) {
    if (invalidValues.includes(input)) return false;
    const value = parseInt(input);

    if (isNaN(value) || value === 0) return false;

    return true;
  }

  function resetForm() {
    setDebit('');
    setCredit('');
  }

  function normalizeInput(input: string) {
    return invalidValues.includes(input) ? 0 : parseInt(input);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const dr = normalizeInput(debit);
    const cr = normalizeInput(credit);
    handleSubmit(dr, cr, resetForm);
  }

  function onCancel() {
    resetForm();
    handleCancel();
  }

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }
  }, []);

  return (
    <Grid
      as='form'
      gridTemplateColumns='repeat(10, 1fr)'
      onSubmit={onSubmit}
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
      <GridItem colStart={5} colSpan={4} borderLeft='1px solid black' p={1}>
        <Box>
          <Input
            className='credit'
            name='credit'
            type='number'
            min={0}
            value={credit}
            onChange={(e) => setCredit(e.target.value)}
            textAlign='right'
          />
        </Box>
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
          onClick={onCancel}
          title='Cancel'
          type='button'
        />
      </GridItem>
    </Grid>
  );
}
