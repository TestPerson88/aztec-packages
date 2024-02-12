import { GrumpkinPrivateKey, GrumpkinScalar, createPXEClient } from '@aztec/aztec.js';
import { BlankContractArtifact } from '../artifacts/Blank';
import { AccountManager } from '@aztec/aztec.js/account';
import { SingleKeyAccountContract } from '@aztec/accounts/single_key';

const GRUMPKIN_KEY = GrumpkinScalar.random();

export class PrivateEnv {
  pxe;
  accountContract;
  account: AccountManager;

  constructor(
    private privateKey: GrumpkinPrivateKey,
    private pxeURL?: string,
  ) {
    this.pxe = createPXEClient(this.pxeURL || 'http://localhost:8080');
    this.accountContract = new SingleKeyAccountContract(privateKey);
    this.account = new AccountManager(this.pxe, this.privateKey, this.accountContract);
  }

  async getWallet() {
    // taking advantage that register is no-op if already registered
    return await this.account.register();
  }
}

export const deployerEnv = new PrivateEnv(GRUMPKIN_KEY, process.env.PXE_URL);

const IGNORE_FUNCTIONS = ['constructor', 'compute_note_hash_and_nullifier'];
export const filteredInterface = BlankContractArtifact.functions.filter(f => !IGNORE_FUNCTIONS.includes(f.name));
