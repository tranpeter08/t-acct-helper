import Home from '../pages/index';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

async function setup() {
  const user = userEvent.setup();
  const utils = render(<Home />);

  return { user, utils };
}

async function renderForm() {
  const addTAcctBttn = screen.getByTestId('add-t-acct-bttn');

  await act(async () => {
    addTAcctBttn.click();
  });

  const tAcctForm = screen.getByTestId<HTMLFormElement>('t-acct-form');

  return tAcctForm;
}

describe('home', () => {
  it('renders without crashing', async () => {
    await setup();
    expect(screen.getByTestId('balance')).toBeInTheDocument();
  });

  it('renders a form when Add T-Account button is clicked', async () => {
    const { user } = await setup();
    const tAcctForm = await renderForm();
    expect(tAcctForm).toBeInTheDocument();
  });

  it('creates a new T-Account ', async () => {
    const testTitle = 'test title';
    const { user } = await setup();
    const tAcctForm = await renderForm();
    const input = screen.getByTestId<HTMLInputElement>('t-account-title-input');
    const submitBttn = screen.getByTestId<HTMLButtonElement>(
      't-account-title-submit-bttn'
    );

    fireEvent.change(input, { target: { value: testTitle } });
    expect(input.value).toBe(testTitle);

    let elems = screen.getAllByTestId('t-acct');
    expect(elems.length).toBe(1);

    await user.click(submitBttn);

    elems = screen.getAllByTestId('t-acct');
    expect(elems.length).toBe(2);

    const lastElem = elems.pop();
    expect(lastElem).not.toBeNull();

    if (lastElem) {
      const elem = lastElem.querySelector(`.trx-row`);
      expect(elem).toBeNull();
    }
  });

  it('the T-Account form can be cancelled', async () => {
    const { user } = await setup();
    const tAcctForm = await renderForm();
    const closeButton = screen.getByTestId('close-t-acct-form-bttn');

    await user.click(closeButton);

    expect(tAcctForm).not.toBeInTheDocument();
  });
});
