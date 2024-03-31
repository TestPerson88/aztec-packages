import { Fr } from '@aztec/foundation/fields';

import { allSameExcept, anyAvmContextInputs, initExecutionEnvironment } from './fixtures/index.js';
import { AztecAddress } from '@aztec/circuits.js';

describe('Execution Environment', () => {
  const newAddress = new Fr(123456n);
  const calldata = [new Fr(1n), new Fr(2n), new Fr(3n)];

  it('New call should fork execution environment correctly', () => {
    const executionEnvironment = initExecutionEnvironment();
    const newExecutionEnvironment = executionEnvironment.deriveEnvironmentForNestedCall(AztecAddress.fromField(newAddress), calldata);

    expect(newExecutionEnvironment).toEqual(
      allSameExcept(executionEnvironment, {
        address: newAddress,
        storageAddress: newAddress,
        // Calldata also includes AvmContextInputs
        calldata: anyAvmContextInputs().concat(calldata),
      }),
    );
  });

  it('New delegate call should fork execution environment correctly', () => {
    const executionEnvironment = initExecutionEnvironment();
    const newExecutionEnvironment = executionEnvironment.newDelegateCall(AztecAddress.fromField(newAddress), calldata);

    expect(newExecutionEnvironment).toEqual(
      allSameExcept(executionEnvironment, {
        address: newAddress,
        isDelegateCall: true,
        // Calldata also includes AvmContextInputs
        calldata: anyAvmContextInputs().concat(calldata),
      }),
    );
  });

  it('New static call call should fork execution environment correctly', () => {
    const executionEnvironment = initExecutionEnvironment();
    const newExecutionEnvironment = executionEnvironment.deriveEnvironmentForNestedStaticCall(AztecAddress.fromField(newAddress), calldata);

    expect(newExecutionEnvironment).toEqual(
      allSameExcept(executionEnvironment, {
        address: newAddress,
        storageAddress: newAddress,
        isStaticCall: true,
        // Calldata also includes AvmContextInputs
        calldata: anyAvmContextInputs().concat(calldata),
      }),
    );
  });
});
