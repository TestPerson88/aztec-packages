import { LogFn } from '@aztec/foundation/log';
import { ProtocolArtifacts, ProtocolCircuitArtifacts } from '@aztec/noir-protocol-circuits-types';

import { Command } from 'commander';

import { generateProvingKeyForNoirCircuit, generateVerificationKeyForNoirCircuit } from './execute.js';

const { BB_WORKING_DIRECTORY, BB_BINARY_PATH } = process.env;

/**
 * Returns commander program that defines the CLI.
 * @param log - Console logger.
 * @param debugLogger - Debug logger.
 * @returns The CLI.
 */
export function getProgram(log: LogFn): Command {
  const program = new Command();

  program.name('bb-cli').description('CLI for interacting with Barretenberg.');

  program
    .command('protocol-circuits')
    .description('Lists the available protocol circuit artifacts')
    .action(() => {
      log(Object.keys(ProtocolCircuitArtifacts).reduce((prev: string, x: string) => prev.concat(`\n${x}`)));
    });

  program
    .command('write_pk')
    .description('Generates the proving key for the specified circuit')
    .requiredOption(
      '-w, --working-directory <string>',
      'A directory to use for storing input/output files',
      BB_WORKING_DIRECTORY,
    )
    .requiredOption('-b, --bb-path <string>', 'The path to the BB binary', BB_BINARY_PATH)
    .requiredOption('-c, --circuit <string>', 'The name of a protocol circuit')
    .action(async options => {
      const compiledCircuit = ProtocolCircuitArtifacts[options.circuit as ProtocolArtifacts];
      if (!compiledCircuit) {
        log(`Failed to find circuit ${options.circuit}`);
        return;
      }
      await generateProvingKeyForNoirCircuit(
        options.bbPath,
        options.workingDirectory,
        options.circuit,
        compiledCircuit,
        log,
      );
    });

  program
    .command('write_vk')
    .description('Generates the verification key for the specified circuit')
    .requiredOption(
      '-w, --working-directory <string>',
      'A directory to use for storing input/output files',
      BB_WORKING_DIRECTORY,
    )
    .requiredOption('-b, --bb-path <string>', 'The path to the BB binary', BB_BINARY_PATH)
    .requiredOption('-c, --circuit <string>', 'The name of a protocol circuit')
    .action(async options => {
      const compiledCircuit = ProtocolCircuitArtifacts[options.circuit as ProtocolArtifacts];
      if (!compiledCircuit) {
        log(`Failed to find circuit ${options.circuit}`);
        return;
      }
      await generateVerificationKeyForNoirCircuit(
        options.bbPath,
        options.workingDirectory,
        options.circuit,
        compiledCircuit,
        log,
      );
    });
  return program;
}
