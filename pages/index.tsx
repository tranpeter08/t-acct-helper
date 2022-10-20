import {
  useState,
  createContext,
  FormEvent,
  ChangeEvent,
  useEffect,
} from 'react';
import type { NextPage, GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import TAccountData from '../classes/TAccountData';
import TAccount from '../components/TAccount';
import Trx from '../classes/Trx';
import {
  Grid,
  Heading,
  GridItem,
  Button,
  FormControl,
  FormLabel,
  Input,
  Flex,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  Box,
  Text,
} from '@chakra-ui/react';
import AddTAcctForm from '../components/AddTAcctForm';

export const AppCtx = createContext({});

const getStaticProps: GetStaticProps = (ctx) => {
  return { props: {} };
};

const Home: NextPage = (props) => {
  const [data, setData] = useState<TAccountData[]>([
    {
      id: 'aaa',
      title: 'Cash',
      trxs: [
        { id: 'o0o', dr: 9, cr: 0 },
        { id: 'o01', dr: 0, cr: 9 },
      ],
    },
  ]);

  const [shouldAddTAcct, setShouldAddTAcct] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const tAcctElems: JSX.Element[] = [];

  let balance = 0;

  for (const tAcct of data) {
    for (const trx of tAcct.trxs) {
      balance += trx.dr;
      balance -= trx.cr;
    }

    tAcctElems.push(
      <GridItem key={tAcct.id}>
        <TAccount {...tAcct} />
      </GridItem>
    );
  }

  function addTAccount(title: string) {
    let titleExists = false;

    if (title === '') return;

    for (const d of data) {
      if (title.toLowerCase() === d.title.toLowerCase()) {
        titleExists = true;
        break;
      }
    }

    if (titleExists) {
      setErrorMessage(`T-Account with title "${title}" already in use.`);
      return;
    }

    setData([...data, new TAccountData(title)]);
    setShouldAddTAcct(false);
    setErrorMessage(null);
  }

  function removeTAccount(id: string) {
    const results = data.filter((tData) => tData.id !== id);
    setData(results);
  }

  function addTrx(tAccountId: string, trx: Trx) {
    const tAcct = data.find((acct) => acct.id === tAccountId);

    if (typeof tAcct === 'undefined') return;

    tAcct.trxs.push(trx);
    setData([...data]);
  }

  function removeTrx(tAccountId: string, trxId: string) {
    const tAcct = data.find((acct) => acct.id === tAccountId);

    if (typeof tAcct === 'undefined') return;

    const trxs = tAcct.trxs.filter((trx) => trx.id !== trxId);
    tAcct.trxs = trxs;

    setData([...data]);
  }

  function handleCancelAddTAcct() {
    setShouldAddTAcct(false);
    setErrorMessage(null);
  }

  useEffect(() => {
    if (shouldAddTAcct) {
      const inputField: HTMLElement | null = document.querySelector('#title');

      if (!inputField) return;

      inputField.focus();
    }
  }, [shouldAddTAcct]);

  return (
    <AppCtx.Provider
      value={{
        addTAccount,
        removeTAccount,
        addTrx,
        removeTrx,
        handleCancelAddTAcct,
      }}
    >
      <Heading
        bgColor='black'
        color='whiteAlpha.900'
        textAlign={'center'}
        as='h1'
        size='lg'
        p={2}
      >
        T Acount Helper
      </Heading>

      <Heading as='h2' size='md' textAlign='center' p={2}>
        Balance: {Math.abs(balance)}{' '}
        {balance !== 0 ? (balance > 0 ? '(Debit)' : '(Credit)') : ''}
      </Heading>

      <Grid
        templateColumns={{
          base: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
          xl: 'repeat(3, 1fr)',
        }}
        p={2}
      >
        {tAcctElems}

        <GridItem>
          {shouldAddTAcct ? (
            <AddTAcctForm
              isInvalid={typeof errorMessage === 'string'}
              errorMessage={errorMessage}
              onSubmit={addTAccount}
            />
          ) : (
            <Grid templateColumns='repeat(10, 1fr)' p={2}>
              <GridItem colStart={1} colSpan={8}>
                <Flex justifyContent='center'>
                  <Button onClick={() => setShouldAddTAcct(true)}>
                    Add T-Account
                  </Button>
                </Flex>
              </GridItem>
            </Grid>
          )}
        </GridItem>
      </Grid>
    </AppCtx.Provider>
  );
};

export default Home;
