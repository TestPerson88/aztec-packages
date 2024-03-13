#pragma once
#include "barretenberg/proof_system/arithmetization/arithmetization.hpp"
#include "barretenberg/proof_system/execution_trace/execution_trace.hpp"
#include "barretenberg/proof_system/op_queue/ecc_op_queue.hpp"
#include "ultra_circuit_builder.hpp"

namespace bb {

using namespace bb;

template <typename FF> class GoblinUltraCircuitBuilder_ : public UltraCircuitBuilder_<UltraHonkArith<FF>> {
  public:
    using Arithmetization = UltraHonkArith<FF>;

    static constexpr std::string_view NAME_STRING = "GoblinUltraArithmetization";
    static constexpr CircuitType CIRCUIT_TYPE = CircuitType::ULTRA;
    static constexpr size_t DEFAULT_NON_NATIVE_FIELD_LIMB_BITS =
        UltraCircuitBuilder_<UltraHonkArith<FF>>::DEFAULT_NON_NATIVE_FIELD_LIMB_BITS;

    size_t num_ecc_op_gates = 0; // number of ecc op "gates" (rows); these are placed at the start of the circuit

    // Stores record of ecc operations and performs corresponding native operations internally
    std::shared_ptr<ECCOpQueue> op_queue;

    // Indices for constant variables corresponding to ECCOpQueue op codes
    uint32_t null_op_idx;
    uint32_t add_accum_op_idx;
    uint32_t mul_accum_op_idx;
    uint32_t equality_op_idx;

    // DataBus call/return data arrays
    std::vector<uint32_t> public_calldata;
    std::vector<uint32_t> calldata_read_counts;
    std::vector<uint32_t> public_return_data;

    // Functions for adding ECC op queue "gates"
    ecc_op_tuple queue_ecc_add_accum(const g1::affine_element& point);
    ecc_op_tuple queue_ecc_mul_accum(const g1::affine_element& point, const FF& scalar);
    ecc_op_tuple queue_ecc_eq();

  private:
    void populate_ecc_op_wires(const ecc_op_tuple& in);
    ecc_op_tuple decompose_ecc_operands(uint32_t op, const g1::affine_element& point, const FF& scalar = FF::zero());
    void set_goblin_ecc_op_code_constant_variables();

  public:
    GoblinUltraCircuitBuilder_(const size_t size_hint = 0,
                               std::shared_ptr<ECCOpQueue> op_queue_in = std::make_shared<ECCOpQueue>())
        : UltraCircuitBuilder_<UltraHonkArith<FF>>(size_hint)
        , op_queue(op_queue_in)
    {
        // Set indices to constants corresponding to Goblin ECC op codes
        set_goblin_ecc_op_code_constant_variables();
    };
    GoblinUltraCircuitBuilder_(std::shared_ptr<ECCOpQueue> op_queue_in)
        : GoblinUltraCircuitBuilder_(0, op_queue_in)
    {}

    /**
     * @brief Constructor from data generated from ACIR
     *
     * @param op_queue_in Op queue to which goblinized group ops will be added
     * @param witness_values witnesses values known to acir
     * @param public_inputs indices of public inputs in witness array
     * @param varnum number of known witness
     *
     * @note The size of witness_values may be less than varnum. The former is the set of actual witness values known at
     * the time of acir generation. The former may be larger and essentially accounts for placeholders for witnesses
     * that we know will exist but whose values are not known during acir generation. Both are in general less than the
     * total number of variables/witnesses that might be present for a circuit generated from acir, since many gates
     * will depend on the details of the bberg implementation (or more generally on the backend used to process acir).
     */
    GoblinUltraCircuitBuilder_(std::shared_ptr<ECCOpQueue> op_queue_in,
                               auto& witness_values,
                               std::vector<uint32_t>& public_inputs,
                               size_t varnum)
        : UltraCircuitBuilder_<UltraHonkArith<FF>>(/*size_hint=*/0, witness_values, public_inputs, varnum)
        , op_queue(op_queue_in)
    {
        // Set indices to constants corresponding to Goblin ECC op codes
        set_goblin_ecc_op_code_constant_variables();
    };

    void finalize_circuit();
    void add_gates_to_ensure_all_polys_are_non_zero();

    size_t get_num_constant_gates() const override { return 0; }

    /**
     * @brief Get the final number of gates in a circuit, which consists of the sum of:
     * 1) Current number number of actual gates
     * 2) Number of public inputs, as we'll need to add a gate for each of them
     * 3) Number of Rom array-associated gates
     * 4) Number of range-list associated gates
     * 5) Number of non-native field multiplication gates.
     *
     * @return size_t
     */
    size_t get_num_gates() const override
    {
        auto num_ultra_gates = UltraCircuitBuilder_<UltraHonkArith<FF>>::get_num_gates();
        return num_ultra_gates + num_ecc_op_gates;
    }

    /**x
     * @brief Print the number and composition of gates in the circuit
     *
     */
    virtual void print_num_gates() const override
    {
        size_t count = 0;
        size_t rangecount = 0;
        size_t romcount = 0;
        size_t ramcount = 0;
        size_t nnfcount = 0;
        UltraCircuitBuilder_<UltraHonkArith<FF>>::get_num_gates_split_into_components(
            count, rangecount, romcount, ramcount, nnfcount);

        size_t total = count + romcount + ramcount + rangecount + num_ecc_op_gates;
        std::cout << "gates = " << total << " (arith " << count << ", rom " << romcount << ", ram " << ramcount
                  << ", range " << rangecount << ", non native field gates " << nnfcount << ", goblin ecc op gates "
                  << num_ecc_op_gates << "), pubinp = " << this->public_inputs.size() << std::endl;
    }

    /**
     * @brief Add a witness variable to the public calldata.
     *
     * @param in Value to be added to calldata.
     * */
    uint32_t add_public_calldata(const FF& in)
    {
        const uint32_t index = this->add_variable(in);
        public_calldata.emplace_back(index);
        // Note: this is a bit inefficient to do every time but for safety these need to be coupled
        calldata_read_counts.resize(public_calldata.size());
        return index;
    }

    void create_calldata_lookup_gate(const databus_lookup_gate_<FF>& in);

    void create_poseidon2_external_gate(const poseidon2_external_gate_<FF>& in);
    void create_poseidon2_internal_gate(const poseidon2_internal_gate_<FF>& in);
};
using GoblinUltraCircuitBuilder = GoblinUltraCircuitBuilder_<bb::fr>;
} // namespace bb
