import { FormEvent, useContext, useState, useEffect, useRef } from 'react';
import {
  Grid,
  GridItem,
  Heading,
  IconButton,
  Input,
  Text,
  Divider as ChakraDivider,
  Box,
  Flex,
} from '@chakra-ui/react';
import {
  AddIcon,
  CheckIcon,
  DeleteIcon,
  SmallCloseIcon,
} from '@chakra-ui/icons';
import TrxRow from './TrxRow';
import TAccountData from '../classes/TAccountData';
import Trx from '../classes/Trx';
import { AppCtx } from '../pages/index';
import { AppCtxInterface } from '../types';
import AddTrxForm, { handleAddTrxSubmit } from './AddTrxForm';

export default function TAccount(props: TAccountData) {
  const { id, title, trxs } = props;
  const ctx = useContext(AppCtx) as AppCtxInterface;
  const [shouldAddTrx, setShouldAddTrx] = useState<boolean>(false);

  let endingBalance = 0;

  function mapTrxs(trx: Trx) {
    endingBalance += trx.dr;
    endingBalance -= trx.cr;

    return <TrxRow key={trx.id} trx={trx} tAcctId={id} />;
  }

  const handleAddTrx: handleAddTrxSubmit = (dr, cr, resetForm) => {
    const trx = new Trx({ dr, cr });
    ctx.addTrx(id, trx);
    resetForm();
    setShouldAddTrx(false);
  };

  function handleCancel() {
    setShouldAddTrx(false);
  }

  return (
    <Flex
      height={'100%'}
      id={id}
      data-testid='t-acct'
      p={2}
      flexDirection='column'
    >
      <Box className='t-acct-row'>
        <GridItem borderBottom='1px solid black' colSpan={8}>
          <Heading as='h3' textAlign='center' size='lg' p={2}>
            {title}
          </Heading>
        </GridItem>

        <GridItem colStart={10} colSpan={1}>
          <IconButton
            aria-label='Delete T-Account'
            icon={<DeleteIcon />}
            onClick={() => ctx.removeTAccount(id)}
            size='xs'
            title='Delete T-Account'
          />
        </GridItem>
      </Box>

      {trxs.map(mapTrxs)}

      {/* spacer */}
      <Box height='100%' className='t-acct-row'>
        <GridItem
          colStart={5}
          colSpan={4}
          borderLeft='1px solid black'
          height='100%'
        ></GridItem>
      </Box>

      {/* form to add new trx */}
      <Box className='t-acct-row'>
        <GridItem colSpan={10}>
          {shouldAddTrx ? (
            // <GridItem colSpan={10}>
            <AddTrxForm
              handleSubmit={handleAddTrx}
              handleCancel={handleCancel}
            />
          ) : (
            <Grid gridTemplateColumns='repeat(10, 1fr)' alignItems='center'>
              <GridItem
                colStart={5}
                colSpan={4}
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
      </Box>

      {/* total */}
      <Box className='t-acct-row'>
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
      </Box>
    </Flex>
  );
}
