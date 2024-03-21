#include "bigint_constraint.hpp"
#include "barretenberg/common/assert.hpp"
#include "barretenberg/dsl/types.hpp"
#include "barretenberg/numeric/uint256/uint256.hpp"
#include "barretenberg/numeric/uintx/uintx.hpp"
#include "barretenberg/stdlib/primitives/bigfield/bigfield.hpp"
#include <cstddef>
#include <cstdint>

namespace acir_format {

ModulusId modulus_param_to_id(ModulusParam param)
{
    if (Bn254FqParams::modulus_0 == param.modulus_0 && Bn254FqParams::modulus_1 == param.modulus_1 &&
        Bn254FqParams::modulus_2 == param.modulus_2 && Bn254FqParams::modulus_3 == param.modulus_3) {
        return ModulusId::BN254_FQ;
    }
    if (Bn254FrParams::modulus_0 == param.modulus_0 && Bn254FrParams::modulus_1 == param.modulus_1 &&
        Bn254FrParams::modulus_2 == param.modulus_2 && Bn254FrParams::modulus_3 == param.modulus_3) {
        return ModulusId::BN254_FR;
    }
    if (secp256k1::FqParams::modulus_0 == param.modulus_0 && secp256k1::FqParams::modulus_1 == param.modulus_1 &&
        secp256k1::FqParams::modulus_2 == param.modulus_2 && secp256k1::FqParams::modulus_3 == param.modulus_3) {
        return ModulusId::SECP256K1_FQ;
    }
    if (secp256k1::FrParams::modulus_0 == param.modulus_0 && secp256k1::FrParams::modulus_1 == param.modulus_1 &&
        secp256k1::FrParams::modulus_2 == param.modulus_2 && secp256k1::FrParams::modulus_3 == param.modulus_3) {
        return ModulusId::SECP256K1_FR;
    }
    if (secp256r1::FqParams::modulus_0 == param.modulus_0 && secp256r1::FqParams::modulus_1 == param.modulus_1 &&
        secp256r1::FqParams::modulus_2 == param.modulus_2 && secp256r1::FqParams::modulus_3 == param.modulus_3) {
        return ModulusId::SECP256R1_FQ;
    }
    if (secp256r1::FrParams::modulus_0 == param.modulus_0 && secp256r1::FrParams::modulus_1 == param.modulus_1 &&
        secp256r1::FrParams::modulus_2 == param.modulus_2 && secp256r1::FrParams::modulus_3 == param.modulus_3) {
        return ModulusId::SECP256R1_FR;
    }
    if (0 == param.modulus_0 && 0 == param.modulus_1 && 0 == param.modulus_2 && 0 == param.modulus_3) {
        return ModulusId::U256;
    }
    return ModulusId::UNKNOWN;
}

template void create_bigint_operations_constraint<UltraCircuitBuilder>(const BigIntOperation& input,
                                                                       DSLBigInts<UltraCircuitBuilder>& dsl_bigint,
                                                                       bool has_valid_witness_assignments);
template void create_bigint_operations_constraint<GoblinUltraCircuitBuilder>(
    const BigIntOperation& input,
    DSLBigInts<GoblinUltraCircuitBuilder>& dsl_bigint,
    bool has_valid_witness_assignments);
template void create_bigint_addition_constraint<UltraCircuitBuilder>(const BigIntOperation& input,
                                                                     DSLBigInts<UltraCircuitBuilder>& dsl_bigint);
template void create_bigint_addition_constraint<GoblinUltraCircuitBuilder>(
    const BigIntOperation& input, DSLBigInts<GoblinUltraCircuitBuilder>& dsl_bigint);
template void create_bigint_sub_constraint<UltraCircuitBuilder>(const BigIntOperation& input,
                                                                DSLBigInts<UltraCircuitBuilder>& dsl_bigint);
template void create_bigint_sub_constraint<GoblinUltraCircuitBuilder>(
    const BigIntOperation& input, DSLBigInts<GoblinUltraCircuitBuilder>& dsl_bigint);
template void create_bigint_mul_constraint<UltraCircuitBuilder>(const BigIntOperation& input,
                                                                DSLBigInts<UltraCircuitBuilder>& dsl_bigint);
template void create_bigint_mul_constraint<GoblinUltraCircuitBuilder>(
    const BigIntOperation& input, DSLBigInts<GoblinUltraCircuitBuilder>& dsl_bigint);
template void create_bigint_div_constraint<UltraCircuitBuilder>(const BigIntOperation& input,
                                                                DSLBigInts<UltraCircuitBuilder>& dsl_bigint,
                                                                bool has_valid_witness_assignments);
template void create_bigint_div_constraint<GoblinUltraCircuitBuilder>(const BigIntOperation& input,
                                                                      DSLBigInts<GoblinUltraCircuitBuilder>& dsl_bigint,
                                                                      bool has_valid_witness_assignments);

template <typename Builder>
void create_bigint_addition_constraint(const BigIntOperation& input, DSLBigInts<Builder>& dsl_bigint)
{
    switch (dsl_bigint.get_modulus_id(input.lhs)) {
    case ModulusId::BN254_FR: {
        auto lhs = dsl_bigint.bn254_fr(input.lhs);
        auto rhs = dsl_bigint.bn254_fr(input.rhs);
        dsl_bigint.set_bn254_fr(lhs + rhs, input.result);
        break;
    }
    case ModulusId::BN254_FQ: {
        auto lhs = dsl_bigint.bn254_fq(input.lhs);
        auto rhs = dsl_bigint.bn254_fq(input.rhs);
        dsl_bigint.set_bn254_fq(lhs + rhs, input.result);
        break;
    }
    case ModulusId::SECP256K1_FQ: {
        auto lhs = dsl_bigint.secp256k1_fq(input.lhs);
        auto rhs = dsl_bigint.secp256k1_fq(input.rhs);
        dsl_bigint.set_secp256k1_fq(lhs + rhs, input.result);
        break;
    }
    case ModulusId::SECP256K1_FR: {
        auto lhs = dsl_bigint.secp256k1_fr(input.lhs);
        auto rhs = dsl_bigint.secp256k1_fr(input.rhs);
        dsl_bigint.set_secp256k1_fr(lhs + rhs, input.result);
        break;
    }
    case ModulusId::SECP256R1_FQ: {
        auto lhs = dsl_bigint.secp256r1_fq(input.lhs);
        auto rhs = dsl_bigint.secp256r1_fq(input.rhs);
        dsl_bigint.set_secp256r1_fq(lhs + rhs, input.result);
        break;
    }
    case ModulusId::SECP256R1_FR: {
        auto lhs = dsl_bigint.secp256r1_fr(input.lhs);
        auto rhs = dsl_bigint.secp256r1_fr(input.rhs);
        dsl_bigint.set_secp256r1_fr(lhs + rhs, input.result);
        break;
    }
    case ModulusId::U256: {
        auto lhs = dsl_bigint.uint256(input.lhs);
        auto rhs = dsl_bigint.uint256(input.rhs);
        dsl_bigint.set_big_uint256(lhs + rhs, input.result);
        break;
    }

    default: {
        ASSERT(false);
    }
    }
}

template <typename Builder>
void create_bigint_sub_constraint(const BigIntOperation& input, DSLBigInts<Builder>& dsl_bigint)
{
    switch (dsl_bigint.get_modulus_id(input.lhs)) {
    case ModulusId::BN254_FR: {
        auto lhs = dsl_bigint.bn254_fr(input.lhs);
        auto rhs = dsl_bigint.bn254_fr(input.rhs);
        dsl_bigint.set_bn254_fr(lhs - rhs, input.result);
        break;
    }
    case ModulusId::BN254_FQ: {
        auto lhs = dsl_bigint.bn254_fq(input.lhs);
        auto rhs = dsl_bigint.bn254_fq(input.rhs);
        dsl_bigint.set_bn254_fq(lhs - rhs, input.result);
        break;
    }
    case ModulusId::SECP256K1_FQ: {
        auto lhs = dsl_bigint.secp256k1_fq(input.lhs);
        auto rhs = dsl_bigint.secp256k1_fq(input.rhs);
        dsl_bigint.set_secp256k1_fq(lhs - rhs, input.result);
        break;
    }
    case ModulusId::SECP256K1_FR: {
        auto lhs = dsl_bigint.secp256k1_fr(input.lhs);
        auto rhs = dsl_bigint.secp256k1_fr(input.rhs);
        dsl_bigint.set_secp256k1_fr(lhs - rhs, input.result);
        break;
    }
    case ModulusId::SECP256R1_FQ: {
        auto lhs = dsl_bigint.secp256r1_fq(input.lhs);
        auto rhs = dsl_bigint.secp256r1_fq(input.rhs);
        dsl_bigint.set_secp256r1_fq(lhs - rhs, input.result);
        break;
    }
    case ModulusId::SECP256R1_FR: {
        auto lhs = dsl_bigint.secp256r1_fr(input.lhs);
        auto rhs = dsl_bigint.secp256r1_fr(input.rhs);
        dsl_bigint.set_secp256r1_fr(lhs - rhs, input.result);
        break;
    }
    case ModulusId::U256: {
        auto lhs = dsl_bigint.uint256(input.lhs);
        auto rhs = dsl_bigint.uint256(input.rhs);
        dsl_bigint.set_big_uint256(lhs - rhs, input.result);
        break;
    }
    default: {
        ASSERT(false);
    }
    }
}

template <typename Builder>
void create_bigint_mul_constraint(const BigIntOperation& input, DSLBigInts<Builder>& dsl_bigint)
{
    switch (dsl_bigint.get_modulus_id(input.lhs)) {
    case ModulusId::BN254_FR: {
        auto lhs = dsl_bigint.bn254_fr(input.lhs);
        auto rhs = dsl_bigint.bn254_fr(input.rhs);
        dsl_bigint.set_bn254_fr(lhs * rhs, input.result);
        break;
    }
    case ModulusId::BN254_FQ: {
        auto lhs = dsl_bigint.bn254_fq(input.lhs);
        auto rhs = dsl_bigint.bn254_fq(input.rhs);
        dsl_bigint.set_bn254_fq(lhs * rhs, input.result);
        break;
    }
    case ModulusId::SECP256K1_FQ: {
        auto lhs = dsl_bigint.secp256k1_fq(input.lhs);
        auto rhs = dsl_bigint.secp256k1_fq(input.rhs);
        dsl_bigint.set_secp256k1_fq(lhs * rhs, input.result);
        break;
    }
    case ModulusId::SECP256K1_FR: {
        auto lhs = dsl_bigint.secp256k1_fr(input.lhs);
        auto rhs = dsl_bigint.secp256k1_fr(input.rhs);
        dsl_bigint.set_secp256k1_fr(lhs * rhs, input.result);
        break;
    }
    case ModulusId::SECP256R1_FQ: {
        auto lhs = dsl_bigint.secp256r1_fq(input.lhs);
        auto rhs = dsl_bigint.secp256r1_fq(input.rhs);
        dsl_bigint.set_secp256r1_fq(lhs * rhs, input.result);
        break;
    }
    case ModulusId::SECP256R1_FR: {
        auto lhs = dsl_bigint.secp256r1_fr(input.lhs);
        auto rhs = dsl_bigint.secp256r1_fr(input.rhs);
        dsl_bigint.set_secp256r1_fr(lhs * rhs, input.result);
        break;
    }
    case ModulusId::U256: {
        auto lhs = dsl_bigint.uint256(input.lhs);
        auto rhs = dsl_bigint.uint256(input.rhs);
        dsl_bigint.set_big_uint256(lhs * rhs, input.result);
        break;
    }
    default: {
        ASSERT(false);
    }
    }
}

template <typename Builder>
void create_bigint_div_constraint(const BigIntOperation& input,
                                  DSLBigInts<Builder>& dsl_bigint,
                                  bool has_valid_witness_assignments)
{
    if (!has_valid_witness_assignments) {
        // Asserts catch the case where the divisor is zero, so we need to provide a different value (1) to avoid the
        // assert
        std::array<uint32_t, 5> limbs_idx;
        dsl_bigint.get_witness_idx_of_limbs(input.rhs, limbs_idx);
        dsl_bigint.set_value(1, limbs_idx);
    }

    switch (dsl_bigint.get_modulus_id(input.lhs)) {
    case ModulusId::BN254_FR: {
        auto lhs = dsl_bigint.bn254_fr(input.lhs);
        auto rhs = dsl_bigint.bn254_fr(input.rhs);
        dsl_bigint.set_bn254_fr(lhs / rhs, input.result);
        break;
    }
    case ModulusId::BN254_FQ: {
        auto lhs = dsl_bigint.bn254_fq(input.lhs);
        auto rhs = dsl_bigint.bn254_fq(input.rhs);
        dsl_bigint.set_bn254_fq(lhs / rhs, input.result);
        break;
    }
    case ModulusId::SECP256K1_FQ: {
        auto lhs = dsl_bigint.secp256k1_fq(input.lhs);
        auto rhs = dsl_bigint.secp256k1_fq(input.rhs);
        dsl_bigint.set_secp256k1_fq(lhs / rhs, input.result);
        break;
    }
    case ModulusId::SECP256K1_FR: {
        auto lhs = dsl_bigint.secp256k1_fr(input.lhs);
        auto rhs = dsl_bigint.secp256k1_fr(input.rhs);
        dsl_bigint.set_secp256k1_fr(lhs / rhs, input.result);
        break;
    }
    case ModulusId::SECP256R1_FQ: {
        auto lhs = dsl_bigint.secp256r1_fq(input.lhs);
        auto rhs = dsl_bigint.secp256r1_fq(input.rhs);
        dsl_bigint.set_secp256r1_fq(lhs / rhs, input.result);
        break;
    }
    case ModulusId::SECP256R1_FR: {
        auto lhs = dsl_bigint.secp256r1_fr(input.lhs);
        auto rhs = dsl_bigint.secp256r1_fr(input.rhs);
        dsl_bigint.set_secp256r1_fr(lhs / rhs, input.result);
        break;
    }
    case ModulusId::U256: {
        auto lhs = dsl_bigint.uint256(input.lhs);
        auto rhs = dsl_bigint.uint256(input.rhs);
        auto result = lhs / rhs;
        dsl_bigint.set_big_uint256(result, input.result);
        break;
    }
    default: {
        ASSERT(false);
    }
    }
}

template <typename Builder>
void create_bigint_operations_constraint(const BigIntOperation& input,
                                         DSLBigInts<Builder>& dsl_bigint,
                                         bool has_valid_witness_assignments)
{
    switch (input.opcode) {
    case BigIntOperationType::Add: {
        create_bigint_addition_constraint<Builder>(input, dsl_bigint);
        break;
    }
    case BigIntOperationType::Sub: {
        create_bigint_sub_constraint<Builder>(input, dsl_bigint);
        break;
    }
    case BigIntOperationType::Mul: {
        create_bigint_mul_constraint<Builder>(input, dsl_bigint);
        break;
    }
    case BigIntOperationType::Div: {
        create_bigint_div_constraint<Builder>(input, dsl_bigint, has_valid_witness_assignments);
        break;
    }
    default: {
        ASSERT(false);
    }
    }
}

template <typename Builder>
void create_bigint_from_le_bytes_constraint(Builder& builder,
                                            const BigIntFromLeBytes& input,
                                            DSLBigInts<Builder>& dsl_bigints)
{
    using big_bn254_fq = bb::stdlib::bigfield<Builder, bb::Bn254FqParams>;
    using big_bn254_fr = bb::stdlib::bigfield<Builder, bb::Bn254FrParams>;
    using big_secp256k1_fq = bb::stdlib::bigfield<Builder, secp256k1::FqParams>;
    using big_secp256k1_fr = bb::stdlib::bigfield<Builder, secp256k1::FrParams>;
    using big_secp256r1_fq = bb::stdlib::bigfield<Builder, secp256r1::FqParams>;
    using big_secp256r1_fr = bb::stdlib::bigfield<Builder, secp256r1::FrParams>;
    using big_uint256 = bb::stdlib::bigfielddyn<Builder>;
    using field_ct = bb::stdlib::field_t<Builder>;

    // Construct the modulus from its bytes
    uint64_t modulus_64 = 0;
    uint64_t base = 1;
    std::vector<uint64_t> modulus_limbs;
    for (std::size_t i = 0; i < 32; ++i) {
        if (i < input.modulus.size()) {
            modulus_64 += input.modulus[i] * base;
            base = base * 256;
            if ((i + 1) % 8 == 0) {
                modulus_limbs.push_back(modulus_64);
                modulus_64 = 0;
                base = 1;
            }
        }
    }
    auto modulus = ModulusParam{ .modulus_0 = modulus_limbs[0],
                                 .modulus_1 = modulus_limbs[1],
                                 .modulus_2 = modulus_limbs[2],
                                 .modulus_3 = modulus_limbs[3] };
    bb::stdlib::byte_array<Builder> rev_bytes = bb::stdlib::byte_array<Builder>(&builder, 32);
    for (size_t i = 0; i < 32; ++i) {
        rev_bytes[i] = 0;
        if (i < input.inputs.size()) {
            field_ct element = field_ct::from_witness_index(&builder, input.inputs[i]);
            rev_bytes.set_byte(i, element);
        }
    }
    bb::stdlib::byte_array<Builder> bytes = rev_bytes.reverse();

    auto modulus_id = modulus_param_to_id(modulus);
    switch (modulus_id) {
    case BN254_FQ: {
        auto big = big_bn254_fq(bytes);
        dsl_bigints.set_bn254_fq(big, input.result);
        break;
    }
    case BN254_FR: {
        auto big = big_bn254_fr(bytes);
        dsl_bigints.set_bn254_fr(big, input.result);
        break;
    }
    case SECP256K1_FQ: {
        auto big = big_secp256k1_fq(bytes);
        dsl_bigints.set_secp256k1_fq(big, input.result);
        break;
    }
    case SECP256K1_FR: {
        auto big = big_secp256k1_fr(bytes);
        dsl_bigints.set_secp256k1_fr(big, input.result);
        break;
    }
    case SECP256R1_FQ: {
        auto big = big_secp256r1_fq(bytes);
        dsl_bigints.set_secp256r1_fq(big, input.result);
        break;
    }
    case SECP256R1_FR: {
        auto big = big_secp256r1_fr(bytes);
        dsl_bigints.set_secp256r1_fr(big, input.result);
        break;
    }
    case U256: {
        uint512_t modulus = uint512_t(1) << 256;
        auto big = big_uint256(bytes, modulus);
        dsl_bigints.set_big_uint256(big, input.result);
        break;
    }
    case UNKNOWN:
    default:
        ASSERT(false);
        break;
    }
}

template <typename Builder>
void create_bigint_to_le_bytes_constraint(Builder& builder,
                                          const BigIntToLeBytes& input,
                                          DSLBigInts<Builder>& dsl_bigints)
{
    using big_bn254_fq = bb::stdlib::bigfield<Builder, bb::Bn254FqParams>;
    using big_bn254_fr = bb::stdlib::bigfield<Builder, bb::Bn254FrParams>;
    using big_secp256k1_fq = bb::stdlib::bigfield<Builder, secp256k1::FqParams>;
    using big_secp256k1_fr = bb::stdlib::bigfield<Builder, secp256k1::FrParams>;
    using big_secp256r1_fq = bb::stdlib::bigfield<Builder, secp256r1::FqParams>;
    using big_secp256r1_fr = bb::stdlib::bigfield<Builder, secp256r1::FrParams>;
    using big_uint256 = bb::stdlib::bigfielddyn<Builder>;

    auto modulus_id = dsl_bigints.get_modulus_id(input.input);
    bb::stdlib::byte_array<Builder> byte_array;
    switch (modulus_id) {
    case BN254_FQ: {
        big_bn254_fq big = dsl_bigints.bn254_fq(input.input);
        big.self_reduce();
        byte_array = big.to_byte_array();

        break;
    }
    case BN254_FR: {
        big_bn254_fr big = dsl_bigints.bn254_fr(input.input);
        big.self_reduce();
        byte_array = big.to_byte_array();
        break;
    }
    case SECP256K1_FQ: {
        big_secp256k1_fq big = dsl_bigints.secp256k1_fq(input.input);
        big.self_reduce();
        byte_array = big.to_byte_array();
        break;
    }
    case SECP256K1_FR: {
        big_secp256k1_fr big = dsl_bigints.secp256k1_fr(input.input);
        big.self_reduce();
        byte_array = big.to_byte_array();
        break;
    }
    case SECP256R1_FQ: {
        big_secp256r1_fq big = dsl_bigints.secp256r1_fq(input.input);
        big.self_reduce();
        byte_array = big.to_byte_array();
        break;
    }
    case SECP256R1_FR: {
        big_secp256r1_fr big = dsl_bigints.secp256r1_fr(input.input);
        big.self_reduce();
        byte_array = big.to_byte_array();
        break;
    }
    case U256: {
        big_uint256 big = dsl_bigints.uint256(input.input);
        big.self_reduce();
        byte_array = big.to_byte_array();
        break;
    }
    case UNKNOWN:
    default:
        ASSERT(false);
        break;
    }
    byte_array = byte_array.reverse();
    ASSERT(input.result.size() <= byte_array.size());
    for (size_t i = 0; i < byte_array.size(); ++i) {
        if (i < input.result.size()) {

            // This should instead use assert_equal: builder.assert_equal(byte_array[i].normalize().witness_index,
            // input.result[i]); but unit tests require this because they do not constraint the witness, and then if we
            // use assert_equal in that case, we can generate a proof for non matching values (cf test_assert_equal in
            // field.test.cpp). We should check that Noir always constraint the results of to_bytes
            poly_triple assert_equal{
                .a = byte_array[i].normalize().witness_index,
                .b = input.result[i],
                .c = 0,
                .q_m = 0,
                .q_l = 1,
                .q_r = -1,
                .q_o = 0,
                .q_c = 0,
            };
            builder.create_poly_gate(assert_equal);
        } else {
            byte_array[i].normalize().is_zero();
        }
    }
}

template void create_bigint_from_le_bytes_constraint<UltraCircuitBuilder>(UltraCircuitBuilder& builder,
                                                                          const BigIntFromLeBytes& input,
                                                                          DSLBigInts<UltraCircuitBuilder>& dsl_bigints);
template void create_bigint_from_le_bytes_constraint<GoblinUltraCircuitBuilder>(
    GoblinUltraCircuitBuilder& builder,
    const BigIntFromLeBytes& input,
    DSLBigInts<GoblinUltraCircuitBuilder>& dsl_bigints);
template void create_bigint_to_le_bytes_constraint<UltraCircuitBuilder>(UltraCircuitBuilder& builder,
                                                                        const BigIntToLeBytes& input,
                                                                        DSLBigInts<UltraCircuitBuilder>& dsl_bigints);

template void create_bigint_to_le_bytes_constraint<GoblinUltraCircuitBuilder>(
    GoblinUltraCircuitBuilder& builder,
    const BigIntToLeBytes& input,
    DSLBigInts<GoblinUltraCircuitBuilder>& dsl_bigints);

} // namespace acir_format
