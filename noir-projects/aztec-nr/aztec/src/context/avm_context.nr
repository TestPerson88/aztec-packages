use dep::protocol_types::{address::{AztecAddress, EthAddress}, constants::L1_TO_L2_MESSAGE_LENGTH, header::Header};
use dep::protocol_types::traits::{Serialize};
use dep::protocol_types::abis::function_selector::FunctionSelector;
use dep::protocol_types::abis::public_circuit_public_inputs::PublicCircuitPublicInputs;
use dep::protocol_types::constants::RETURN_VALUES_LENGTH;
use crate::context::inputs::PublicContextInputs;
use crate::context::interface::ContextInterface;

// Getters that will be converted by the transpiler into their
// own opcodes
struct AVMContext {
    selector: FunctionSelector,
    args_hash: Field,

    return_values : BoundedVec<Field, RETURN_VALUES_LENGTH>,
}

// ORACLES
#[oracle(avmOpcodeAddress)]
fn address() -> AztecAddress {}

#[oracle(avmOpcodeStorageAddress)]
fn storage_address() -> AztecAddress {}

#[oracle(avmOpcodeOrigin)]
fn origin() -> AztecAddress {}

#[oracle(avmOpcodeSender)]
fn sender() -> AztecAddress {}

#[oracle(avmOpcodePortal)]
fn portal() -> EthAddress {}

#[oracle(avmOpcodeFeePerL1Gas)]
fn fee_per_l1_gas() -> Field {}

#[oracle(avmOpcodeFeePerL2Gas)]
fn fee_per_l2_gas() -> Field {}

#[oracle(avmOpcodeFeePerDaGas)]
fn fee_per_da_gas() -> Field {}

#[oracle(avmOpcodeChainId)]
fn chain_id() -> Field {}

#[oracle(avmOpcodeVersion)]
fn version() -> Field {}

#[oracle(avmOpcodeBlockNumber)]
fn block_number() -> Field {}

#[oracle(avmOpcodeTimestamp)]
fn timestamp() -> Field {}

// #[oracle(avmOpcodeContractCallDepth)]
// fn contract_call_depth() -> Field {}

#[oracle(avmOpcodeNoteHashExists)]
fn note_hash_exists(note_hash: Field, leaf_index: Field) -> u8 {}

#[oracle(avmOpcodeEmitNoteHash)]
fn emit_note_hash(note_hash: Field) {}

#[oracle(avmOpcodeNullifierExists)]
fn nullifier_exists(nullifier: Field) -> u8 {}

#[oracle(avmOpcodeEmitNullifier)]
fn emit_nullifier(nullifier: Field) {}

/**
* Emit a log with the given event selector and message.
*
* @param event_selector The event selector for the log.
* @param message The message to emit in the log.
* Should be automatically convertible to [Field; N]. For example str<N> works with
* one char per field. Otherwise you can use CompressedString.
*/
#[oracle(amvOpcodeEmitUnencryptedLog)]
fn emit_unencrypted_log<T>(event_selector: Field, message: T) {}

#[oracle(avmOpcodeL1ToL2MsgExists)]
fn l1_to_l2_msg_exists(msg_hash: Field, msg_leaf_index: Field) -> u8 {}

#[oracle(avmOpcodeSendL2ToL1Msg)]
fn send_l2_to_l1_msg(recipient: EthAddress, content: Field) {}

#[oracle(avmOpcodeCall)]
fn call<ARGS_COUNT, RET_SIZE>(
    gas: [Field; 3], // gas allocation: [l1Gas, l2Gas, daGas]
    address: AztecAddress,
    args: [Field; ARGS_COUNT],
    temporary_function_selector: Field
) -> ([Field; RET_SIZE], u8) {}
//    ^ return data      ^ success

#[oracle(avmOpcodeStaticCall)]
fn call_static<ARGS_COUNT, RET_SIZE>(
    gas: [Field; 3], // gas allocation: [l1Gas, l2Gas, daGas]
    address: AztecAddress,
    args: [Field; ARGS_COUNT],
    // TODO(5110): consider passing in calldata directly
    temporary_function_selector: Field
) -> ([Field; RET_SIZE], u8) {}
//    ^ return data      ^ success

