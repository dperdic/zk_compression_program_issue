# Compressed Program Issue Reproduction

This repo is based on the [ZK Compression template](https://github.com/mjkid221/zk_compression_program) by mjkdi221 and initialized via `light init <PROGRAM_NAME>`. It adds TS based tests to help the reader understand how to write tests for a Light program in Anchor.

## Prerequisites

- [Light CLI](https://github.com/Lightprotocol/light-protocol/tree/03b17ab48b6292a1abd1c2a8dac0a2b7d49e6e30/cli) must be installed.
- Ensure you have Anchor and Solana CLI tools installed.

## Setup

1. Run `avm use`
2. Run `yarn`.
3. Run `yarn build`

## Testing

Run the TS tests:

```
yarn test:ts
```

## Issue

The issue occurs while trying to init a new light account and update an existing one within the same function. The program fails during proof verification. This is most likely caused by incorrect proof derivation outside the program.

The function in this example is called `init_and_increment`.

The following error is logged.

```txt
1) ZkCounter
       Should init dummy and increment the counter:
     Error: Simulation failed.
Message: Transaction simulation failed: Error processing Instruction 2: custom program error: 0x32ce.
Logs:
[
  "Program log: Public inputs: [[39, 77, 35, 4, 27, 11, 26, 138, 94, 33, 197, 79, 151, 188, 209, 11, 204, 91, 93, 230, 151, 127, 242, 120, 228, 63, 238, 191, 230, 121, 139, 191], [6, 48, 209, 246, 2, 83, 47, 255, 56, 226, 149, 229, 238, 78, 69, 136, 175, 115, 2, 164, 3, 132, 198, 108, 101, 82, 122, 18, 102, 210, 219, 156], [33, 133, 56, 184, 142, 166, 110, 161, 4, 140, 169, 247, 115, 33, 15, 181, 76, 89, 48, 126, 58, 86, 204, 81, 16, 121, 185, 77, 75, 152, 43, 15], [0, 61, 70, 46, 173, 98, 70, 133, 241, 139, 84, 222, 58, 134, 143, 213, 136, 66, 206, 246, 151, 144, 206, 231, 148, 114, 121, 4, 112, 77, 35, 3]]",
  "Program log: Proof A: [40, 165, 18, 198, 8, 236, 255, 218, 169, 251, 20, 113, 254, 66, 223, 248, 142, 100, 191, 145, 48, 107, 251, 37, 238, 13, 66, 119, 59, 165, 6, 98, 20, 180, 38, 176, 12, 121, 79, 219, 216, 224, 95, 202, 133, 217, 37, 0, 226, 226, 18, 63, 84, 17, 124, 154, 145, 104, 150, 124, 137, 150, 26, 121]",
  "Program log: Proof B: [44, 213, 90, 201, 181, 53, 211, 113, 193, 254, 28, 109, 25, 108, 105, 59, 7, 137, 170, 167, 206, 151, 81, 135, 143, 152, 235, 75, 177, 248, 207, 187, 3, 22, 251, 196, 247, 227, 158, 27, 129, 243, 105, 163, 215, 250, 152, 57, 90, 48, 40, 144, 47, 212, 112, 25, 230, 107, 88, 46, 165, 221, 222, 5, 28, 36, 70, 169, 142, 92, 12, 92, 115, 95, 134, 130, 65, 26, 246, 233, 182, 49, 74, 35, 61, 9, 118, 12, 34, 61, 42, 226, 168, 5, 213, 158, 8, 83, 129, 61, 225, 90, 71, 33, 166, 91, 121, 167, 89, 135, 176, 143, 65, 75, 167, 191, 61, 231, 210, 215, 13, 255, 58, 216, 244, 93, 243, 172]",
  "Program log: Proof C: [9, 247, 161, 195, 233, 125, 5, 94, 180, 1, 245, 140, 226, 207, 104, 193, 252, 28, 109, 110, 199, 10, 176, 54, 107, 106, 2, 111, 171, 205, 253, 118, 6, 197, 132, 230, 156, 97, 64, 33, 111, 241, 211, 236, 40, 115, 132, 62, 160, 18, 45, 230, 74, 252, 53, 161, 93, 240, 154, 147, 112, 159, 54, 66]",
  "Program log: input_compressed_accounts_with_merkle_context: [PackedCompressedAccountWithMerkleContext { compressed_account: CompressedAccount { owner: pst8edPuyRh6MEdhGJPZGQRQpUcHS6V3fnwMFLcFxBZ, lamports: 0, address: Some([0, 61, 70, 46, 173, 98, 70, 133, 241, 139, 84, 222, 58, 134, 143, 213, 136, 66, 206, 246, 151, 144, 206, 231, 148, 114, 121, 4, 112, 77, 35, 3]), data: Some(CompressedAccountData { discriminator: [172, 15, 142, 171, 199, 240, 149, 236], data: [4, 243, 22, 151, 107, 164, 223, 79, 144, 226, 177, 252, 49, 97, 65, 2, 152, 112, 44, 137, 90, 71, 120, 16, 219, 157, 82, 116, 31, 225, 195, 21, 1, 0, 0, 0, 0, 0, 0, 0], data_hash: [29, 203, 46, 90, 62, 238, 216, 193, 89, 155, 124, 185, 219, 32, 151, 110, 87, 99, 230, 125, 40, 164, 21, 238, 159, 144, 159, 41, 208, 226, 189, 114] }) }, merkle_context: PackedMerkleContext { merkle_tree_pubkey_index: 0, nullifier_queue_pubkey_index: 1, leaf_index: 1, queue_index: None }, root_index: 2, read_only: false }]",
  "Program log: ProgramError occurred. Error Code: Custom(13006). Error Number: 13006. Error Message: Custom program error: 0x32ce.",
  "Program SySTEM1eSU2p4BGQfQpimFEWWSC1XDFeun3Nqzz3rT7 consumed 335371 of 940552 compute units",
  "Program SySTEM1eSU2p4BGQfQpimFEWWSC1XDFeun3Nqzz3rT7 failed: custom program error: 0x32ce",
  "Program pst8edPuyRh6MEdhGJPZGQRQpUcHS6V3fnwMFLcFxBZ consumed 394519 of 999700 compute units",
  "Program pst8edPuyRh6MEdhGJPZGQRQpUcHS6V3fnwMFLcFxBZ failed: custom program error: 0x32ce"
].
```
