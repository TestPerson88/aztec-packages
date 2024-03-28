#!/usr/bin/env bash

set -e

yarn build:fast

yarn workspace @aztec/circuit-types test tx_effect

OVERWRITE_TEST_DATA=1 yarn workspace @aztec/end-to-end test integration_l1_publisher.test.ts
AZTEC_GENERATE_TEST_DATA=1 yarn workspace @aztec/end-to-end test e2e_nested_contract -t 'performs nested calls'

yarn workspace @aztec/circuits.js test -u
yarn workspace @aztec/noir-protocol-circuits-types test -u
yarn workspace @aztec/protocol-contracts test -u
