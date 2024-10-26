import { Keypair, PublicKey, TransactionInstruction } from "@solana/web3.js";
import { keccak_256 } from "@noble/hashes/sha3";
import {
  buildAndSignTx,
  CompressedAccount,
  CompressedAccountWithMerkleContext,
  CompressedProofWithContext,
  defaultTestStateTreeAccounts,
  getIndexOrAdd,
  NewAddressParams,
  packCompressedAccounts,
  PackedMerkleContext,
  packNewAddressParams,
  Rpc,
  sendAndConfirmTx,
} from "@lightprotocol/stateless.js";

export const hashvToBn254FieldSizeBe = (bytes: Uint8Array[]): Uint8Array => {
  const hasher = keccak_256.create();
  for (const input of bytes) {
    hasher.update(input);
  }
  const hash = hasher.digest();
  hash[0] = 0;
  return hash;
};

export const deriveAddressSeed = (
  seeds: Uint8Array[],
  programId: PublicKey,
  address_merkle_tree: PublicKey
) => {
  const inputs: Uint8Array[] = [
    programId.toBytes(),
    address_merkle_tree.toBytes(),
    ...seeds,
  ];

  const hash = hashvToBn254FieldSizeBe(inputs);
  return hash;
};

export const packWithInput = (
  inputCompressedAccounts: CompressedAccountWithMerkleContext[],
  outputCompressedAccounts: CompressedAccount[],
  newAddressesParams: NewAddressParams[],
  proof: CompressedProofWithContext
) => {
  const {
    remainingAccounts: _remainingAccounts,
    packedInputCompressedAccounts,
  } = packCompressedAccounts(
    inputCompressedAccounts,
    proof.rootIndices,
    outputCompressedAccounts
  );
  const { newAddressParamsPacked, remainingAccounts } = packNewAddressParams(
    newAddressesParams,
    _remainingAccounts
  );
  let {
    addressMerkleTreeAccountIndex,
    addressMerkleTreeRootIndex,
    addressQueueAccountIndex,
  } = newAddressParamsPacked[0];

  const merkleContext = packedInputCompressedAccounts[0].merkleContext;
  return {
    addressMerkleContext: {
      addressMerkleTreePubkeyIndex: addressMerkleTreeAccountIndex,
      addressQueuePubkeyIndex: addressQueueAccountIndex,
    },
    addressMerkleTreeRootIndex,
    merkleContext,
    remainingAccounts,
  };
};

export const packNew = (
  outputCompressedAccounts: CompressedAccount[],
  newAddressesParams: NewAddressParams[],
  proof: CompressedProofWithContext
) => {
  const { merkleTree, nullifierQueue } = defaultTestStateTreeAccounts();
  const { remainingAccounts: _remainingAccounts } = packCompressedAccounts(
    [],
    proof.rootIndices,
    outputCompressedAccounts
  );
  const { newAddressParamsPacked, remainingAccounts } = packNewAddressParams(
    newAddressesParams,
    _remainingAccounts
  );
  let merkleContext: PackedMerkleContext = {
    leafIndex: 0,
    merkleTreePubkeyIndex: getIndexOrAdd(remainingAccounts, merkleTree),
    nullifierQueuePubkeyIndex: getIndexOrAdd(remainingAccounts, nullifierQueue),
    queueIndex: null,
  };
  let {
    addressMerkleTreeAccountIndex,
    addressMerkleTreeRootIndex,
    addressQueueAccountIndex,
  } = newAddressParamsPacked[0];
  return {
    addressMerkleContext: {
      addressMerkleTreePubkeyIndex: addressMerkleTreeAccountIndex,
      addressQueuePubkeyIndex: addressQueueAccountIndex,
    },
    addressMerkleTreeRootIndex,
    merkleContext,
    remainingAccounts: remainingAccounts.map((account) => ({
      pubkey: account,
      isSigner: false,
      isWritable: true,
    })),
  };
};

export const getNewAddressParams = (
  addressSeed: Uint8Array,
  proof: CompressedProofWithContext
) => {
  const addressParams: NewAddressParams = {
    seed: addressSeed,
    addressMerkleTreeRootIndex: proof.rootIndices[proof.rootIndices.length - 1],
    addressMerkleTreePubkey: proof.merkleTrees[proof.merkleTrees.length - 1],
    addressQueuePubkey: proof.nullifierQueues[proof.nullifierQueues.length - 1],
  };
  return addressParams;
};

export const buildSignAndSendTransaction = async (
  instructions: TransactionInstruction[],
  payer: Keypair,
  connection: Rpc
) => {
  const { blockhash } = await connection.getLatestBlockhash();

  const tx = buildAndSignTx(instructions, payer, blockhash);
  const txSignature = await sendAndConfirmTx(connection, tx, {
    commitment: "confirmed",
  });
  return txSignature;
};
