import { FormEvent, useContext, useState } from 'react';
import {
  Button,
  CloseButton,
  Divider,
  Grid,
  GridItem,
  Heading,
  IconButton,
  InputGroup,
  Text,
  Box,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import Trx from '../classes/Trx';
import { AppCtx } from '../pages/index';
import { AppCtxInterface } from '../types';
import clsx from 'clsx';
import styles from './TAccount.module.css';

type TrxRowProps = {
  trx: Trx;
  tAcctId: string;
};

export default function TrxRow(props: TrxRowProps) {
  const { trx, tAcctId: id } = props;
  const ctx = useContext(AppCtx) as AppCtxInterface;

  return (
    <GridItem
      className='trx-row'
      data-testid='trx-row'
      colStart={1}
      colSpan={10}
    >
      <Grid templateColumns='repeat(10, 1fr)' key={trx.id}>
        {/* Debit */}
        <GridItem colStart={1} colSpan={4} p={1}>
          <Text className='trx-debit' textAlign='right'>
            {trx.dr === 0 ? '' : trx.dr}
          </Text>
        </GridItem>

        {/* Credit */}
        <GridItem colStart={5} colSpan={4} borderLeft='solid black 1px' p={1}>
          <Text className='trx-credit' textAlign='right'>
            {trx.cr === 0 ? '' : trx.cr}
          </Text>
        </GridItem>

        {/* Delete Button */}
        <GridItem colStart={10} colSpan={1}>
          <Grid alignItems='center' height='100%'>
            <GridItem>
              <IconButton
                aria-label='Delete Transaction'
                icon={<DeleteIcon />}
                size='xs'
                onClick={() => ctx.removeTrx(id, trx.id)}
                title='Delete Transaction'
              />
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>
    </GridItem>
  );
}
