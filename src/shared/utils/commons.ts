import { StdFee } from "@cosmjs/stargate";

export const SECRET_CHAIN_ID = "secret-4";
export const SECRET_LCD = "https://lcd.mainnet.secretsaturn.net";

export const faucetURL = "https://faucet.secretsaturn.net/claim";
export const faucetAddress = "secret1tq6y8waegggp4fv2fcxk3zmpsmlfadyc7lsd69";

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const gasPriceUscrt = 0.25;
export function gasToFee(gas: number, denom: string): StdFee {
  return {
    amount: [
      {
        amount: String(Math.floor(gas * gasPriceUscrt) + 1),
        denom: denom ? denom : "uscrt",
      },
    ],
    gas: String(gas),
  };
}

const COUNT_ABBRS = [
  "",
  "K",
  "M",
  "B",
  "t",
  "q",
  "s",
  "S",
  "o",
  "n",
  "d",
  "U",
  "D",
  "T",
  "Qt",
  "Qd",
  "Sd",
  "St",
];

export function formatNumber(count: number, decimals = 2) {
  const i = count < 1 ? 0 : Math.floor(Math.log(count) / Math.log(1000));
  return (
    parseFloat((count / 1000 ** i).toFixed(decimals)).toString() +
    COUNT_ABBRS[i]
  );
}
