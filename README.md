# Setup:

1. Install NODE.JS: https://nodejs.org/en/

2. Install Ganache (truffle suit): https://trufflesuite.com/ganache/

3. Install truffle v5.0.2 (it needs to be this exact version):

```
npm install -g truffle@5.0.2
```

4. After creating the package.json (copied from Gregory's repo.), install all
   dependencies of the project by executing:

```
npm install
```

### Annotations:

- The file package.json was copied from here: https://github.com/dappuniversity/eth-todo-list/blob/master/package.json

- The file truffle-config.js was copied from here: https://github.com/dappuniversity/eth-todo-list/blob/master/truffle-config.js

- The file bs-config.json was copied from here: https://github.com/dappuniversity/eth-todo-list/blob/master/bs-config.json

- The file ./src/index.html was copied from here: https://github.com/dappuniversity/eth-todo-list/blob/master/src/index.html

  - got an error here: `"Web3 is not a constructor"`. So I added a line of code on `index.html`, before the inclusion of the truffle dependency script:

  ```
  <script src="vendor/web3/dist/web3.min.js"></script>
  ```

  -> This means that, in my case, the web3 dependency needs to come before the truffle dependency, as truffle depends on the web3 API.

- The function loadWeb3 from app.js was just "copy-pasted" from: https://github.com/dappuniversity/eth-todo-list/blob/master/src/app.js

- Had to fix some erros
  a. web3 dependency added on html scripts
  b. Every method that requires transaction signatures (alter the blockchain)
  had to have one more parameter added:
  ```
  {from: App.account}
  ```
