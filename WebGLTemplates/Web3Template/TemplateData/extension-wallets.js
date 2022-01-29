let extensionWallets = {
  phantom: {
    name: "Phantom",
    url: "https://phantom.app/",
  },
  solflare: {
    name: "Solflare",
    url: "https://solflare.com/",
  },
  slope: {
    name: "Slope",
    url: "https://slope.finance/",
  },
  coin98: {
    name: "Coin98",
    url: "https://coin98.com/",
  },
  math: {
    name: "Math",
    url: "https://mathwallet.org/en-us/",
  },
};

const walletCtx = window;
let providersRegistry = undefined;

async function internalGetOrLookForProviders() {
  if (!providersRegistry) {
    providersRegistry = {
      hasPhantom: (await walletCtx.solana) && walletCtx.solana.isPhantom,

      hasSolflare: (await walletCtx.solflare) && walletCtx.solflare.isSolflare,

      hasSlope: await walletCtx.Slope,

      hasCoin98: (await walletCtx.coin98) && walletCtx.coin98.sol,

      hasMath: (await walletCtx.solana) && walletCtx.solana.isMathWallet,
    };
  }

  return providersRegistry;
}

async function getAvailableWalletProviders() {
  let providers = await internalGetOrLookForProviders();
  let providersList = [];

  if (providers.hasPhantom) {
    providersList.push(extensionWallets.phantom);
  }

  if (providers.hasSolflare) {
    providersList.push(extensionWallets.solflare);
  }

  if (providers.hasSlope) {
    providersList.push(extensionWallets.slope);
  }

  if (providers.hasCoin98) {
    providersList.push(extensionWallets.coin98);
  }

  if (providers.hasMath) {
    providersList.push(extensionWallets.math);
  }

  let result = JSON.stringify(providersList);
  globalUnityInstance.SendMessage("Button", "ProcessWalletProviders", result); // Should be 'Scene' object
}

async function internalGetWalletProvider(providerName) {
  let providers = await internalGetOrLookForProviders();

  let provider = undefined;
  let providerInfo = extensionWallets[providerName];

  if (providerName === "phantom" && providers.hasPhantom) {
    provider = await walletCtx.solana;
  } else if (providerName === "math" && providers.hasMath) {
    provider = walletCtx.solana;
  } else if (providerName === "solflare" && providers.hasSolflare) {
    provider = walletCtx.solana;
  } else if (providerName === "slope" && providers.hasSlope) {
    provider = new walletCtx.Slope();
  } else if (providerName === "coin98" && providers.hasCoin98) {
    provider = walletCtx.coin98.sol;
    provider.isCoin98Wallet = true;
  }
  return [provider, providerInfo];
}

const connectCoin98Wallet = async (provider) => {
  try {
    const accounts = await provider.request({ method: "sol_accounts" });
    if (accounts[0]) {
      provider.publicKey = new PublicKey(accounts[0]);
    }
  } finally {
  }
};

let providerName = "phantom";
function setWalletProvider(name) {
  providerName = name;
  console.log("ProviderName= ", providerName);
}

async function connectToWalletProvider(unusedProvderName) {
  console.log("connectToWalletProvider(" + providerName + ")");
  let [walletProvider, providerInfo] = await internalGetWalletProvider(
    providerName
  );
  if (!walletProvider) {
    globalUnityInstance.SendMessage(
      "Button",
      "OnWalletConnectionFailed",
      providerName
    ); // Should be 'Scene' object
    return;
  }

  console.log("Provider: ", walletProvider);
  console.log("ProviderInfo: ", providerInfo);

  let walletPublicKey = undefined;

  try {
    if (walletProvider.isCoin98Wallet) {
      await connectCoin98Wallet(walletProvider);
    } else {
      const { msg, data } = await walletProvider.connect();
      let success = true;

      if (msg && msg !== "ok") {
        // Slope connection rejected
        success = false;
      }

      if (!success) {
        throw new Error("Connection rejected");
      } else if (data) {
        // Slope PublicKey data is outside of walletProvider element
        walletProvider.publicKey = new PublicKey(data.publicKey);
        walletProvider.isSlopeWallet = true;
      } else {
        walletPublicKey = walletProvider.publicKey;
      }
    }
  } catch (e) {
    globalUnityInstance.SendMessage(
      "Button",
      "OnWalletConnectionFailed",
      providerName
    );
  }

  if (walletPublicKey) {
    const connectedProvider = {
      name: providerName,
      publicKey: walletPublicKey.toString(),
    };
    globalUnityInstance.SendMessage(
      "Button",
      "OnWalletConnected",
      JSON.stringify(connectedProvider)
    ); // Should be 'Scene' object
  }
}
