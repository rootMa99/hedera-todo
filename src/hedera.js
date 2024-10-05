import { Client } from "@hashgraph/sdk";

export const hederaClient = () => {
  const client = Client.forTestnet();
  client.setOperator(
    process.env.REACT_APP_HEDERA_ACCOUNT_ID,
    process.env.REACT_APP_HEDERA_PRIVATE_KEY
  );
  return client;
};
