import {FC} from 'react';
import {connect} from 'react-redux';

import {RootState, UserInputType} from 'types';
import {dateToString, toCSV, parseCSV} from 'utils';
import {journalData, accountsData} from 'data';

interface Balance {
  ACCOUNT: string;
  DESCRIPTION: string;
  DEBIT: number;
  CREDIT: number;
  BALANCE: number;
}

interface Journal {
  ACCOUNT: number;
  PERIOD: Date;
  DEBIT: number;
  CREDIT: number;
}

interface JournalMap {
  [key: string]: Journal[]
}

interface Account {
  ACCOUNT: number;
  LABEL: string;
}

interface AccountMap {
  [key: string]: Account
}

interface ConnectProps {
  balance: Balance[];
  totalCredit: number;
  totalDebit: number;
  userInput: UserInputType;
}

const BalanceOutput: FC<ConnectProps> = ({balance, totalCredit, totalDebit, userInput}) => {
  if (!userInput.format || !userInput.startPeriod || !userInput.endPeriod) return null;

  return (
    <div className="output">
      <p>
        Total Debit: {totalDebit} Total Credit: {totalCredit}
        <br />
        Balance from account {userInput.startAccount || '*'} to {userInput.endAccount || '*'} from period{' '}
        {dateToString(userInput.startPeriod)} to {dateToString(userInput.endPeriod)}
      </p>
      {userInput.format === 'CSV' ? <pre>{toCSV(balance)}</pre> : null}
      {userInput.format === 'HTML' ? (
        <table className="table">
          <thead>
            <tr>
              <th>ACCOUNT</th>
              <th>DESCRIPTION</th>
              <th>DEBIT</th>
              <th>CREDIT</th>
              <th>BALANCE</th>
            </tr>
          </thead>
          <tbody>
            {balance.map((entry, i) => (
              <tr key={i}>
                <th scope="row">{entry.ACCOUNT}</th>
                <td>{entry.DESCRIPTION}</td>
                <td>{entry.DEBIT}</td>
                <td>{entry.CREDIT}</td>
                <td>{entry.BALANCE}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  );
};

export default connect(
  (state: RootState): ConnectProps => {
    let balance: Balance[] = [];

    /* YOUR CODE GOES HERE */
    const journals = parseCSV(journalData) as Journal[];
    const accounts = parseCSV(accountsData) as Account[];
    let journalsMap = journals.reduce((acc: JournalMap, cur: Journal): JournalMap => {
      if (typeof acc[cur.ACCOUNT] === 'undefined') {
        acc[cur.ACCOUNT] = [cur];
      } else {
        acc[cur.ACCOUNT].push(cur);
      }
      return acc;
    }, {} as JournalMap);
    let accountsMap = accounts.reduce((acc: AccountMap, cur: Account): AccountMap => {
      acc[cur.ACCOUNT] = cur;
      return acc;
    }, {} as AccountMap);

    Object.keys(journalsMap).forEach((account: string): void => {
      if (accountsMap[account]) {
        const fitJournals: Journal[] = journalsMap[account].filter((journal: Journal): boolean => {
          let isFit = true;
          if (state.userInput.startAccount && journal.ACCOUNT < state.userInput.startAccount) {
            isFit = false;
          }
          if (state.userInput.endAccount && journal.ACCOUNT > state.userInput.endAccount) {
            isFit = false;
          }
          if (state.userInput.startPeriod && journal.PERIOD < state.userInput.startPeriod) {
            isFit = false;
          }
          if (state.userInput.endPeriod && journal.PERIOD > state.userInput.endPeriod) {
            isFit = false;
          }
          return isFit;
        });
        if (fitJournals.length > 0) {
          const summaryJournal = fitJournals.reduce((acc: Journal, cur: Journal): Journal => ({
            ...acc,
            DEBIT: acc.DEBIT + cur.DEBIT,
            CREDIT: acc.CREDIT + cur.CREDIT,
          }), { DEBIT: 0, CREDIT: 0 } as Journal);
          balance.push({
            ACCOUNT: account,
            DESCRIPTION: accountsMap[account].LABEL,
            DEBIT: summaryJournal.DEBIT,
            CREDIT: summaryJournal.CREDIT,
            BALANCE: summaryJournal.DEBIT - summaryJournal.CREDIT,
          });
        }
      }
    });

    const totalCredit = balance.reduce((acc, entry) => acc + entry.CREDIT, 0);
    const totalDebit = balance.reduce((acc, entry) => acc + entry.DEBIT, 0);

    return {
      balance,
      totalCredit,
      totalDebit,
      userInput: state.userInput,
    };
  },
)(BalanceOutput);
