// --- ELEMENTS ---
const calculateBtn = document.getElementById('calculateBtn');
const gasPriceInput = document.getElementById('gasPrice');
const gasLimitInput = document.getElementById('gasLimit');
const resultDiv = document.getElementById('result');

// --- APP LOGIC ---
const COINGECKO_API_URL = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd";

calculateBtn.addEventListener('click', async () => {
    const gasPriceGwei = gasPriceInput.value;
    const gasLimit = gasLimitInput.value;

    if (!gasPriceGwei || !gasLimit) {
        resultDiv.innerText = "Please fill in all fields.";
        return;
    }

    resultDiv.innerText = "Calculating...";

    try {
        // 1. Fetch current ETH price
        const priceResponse = await axios.get(COINGECKO_API_URL);
        const ethPriceUsd = priceResponse.data.ethereum.usd;

        // 2. Calculate cost in ETH
        const gasPriceWei = ethers.utils.parseUnits(gasPriceGwei, 'gwei');
        const txCostWei = gasPriceWei.mul(gasLimit);
        const txCostEth = ethers.utils.formatEther(txCostWei);

        // 3. Calculate cost in USD
        const txCostUsd = parseFloat(txCostEth) * ethPriceUsd;

        resultDiv.innerHTML = `
            <p><strong>ETH Price:</strong> $${ethPriceUsd}</p>
            <hr>
            <p><strong>Tx Cost (ETH):</strong> ${parseFloat(txCostEth).toFixed(6)} ETH</p>
            <p><strong>Tx Cost (USD):</strong> $${txCostUsd.toFixed(2)}</p>
        `;

    } catch (error) {
        resultDiv.innerText = `Error: ${error.message}`;
    }
});
