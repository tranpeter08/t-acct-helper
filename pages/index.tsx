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
import { Grid, Heading, GridItem, Button, Text } from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import AddTAcctForm from '../components/AddTAcctForm';
import Seo from '../components/Seo';

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
  const [showDownloadModal, setShowDownloadModal] = useState<boolean>(false);
  const [csvLink, setCsvLink] = useState<string>('');
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

  function convertToCsv() {
    const csvData = [];

    for (const tAcct of data) {
      for (const trx of tAcct.trxs) {
        const row = [];
        const title = tAcct.title;
        row.push(title);
        row.push(trx.dr);
        row.push(trx.cr);

        csvData.push(row.join(','));
      }
    }

    csvData.unshift(['account', 'debit', 'credit'].join(','));
    const csvStr = csvData.join('\r\n');
    const blob = new Blob([csvStr], { type: 'text/csv' });
    const link = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = link;
    a.download = 't_accounts.csv';
    document.body.append(a);
    a.click();
    a.remove();
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
      <Seo />
      <main>
        <Heading
          bgColor='black'
          color='whiteAlpha.900'
          textAlign={'center'}
          as='h1'
          size='lg'
          p={2}
          data-testid='home-title'
        >
          T Acount Helper
        </Heading>

        <Heading
          data-testid='balance'
          as='h2'
          size='md'
          textAlign='center'
          p={2}
        >
          Balance: {Math.abs(balance)}{' '}
          {balance !== 0 ? (balance > 0 ? '(Debit)' : '(Credit)') : ''}
        </Heading>

        <Grid justifyContent='center'>
          {shouldAddTAcct ? (
            <AddTAcctForm
              isInvalid={typeof errorMessage === 'string'}
              errorMessage={errorMessage}
              onSubmit={addTAccount}
            />
          ) : (
            <>
              <GridItem h='136px' p={2}>
                <Button
                  data-testid='add-t-acct-bttn'
                  onClick={() => setShouldAddTAcct(true)}
                >
                  Add T-Account
                </Button>
                <Button
                  ml={4}
                  onClick={convertToCsv}
                  rightIcon={<DownloadIcon />}
                >
                  Download CSV
                </Button>
              </GridItem>
            </>
          )}
        </Grid>

        <Grid
          templateColumns={{
            base: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
            xl: 'repeat(3, 1fr)',
          }}
          p={2}
        >
          {tAcctElems}
        </Grid>
      </main>
      <footer>
        <Text>Convert to CSV</Text>
      </footer>
    </AppCtx.Provider>
  );
};

export default Home;
