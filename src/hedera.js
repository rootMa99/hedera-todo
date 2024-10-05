import { Client, FileCreateTransaction, FileContentsQuery, PrivateKey, FileUpdateTransaction } from "@hashgraph/sdk";

let todosListFileId = ""; // Initialize variable to store file ID

// Initialize Hedera Client
export const hederaClient = () => {
  const client = Client.forTestnet();
  const accountId = process.env.REACT_APP_HEDERA_ACCOUNT_ID;
  const privateKey = process.env.REACT_APP_HEDERA_PRIVATE_KEY;

  if (!accountId || !privateKey) {
    throw new Error("Account ID or Private Key is not defined in the environment variables.");
  }

  // Ensure the private key is processed correctly
  const key = PrivateKey.fromStringED25519(privateKey); // Use fromStringED25519 for ED25519 keys
  client.setOperator(accountId, key);
  return client;
};

// Function to create a list file if it doesn't exist
const ensureTodosListFile = async (client) => {
  if (!todosListFileId) {
    const fileCreateTx = await new FileCreateTransaction()
      .setContents("") // Start with an empty list
      .execute(client);
    const receipt = await fileCreateTx.getReceipt(client);
    todosListFileId = receipt.fileId.toString(); // Store the created File ID
    console.log("Created ToDo List File ID:", todosListFileId); // Log the created File ID
  } else {
    console.log("ToDo List File ID already exists:", todosListFileId);
  }
};

// Function to create a new ToDo
export const createTodo = async (todo) => {
  const client = hederaClient();
  await ensureTodosListFile(client); // Ensure the list file exists

  const currentContents = await getTodo(todosListFileId); // Get current contents
  const updatedContents = currentContents + (currentContents ? "," : "") + todo; // Append new todo
  const fileUpdateTx = await new FileUpdateTransaction()
    .setFileId(todosListFileId)
    .setContents(updatedContents) // Update file with new todo
    .execute(client);
  await fileUpdateTx.getReceipt(client);
  console.log("ToDo added:", todo);
};

// Function to retrieve a single ToDo
export const getTodo = async (fileId) => {
  const client = hederaClient();
  const query = new FileContentsQuery()
    .setFileId(fileId);
  const contents = await query.execute(client);
  return contents.toString(); // Return contents as string
};

// Function to retrieve all ToDos
export const getAllTodos = async () => {
  const client = hederaClient();

  if (!todosListFileId) {
    console.error("ToDo List File ID is undefined. Ensure that you have created the list file.");
    throw new Error("ToDo List File ID is undefined. Ensure that you have created the list file.");
  }

  const todosIds = await getTodo(todosListFileId); // Get the list of all ToDo IDs
  const todoIdArray = todosIds.split(',').map(id => id.trim()).filter(id => id); // Filter out empty IDs

  // Retrieve each ToDo's content
  const todos = await Promise.all(todoIdArray.map(async (fileId) => {
    return await getTodo(fileId);
  }));

  return todos; // Return all ToDo contents
};