impl AVMContext {
    pub fn new(inputs: PublicContextInputs, args_hash: Field) -> AVMContext {
        AVMContext { selector: inputs.call_context.function_selector, args_hash, return_values: BoundedVec::new() }
    }

    pub fn consume_l1_to_l2_message(
        &mut self,
        _msg_key: Field,
        _content: Field,
        _secret: Field,
        _sender: EthAddress
    ) {
        assert(false, "Not implemented!");
    }

    pub fn call_public_function<ARGS_COUNT, RET_SIZE>(
        self: Self,
        contract_address: AztecAddress,
        temporary_function_selector: FunctionSelector,
        args: [Field; ARGS_COUNT]
    ) -> [Field; RET_SIZE] {
        let gas = [/*l1Gas*/42, /*l2Gas*/24, /*daGas*/420];

        let results = call(
            gas,
            contract_address,
            args,
            temporary_function_selector.to_field()
        );
        let returnData: [Field; RET_SIZE] = results.0;
        let success: u8 = results.1;
        assert(success == 1, "Nested call failed!");

        returnData
    }

    pub fn static_call_public_function<ARGS_COUNT, RET_SIZE>(
        self: Self,
        contract_address: AztecAddress,
        temporary_function_selector: FunctionSelector,
        args: [Field; ARGS_COUNT]
    ) -> [Field; RET_SIZE] {
        let gas = [/*l1Gas*/42, /*l2Gas*/24, /*daGas*/420];

        let (returnData, success): ([Field; RET_SIZE], u8) = call_static(
            gas,
            contract_address,
            args,
            temporary_function_selector.to_field()
        );

        assert(success == 1, "Nested static call failed!");
        returnData
    }

    pub fn finish(self) -> PublicCircuitPublicInputs {
        // // TODO(https://github.com/AztecProtocol/aztec-packages/issues/1165)
        // let unencrypted_logs_hash = [0; NUM_FIELDS_PER_SHA256];
        // let unencrypted_log_preimages_length = 0;

        // // Compute the public call stack hashes
        // let pub_circuit_pub_inputs = PublicCircuitPublicInputs {
        //     call_context: inputs.call_context, // Done
        //     args_hash: args_hash, // Done
        //     nullifier_read_requests: nullifier_read_requests.storage,
        //     contract_storage_update_requests: contract_storage_update_requests.storage,
        //     contract_storage_reads: contract_storage_reads.storage,
        //     return_values: return_values.storage,
        //     new_note_hashes: new_note_hashes.storage,
        //     new_nullifiers: new_nullifiers.storage,
        //     public_call_stack_hashes: public_call_stack_hashes.storage,
        //     new_l2_to_l1_msgs: new_l2_to_l1_msgs.storage,
        //     unencrypted_logs_hash,
        //     unencrypted_log_preimages_length,
        //     historical_header: inputs.historical_header,
        //     prover_address: prover_address,
        //     reverted: false
        // };
        // pub_circuit_pub_inputs
        dep::std::unsafe::zeroed()
    }
}

impl ContextInterface for AVMContext {
    fn push_new_note_hash(&mut self, note_hash: Field) {
        emit_note_hash(note_hash);
    }
    fn push_new_nullifier(&mut self, nullifier: Field, _nullified_commitment: Field) {
        // Cannot nullify pending commitments in AVM, so `nullified_commitment` is not used
        emit_nullifier(nullifier);
    }
    fn msg_sender(self) -> AztecAddress {
        sender()
    }
    fn this_address(self) -> AztecAddress {
        address()
    }
    fn this_portal_address(self) -> EthAddress {
        assert(false, "'this_portal_address' not implemented!");
        EthAddress::zero()
    }
    fn chain_id(self) -> Field {
        chain_id()
    }
    fn version(self) -> Field {
        version()
    }
    fn selector(self) -> FunctionSelector {
        self.selector
    }
    fn get_header(self) -> Header {
        assert(false, "'get_header' not implemented!");
        Header::empty()
    }
    fn nullifier_exists(self, nullifier: Field) -> u8 {
        nullifier_exists(nullifier)
    }
}
