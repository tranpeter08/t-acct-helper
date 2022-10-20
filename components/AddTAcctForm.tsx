import { useState, ChangeEvent, useContext, FormEvent } from 'react';
import {
  Grid,
  Heading,
  GridItem,
  Button,
  FormControl,
  FormLabel,
  Input,
  Flex,
  IconButton,
  FormHelperText,
  FormErrorMessage,
} from '@chakra-ui/react';
import { AppCtx } from '../pages/index';
import { AppCtxInterface } from '../types';
import { CloseIcon } from '@chakra-ui/icons';

export type AddTAcctFormProps = {
  onSubmit: (title: string) => void;
  isInvalid: boolean | undefined;
  errorMessage: string | null | undefined;
};

export default function AddTAcctForm(props: AddTAcctFormProps) {
  const ctx = useContext(AppCtx) as AppCtxInterface;
  const [newTitle, setNewTitle] = useState('');
  const { onSubmit, isInvalid, errorMessage } = props;

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setNewTitle(e.target.value);
  }

  function handleCancelAddTAcct() {
    ctx.handleCancelAddTAcct();
    setNewTitle('');
  }

  function handleSubmit(e: FormEvent<HTMLElement>) {
    e.preventDefault();
    onSubmit(newTitle);
  }

  return (
    <Grid justifyContent='center' templateColumns='repeat(10, 1fr)' p={2}>
      <GridItem colStart={1} colSpan={8} as='form' onSubmit={handleSubmit}>
        <FormControl isRequired isInvalid={isInvalid}>
          <Flex>
            <FormLabel fontWeight={600}>T-Account Title</FormLabel>
            <IconButton
              aria-label='Cancel Create T-Account'
              marginLeft='auto'
              type='button'
              onClick={handleCancelAddTAcct}
              icon={<CloseIcon />}
              size='xs'
              title='Cancel'
            >
              Cancel
            </IconButton>
          </Flex>
          <Input
            id='title'
            name='title'
            type='text'
            value={newTitle}
            onChange={handleInputChange}
            textAlign='center'
          />
          <FormErrorMessage>{errorMessage}</FormErrorMessage>
        </FormControl>
        <Flex justifyContent='end' paddingTop={2}>
          <Button disabled={newTitle.length === 0}>Create T-Account</Button>
        </Flex>
      </GridItem>
    </Grid>
  );
}
