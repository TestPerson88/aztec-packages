import {
  AccountWallet,
  CompleteAddress,
  DebugLogger,
  Fr,
  GrumpkinPrivateKey,
  GrumpkinScalar,
  PXE,
  PublicKey,
  TxStatus,
  generatePublicKey,
  getContractDeploymentInfo,
} from '@aztec/aztec.js';
import { EscrowContract, EscrowContractArtifact } from '@aztec/noir-contracts/Escrow';
import { TokenContract } from '@aztec/noir-contracts/Token';

import { setup } from './fixtures/utils.js';

describe('e2e_public_fees', () => {
  // AZT is the token being sent, and used to pay fees.
  const TOKEN_NAME = 'Aztec Token';
  const TOKEN_SYMBOL = 'AZT';
  const TOKEN_DECIMALS = 18n;
  let asset: TokenContract;

  let feePaymentContract: EscrowContract;

  let pxe: PXE;
  let logger: DebugLogger;

  let sender: AccountWallet;
  let senderAddress: CompleteAddress;
  let escrowPrivateKey: GrumpkinPrivateKey;
  let escrowPublicKey: PublicKey;
  // let recipient: Wallet;
  // let recipientAddress: CompleteAddress;
  // let sequencer: Wallet;
  // let sequencerAddress: CompleteAddress;
  // let aztecNode: AztecNode;
  let teardown: () => Promise<void>;

  beforeEach(async () => {
    ({
      // aztecNode,
      pxe,
      accounts: [senderAddress], // recipientAddress, sequencerAddress],
      wallets: [sender], // recipient, sequencer],
      logger,
      teardown: teardown,
    } = await setup(3, {
      enableFees: true,
    }));

    logger.info('senderAddress: ' + senderAddress.toReadableString());

    const registeredAccounts = await pxe.getRegisteredAccounts();
    logger.info(
      'registeredAccounts:\n ' +
        JSON.stringify(
          registeredAccounts.map(a => a.toReadableString()),
          null,
          2,
        ),
    );

    asset = await TokenContract.deploy(sender, senderAddress, TOKEN_NAME, TOKEN_SYMBOL, TOKEN_DECIMALS)
      .send()
      .deployed();

    logger.info('asset address: ' + asset.completeAddress.toReadableString());

    expect(await asset.methods.admin().view()).toBe(senderAddress.address.toBigInt());

    // Deploy the fee payment contract. Note that we don't yet register it in our account contract
    escrowPrivateKey = GrumpkinScalar.random();
    escrowPublicKey = generatePublicKey(escrowPrivateKey);
    const salt = Fr.random();
    const deployInfo = getContractDeploymentInfo(EscrowContractArtifact, [senderAddress], salt, escrowPublicKey);
    await pxe.registerAccount(escrowPrivateKey, deployInfo.completeAddress.partialAddress);
    feePaymentContract = await EscrowContract.deployWithPublicKey(escrowPublicKey, sender, senderAddress)
      .send({ contractAddressSalt: salt })
      .deployed();
    logger.info('fee payment contract address: ' + feePaymentContract.completeAddress.toReadableString());
  }, 100_000);

  afterEach(async () => {
    await teardown();
  });

  it('can set fee payment contract in account', async () => {
    const tx = await sender.setFeeContractAddress(feePaymentContract.completeAddress.address).send().wait();

    expect(tx.status).toBe(TxStatus.MINED);
  });
});
