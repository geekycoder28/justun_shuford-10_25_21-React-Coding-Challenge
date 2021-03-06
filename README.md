# Frontend Coding Challenge

Your task is to finish the Redux `mapStateToProps` function to a program to help an accountant to get balances from accounting journals.

## Getting started

1. First make sure you have the NPM package, Yarn, installed by running `npm install -g yarn`

2. Then install the local node modules by running `yarn install` in the command line.

3. Startup the project with `yarn run start`.

4. Read through the challenge scenario below and implement your solution.

## Inputs & Outputs

Journal and Accounts input fields are already parsed and stored in the app's
Redux store.

User input has the following form:

    AAAA BBBB CCC-YY DDD-YY EEE

- AAAA is the starting account (* means first account of source file)
- BBBB is the ending account(* means last account of source file)
- CCC-YY is the first period (* means first period of source file)
- DDD-YY is the last period (* means last period of source file)
- EEE is output format (values can be HTML or CSV).

Examples of user inputs:

    1000 5000 MAR-16 JUL-16 HTML

This user request must output all accounts from accounts starting with "1000" to accounts starting with "5000", from period MAR-16 to JUL-16. Output should be formatted as an HTML table.

![1000 5000 MAR-16 JUL-16 HTML](/example-1.png)

    2000 * * MAY-16 CSV

This user request must output all accounts from accounts starting with "2000" to last account from source file, from first period of file to MAY-16. Output should be formatted as CSV.

![2000 * * MAY-16 CSV](/example-2.png)

## Challenge

Parsing input fields and storing in Redux has already been implemented; it's up to you to filter the journals and accounts to create the balance data set. This code should go into the selector function at the bottom of the BalanceOutput component. The BalanceOutput component expects balance to be an array of objects with the keys: ACCOUNT, DESCRIPTION, DEBIT, CREDIT, and BALANCE.

To test to make sure your code is working as intended, make sure you try the two examples listed above, and verify that the correct data gets rendered onto the screen:

![solution 1](/solution-1.png)

![solution 2](/solution-2.png)

## Post challenge

After you're done, create a Github repo by the name of `${your_name}-${todays_date}-React-Coding-Challenge`, commit your changes, push to your GitHub and send us a link.
