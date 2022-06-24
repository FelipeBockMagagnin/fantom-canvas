import '../styles/globals.css'

import '@rainbow-me/rainbowkit/styles.css';

import {
  connectorsForWallets,
  RainbowKitProvider,
  wallet
} from '@rainbow-me/rainbowkit';
import {
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

const fantomTestnetChain = {
  id: 0xfa2,
  name: 'Fantom TestNet',
  network: 'fantom',
  iconUrl: 'https://example.com/icon.svg',
  iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'Fantom',
    symbol: 'FTM',
  },
  rpcUrls: {
    default: 'https://rpc.testnet.fantom.network/',
  },
  blockExplorers: {
    default: { name: 'Fantom Scan', url: 'https://testnet.ftmscan.com/' },
  },
  testnet: true,
};

const { chains, provider } = configureChains(
  [fantomTestnetChain],
  [jsonRpcProvider({ rpc: chain => ({ http: chain.rpcUrls.default }) })]
);

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [
        wallet.metaMask({ chains }),
      ],
    }
  ]
);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} coolMode>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp
