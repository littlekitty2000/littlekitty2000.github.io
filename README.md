<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Safe Send Button (ethers.js + MetaMask)</title>
  <style>
    body { font-family: system-ui, Arial; background:#f7f8fb; padding:2rem; }
    .card { background:white; padding:1.2rem; border-radius:8px; box-shadow:0 6px 18px rgba(20,20,40,0.06); max-width:520px; margin:auto;}
    label { display:block; margin-top:.6rem; font-size:.9rem; color:#333;}
    input { width:100%; padding:.6rem; margin-top:.35rem; border:1px solid #dfe3ee; border-radius:6px; }
    button { margin-top:1rem; padding:.7rem 1rem; border-radius:8px; background:#2b6ef6; color:white; border:none; cursor:pointer; }
    button.secondary { background:#eee; color:#111; }
    .warn { margin-top:.8rem; color:#8a1c1c; background:#fff0f0; padding:.6rem; border-radius:6px; font-size:.9rem; }
    .info { margin-top:.6rem; color:#0a3; font-size:.9rem; }
    pre { background:#0f1724; color:#dbeafe; padding:.6rem; border-radius:6px; overflow:auto; font-size:.85rem; }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/ethers@6.9.0/dist/ethers.umd.min.js"></script>
</head>
<body>
  <div class="card">
    <h2>Safe Send (Demo)</h2>
    <div id="walletStatus">Wallet: <em>not connected</em></div>

    <label>Recipient address (Bitcoin/Ethereum note below)</label>
    <input id="to" placeholder="0x... (Ethereum address - this demo is for Ethereum-compatible networks)">

    <label>Amount (ETH)</label>
    <input id="amount" placeholder="e.g. 0.01">

    <button id="connectBtn">Connect Wallet</button>
    <button id="sendBtn" class="secondary" disabled>Send (requires wallet confirmation)</button>

    <div class="warn" id="warning">
      Only use this with wallets you own. Never paste private keys into a website. This demo uses Ethereum-style transactions (not raw Bitcoin transactions).
    </div>

    <div id="messages" style="margin-top:.8rem"></div>
    <pre id="txLog" style="display:none"></pre>
  </div>

  <script>
    const connectBtn = document.getElementById('connectBtn');
    const sendBtn = document.getElementById('sendBtn');
    const walletStatus = document.getElementById('walletStatus');
    const messages = document.getElementById('messages');
    const txLog = document.getElementById('txLog');

    let provider, signer, currentAddress;

    function showMessage(html, level='info') {
      messages.innerHTML = '<div class="' + (level==='error' ? '' : 'info') + '">' + html + '</div>';
    }

    async function connectWallet() {
      if (!window.ethereum) {
        showMessage('No web3 wallet detected. Install MetaMask or a compatible extension.', 'error');
        return;
      }
      try {
        provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = await provider.getSigner();
        currentAddress = await signer.getAddress();
        walletStatus.innerHTML = `Wallet: <strong>${currentAddress}</strong>`;
        connectBtn.innerText = 'Connected';
        sendBtn.disabled = false;
        showMessage('Wallet connected. This demo performs Ethereum-style transactions (for testnets/mainnet).');
      } catch (err) {
        console.error(err);
        showMessage('Connection canceled or failed: ' + (err.message || err), 'error');
      }
    }

    function validateInputs(to, amount) {
      if (!ethers.isAddress(to)) return 'Recipient address is not a valid Ethereum address.';
      const n = Number(amount);
      if (!isFinite(n) || n <= 0) return 'Amount must be a positive number.';
      return null;
    }

    async function sendTransaction() {
      const to = document.getElementById('to').value.trim();
      const amount = document.getElementById('amount').value.trim();

      const validationError = validateInputs(to, amount);
      if (validationError) {
        showMessage(validationError, 'error');
        return;
      }

      // Confirmation modal (simple)
      const conf = confirm(`Confirm send of ${amount} ETH to ${to}\n\nYou will approve this transaction inside your wallet extension.`);
      if (!conf) {
        showMessage('User canceled the send.');
        return;
      }

      try {
        showMessage('Requesting transaction from your wallet...');

        // Build transaction request
        const tx = {
          to,
          value: ethers.parseEther(amount) // BigInt-like value
          // gasPrice/gasLimit typically left to provider/wallet to fill
        };

        // Request wallet to sign & send — wallet UI prompts the user
        const sent = await signer.sendTransaction(tx);
        txLog.style.display = 'block';
        txLog.textContent = 'Transaction submitted. Waiting for hash...\n' + JSON.stringify(sent, null, 2);
        showMessage('Transaction submitted. Waiting for network confirmation (tx hash below).');

        // Wait for one confirmation (optional)
        const receipt = await sent.wait(1);
        txLog.textContent += '\n\nTransaction confirmed:\n' + JSON.stringify(receipt, null, 2);
        showMessage('Transaction confirmed. See tx hash above.');
      } catch (err) {
        console.error(err);
        showMessage('Transaction failed or rejected: ' + (err.message || err), 'error');
      }
    }

    connectBtn.addEventListener('click', connectWallet);
    sendBtn.addEventListener('click', sendTransaction);
  </script>
</body>
</html>
