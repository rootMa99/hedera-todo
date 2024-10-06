import {
  Client,
  PrivateKey,
  AccountId,
  FileCreateTransaction,
  FileAppendTransaction,
  FileContentsQuery,
} from "@hashgraph/sdk";

// Setting up Hedera client
export const hederaClient = () => {
  if (!process.env.REACT_APP_HEDERA_ACCOUNT_ID || !process.env.REACT_APP_HEDERA_PRIVATE_KEY) {
      throw new Error("Missing REACT_APP_HEDERA_ACCOUNT_ID or REACT_APP_HEDERA_PRIVATE_KEY in environment variables");
  }

  const accountId = AccountId.fromString(process.env.REACT_APP_HEDERA_ACCOUNT_ID);
  const privateKey = PrivateKey.fromString(process.env.REACT_APP_HEDERA_PRIVATE_KEY);

  const client = Client.forTestnet();
  client.setOperator(accountId, privateKey);

  return client;
};

// Create a new file for storing ToDos
export const createTodoFile = async () => {
  const client = hederaClient();

  const transaction = await new FileCreateTransaction()
      .setKeys([PrivateKey.fromString(process.env.REACT_APP_HEDERA_PRIVATE_KEY)])
      .setContents("Initial ToDo List")
      .execute(client);

  const receipt = await transaction.getReceipt(client);
  const fileId = receipt.fileId;
  console.log("File created with ID:", fileId);

  return fileId;
};

// Add a new ToDo item
export const createTodo = async (fileId, newTask) => {
  const client = hederaClient();

  const transaction = await new FileAppendTransaction()
      .setFileId(fileId)
      .setContents(newTask + "\n")
      .execute(client);

  const receipt = await transaction.getReceipt(client);

  if (receipt.status.toString() !== "SUCCESS") {
      throw new Error(`Failed to add task: ${receipt.status}`);
  }

  console.log("Task added successfully");
};

export const getAllTodos = async (fileId) => {
  const client = hederaClient();

  const query = await new FileContentsQuery()
      .setFileId(fileId)
      .execute(client);

  // Convert the byte array (Uint8Array) to string
  const content = new TextDecoder().decode(query);
  
  // Split content into tasks by line breaks and filter out any empty lines
  const todos = content.split("\n").filter(Boolean);

  return todos;
};