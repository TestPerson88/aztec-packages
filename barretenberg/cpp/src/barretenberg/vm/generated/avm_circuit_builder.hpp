

// AUTOGENERATED FILE
#pragma once

#include "barretenberg/common/constexpr_utils.hpp"
#include "barretenberg/common/throw_or_abort.hpp"
#include "barretenberg/ecc/curves/bn254/fr.hpp"
#include "barretenberg/honk/proof_system/logderivative_library.hpp"
#include "barretenberg/relations/generic_lookup/generic_lookup_relation.hpp"
#include "barretenberg/relations/generic_permutation/generic_permutation_relation.hpp"
#include "barretenberg/stdlib_circuit_builders/circuit_builder_base.hpp"

#include "barretenberg/relations/generated/avm/avm_alu.hpp"
#include "barretenberg/relations/generated/avm/avm_binary.hpp"
#include "barretenberg/relations/generated/avm/avm_main.hpp"
#include "barretenberg/relations/generated/avm/avm_mem.hpp"
#include "barretenberg/relations/generated/avm/incl_main_tag_err.hpp"
#include "barretenberg/relations/generated/avm/incl_mem_tag_err.hpp"
#include "barretenberg/relations/generated/avm/lookup_byte_lengths.hpp"
#include "barretenberg/relations/generated/avm/lookup_byte_operations.hpp"
#include "barretenberg/relations/generated/avm/perm_main_alu.hpp"
#include "barretenberg/relations/generated/avm/perm_main_bin.hpp"
#include "barretenberg/relations/generated/avm/perm_main_mem_a.hpp"
#include "barretenberg/relations/generated/avm/perm_main_mem_b.hpp"
#include "barretenberg/relations/generated/avm/perm_main_mem_c.hpp"
#include "barretenberg/relations/generated/avm/perm_main_mem_ind_a.hpp"
#include "barretenberg/relations/generated/avm/perm_main_mem_ind_b.hpp"
#include "barretenberg/relations/generated/avm/perm_main_mem_ind_c.hpp"
#include "barretenberg/vm/generated/avm_flavor.hpp"

namespace bb {

template <typename FF> struct AvmFullRow {
    FF avm_main_clk{};
    FF avm_main_first{};
    FF avm_mem_m_clk{};
    FF avm_mem_m_sub_clk{};
    FF avm_mem_m_addr{};
    FF avm_mem_m_tag{};
    FF avm_mem_m_val{};
    FF avm_mem_m_lastAccess{};
    FF avm_mem_m_last{};
    FF avm_mem_m_rw{};
    FF avm_mem_r_in_tag{};
    FF avm_mem_w_in_tag{};
    FF avm_mem_m_op_a{};
    FF avm_mem_m_op_b{};
    FF avm_mem_m_op_c{};
    FF avm_mem_m_ind_op_a{};
    FF avm_mem_m_ind_op_b{};
    FF avm_mem_m_ind_op_c{};
    FF avm_mem_m_sel_mov{};
    FF avm_mem_m_tag_err{};
    FF avm_mem_m_one_min_inv{};
    FF avm_alu_alu_clk{};
    FF avm_alu_alu_ia{};
    FF avm_alu_alu_ib{};
    FF avm_alu_alu_ic{};
    FF avm_alu_alu_op_add{};
    FF avm_alu_alu_op_sub{};
    FF avm_alu_alu_op_mul{};
    FF avm_alu_alu_op_div{};
    FF avm_alu_alu_op_not{};
    FF avm_alu_alu_op_eq{};
    FF avm_alu_alu_sel{};
    FF avm_alu_alu_in_tag{};
    FF avm_alu_alu_ff_tag{};
    FF avm_alu_alu_u8_tag{};
    FF avm_alu_alu_u16_tag{};
    FF avm_alu_alu_u32_tag{};
    FF avm_alu_alu_u64_tag{};
    FF avm_alu_alu_u128_tag{};
    FF avm_alu_alu_u8_r0{};
    FF avm_alu_alu_u8_r1{};
    FF avm_alu_alu_u16_r0{};
    FF avm_alu_alu_u16_r1{};
    FF avm_alu_alu_u16_r2{};
    FF avm_alu_alu_u16_r3{};
    FF avm_alu_alu_u16_r4{};
    FF avm_alu_alu_u16_r5{};
    FF avm_alu_alu_u16_r6{};
    FF avm_alu_alu_u16_r7{};
    FF avm_alu_alu_u64_r0{};
    FF avm_alu_alu_cf{};
    FF avm_alu_alu_op_eq_diff_inv{};
    FF avm_byte_lookup_table_op_id{};
    FF avm_byte_lookup_table_input_a{};
    FF avm_byte_lookup_table_input_b{};
    FF avm_byte_lookup_table_output{};
    FF avm_byte_lookup_bin_sel{};
    FF avm_byte_lookup_table_in_tags{};
    FF avm_byte_lookup_table_byte_lengths{};
    FF avm_binary_bin_clk{};
    FF avm_binary_bin_sel{};
    FF avm_binary_acc_ia{};
    FF avm_binary_acc_ib{};
    FF avm_binary_acc_ic{};
    FF avm_binary_in_tag{};
    FF avm_binary_op_id{};
    FF avm_binary_bin_ia_bytes{};
    FF avm_binary_bin_ib_bytes{};
    FF avm_binary_bin_ic_bytes{};
    FF avm_binary_start{};
    FF avm_binary_mem_tag_ctr{};
    FF avm_binary_mem_tag_ctr_inv{};
    FF avm_main_sel_rng_8{};
    FF avm_main_sel_rng_16{};
    FF avm_main_pc{};
    FF avm_main_internal_return_ptr{};
    FF avm_main_sel_internal_call{};
    FF avm_main_sel_internal_return{};
    FF avm_main_sel_jump{};
    FF avm_main_sel_halt{};
    FF avm_main_sel_mov{};
    FF avm_main_sel_op_add{};
    FF avm_main_sel_op_sub{};
    FF avm_main_sel_op_mul{};
    FF avm_main_sel_op_div{};
    FF avm_main_sel_op_not{};
    FF avm_main_sel_op_eq{};
    FF avm_main_sel_op_and{};
    FF avm_main_sel_op_or{};
    FF avm_main_sel_op_xor{};
    FF avm_main_alu_sel{};
    FF avm_main_bin_sel{};
    FF avm_main_r_in_tag{};
    FF avm_main_w_in_tag{};
    FF avm_main_op_err{};
    FF avm_main_tag_err{};
    FF avm_main_inv{};
    FF avm_main_ia{};
    FF avm_main_ib{};
    FF avm_main_ic{};
    FF avm_main_mem_op_a{};
    FF avm_main_mem_op_b{};
    FF avm_main_mem_op_c{};
    FF avm_main_rwa{};
    FF avm_main_rwb{};
    FF avm_main_rwc{};
    FF avm_main_ind_a{};
    FF avm_main_ind_b{};
    FF avm_main_ind_c{};
    FF avm_main_ind_op_a{};
    FF avm_main_ind_op_b{};
    FF avm_main_ind_op_c{};
    FF avm_main_mem_idx_a{};
    FF avm_main_mem_idx_b{};
    FF avm_main_mem_idx_c{};
    FF avm_main_last{};
    FF avm_main_bin_op_id{};
    FF perm_main_alu{};
    FF perm_main_bin{};
    FF perm_main_mem_a{};
    FF perm_main_mem_b{};
    FF perm_main_mem_c{};
    FF perm_main_mem_ind_a{};
    FF perm_main_mem_ind_b{};
    FF perm_main_mem_ind_c{};
    FF lookup_byte_lengths{};
    FF lookup_byte_operations{};
    FF incl_main_tag_err{};
    FF incl_mem_tag_err{};
    FF lookup_byte_lengths_counts{};
    FF lookup_byte_operations_counts{};
    FF incl_main_tag_err_counts{};
    FF incl_mem_tag_err_counts{};
    FF avm_mem_m_tag_shift{};
    FF avm_mem_m_rw_shift{};
    FF avm_mem_m_addr_shift{};
    FF avm_mem_m_val_shift{};
    FF avm_binary_acc_ic_shift{};
    FF avm_binary_op_id_shift{};
    FF avm_binary_acc_ib_shift{};
    FF avm_binary_mem_tag_ctr_shift{};
    FF avm_binary_acc_ia_shift{};
    FF avm_main_internal_return_ptr_shift{};
    FF avm_main_pc_shift{};
    FF avm_alu_alu_u16_r1_shift{};
    FF avm_alu_alu_u16_r3_shift{};
    FF avm_alu_alu_u16_r2_shift{};
    FF avm_alu_alu_u16_r5_shift{};
    FF avm_alu_alu_u16_r4_shift{};
    FF avm_alu_alu_u16_r6_shift{};
    FF avm_alu_alu_u16_r0_shift{};
    FF avm_alu_alu_u16_r7_shift{};
};

class AvmCircuitBuilder {
  public:
    using Flavor = bb::AvmFlavor;
    using FF = Flavor::FF;
    using Row = AvmFullRow<FF>;

    // TODO: template
    using Polynomial = Flavor::Polynomial;
    using ProverPolynomials = Flavor::ProverPolynomials;

    static constexpr size_t num_fixed_columns = 152;
    static constexpr size_t num_polys = 133;
    std::vector<Row> rows;

    void set_trace(std::vector<Row>&& trace) { rows = std::move(trace); }

    ProverPolynomials compute_polynomials()
    {
        const auto num_rows = get_circuit_subgroup_size();
        ProverPolynomials polys;

        // Allocate mem for each column
        for (auto& poly : polys.get_all()) {
            poly = Polynomial(num_rows);
        }

        for (size_t i = 0; i < rows.size(); i++) {
            polys.avm_main_clk[i] = rows[i].avm_main_clk;
            polys.avm_main_first[i] = rows[i].avm_main_first;
            polys.avm_mem_m_clk[i] = rows[i].avm_mem_m_clk;
            polys.avm_mem_m_sub_clk[i] = rows[i].avm_mem_m_sub_clk;
            polys.avm_mem_m_addr[i] = rows[i].avm_mem_m_addr;
            polys.avm_mem_m_tag[i] = rows[i].avm_mem_m_tag;
            polys.avm_mem_m_val[i] = rows[i].avm_mem_m_val;
            polys.avm_mem_m_lastAccess[i] = rows[i].avm_mem_m_lastAccess;
            polys.avm_mem_m_last[i] = rows[i].avm_mem_m_last;
            polys.avm_mem_m_rw[i] = rows[i].avm_mem_m_rw;
            polys.avm_mem_r_in_tag[i] = rows[i].avm_mem_r_in_tag;
            polys.avm_mem_w_in_tag[i] = rows[i].avm_mem_w_in_tag;
            polys.avm_mem_m_op_a[i] = rows[i].avm_mem_m_op_a;
            polys.avm_mem_m_op_b[i] = rows[i].avm_mem_m_op_b;
            polys.avm_mem_m_op_c[i] = rows[i].avm_mem_m_op_c;
            polys.avm_mem_m_ind_op_a[i] = rows[i].avm_mem_m_ind_op_a;
            polys.avm_mem_m_ind_op_b[i] = rows[i].avm_mem_m_ind_op_b;
            polys.avm_mem_m_ind_op_c[i] = rows[i].avm_mem_m_ind_op_c;
            polys.avm_mem_m_sel_mov[i] = rows[i].avm_mem_m_sel_mov;
            polys.avm_mem_m_tag_err[i] = rows[i].avm_mem_m_tag_err;
            polys.avm_mem_m_one_min_inv[i] = rows[i].avm_mem_m_one_min_inv;
            polys.avm_alu_alu_clk[i] = rows[i].avm_alu_alu_clk;
            polys.avm_alu_alu_ia[i] = rows[i].avm_alu_alu_ia;
            polys.avm_alu_alu_ib[i] = rows[i].avm_alu_alu_ib;
            polys.avm_alu_alu_ic[i] = rows[i].avm_alu_alu_ic;
            polys.avm_alu_alu_op_add[i] = rows[i].avm_alu_alu_op_add;
            polys.avm_alu_alu_op_sub[i] = rows[i].avm_alu_alu_op_sub;
            polys.avm_alu_alu_op_mul[i] = rows[i].avm_alu_alu_op_mul;
            polys.avm_alu_alu_op_div[i] = rows[i].avm_alu_alu_op_div;
            polys.avm_alu_alu_op_not[i] = rows[i].avm_alu_alu_op_not;
            polys.avm_alu_alu_op_eq[i] = rows[i].avm_alu_alu_op_eq;
            polys.avm_alu_alu_sel[i] = rows[i].avm_alu_alu_sel;
            polys.avm_alu_alu_in_tag[i] = rows[i].avm_alu_alu_in_tag;
            polys.avm_alu_alu_ff_tag[i] = rows[i].avm_alu_alu_ff_tag;
            polys.avm_alu_alu_u8_tag[i] = rows[i].avm_alu_alu_u8_tag;
            polys.avm_alu_alu_u16_tag[i] = rows[i].avm_alu_alu_u16_tag;
            polys.avm_alu_alu_u32_tag[i] = rows[i].avm_alu_alu_u32_tag;
            polys.avm_alu_alu_u64_tag[i] = rows[i].avm_alu_alu_u64_tag;
            polys.avm_alu_alu_u128_tag[i] = rows[i].avm_alu_alu_u128_tag;
            polys.avm_alu_alu_u8_r0[i] = rows[i].avm_alu_alu_u8_r0;
            polys.avm_alu_alu_u8_r1[i] = rows[i].avm_alu_alu_u8_r1;
            polys.avm_alu_alu_u16_r0[i] = rows[i].avm_alu_alu_u16_r0;
            polys.avm_alu_alu_u16_r1[i] = rows[i].avm_alu_alu_u16_r1;
            polys.avm_alu_alu_u16_r2[i] = rows[i].avm_alu_alu_u16_r2;
            polys.avm_alu_alu_u16_r3[i] = rows[i].avm_alu_alu_u16_r3;
            polys.avm_alu_alu_u16_r4[i] = rows[i].avm_alu_alu_u16_r4;
            polys.avm_alu_alu_u16_r5[i] = rows[i].avm_alu_alu_u16_r5;
            polys.avm_alu_alu_u16_r6[i] = rows[i].avm_alu_alu_u16_r6;
            polys.avm_alu_alu_u16_r7[i] = rows[i].avm_alu_alu_u16_r7;
            polys.avm_alu_alu_u64_r0[i] = rows[i].avm_alu_alu_u64_r0;
            polys.avm_alu_alu_cf[i] = rows[i].avm_alu_alu_cf;
            polys.avm_alu_alu_op_eq_diff_inv[i] = rows[i].avm_alu_alu_op_eq_diff_inv;
            polys.avm_byte_lookup_table_op_id[i] = rows[i].avm_byte_lookup_table_op_id;
            polys.avm_byte_lookup_table_input_a[i] = rows[i].avm_byte_lookup_table_input_a;
            polys.avm_byte_lookup_table_input_b[i] = rows[i].avm_byte_lookup_table_input_b;
            polys.avm_byte_lookup_table_output[i] = rows[i].avm_byte_lookup_table_output;
            polys.avm_byte_lookup_bin_sel[i] = rows[i].avm_byte_lookup_bin_sel;
            polys.avm_byte_lookup_table_in_tags[i] = rows[i].avm_byte_lookup_table_in_tags;
            polys.avm_byte_lookup_table_byte_lengths[i] = rows[i].avm_byte_lookup_table_byte_lengths;
            polys.avm_binary_bin_clk[i] = rows[i].avm_binary_bin_clk;
            polys.avm_binary_bin_sel[i] = rows[i].avm_binary_bin_sel;
            polys.avm_binary_acc_ia[i] = rows[i].avm_binary_acc_ia;
            polys.avm_binary_acc_ib[i] = rows[i].avm_binary_acc_ib;
            polys.avm_binary_acc_ic[i] = rows[i].avm_binary_acc_ic;
            polys.avm_binary_in_tag[i] = rows[i].avm_binary_in_tag;
            polys.avm_binary_op_id[i] = rows[i].avm_binary_op_id;
            polys.avm_binary_bin_ia_bytes[i] = rows[i].avm_binary_bin_ia_bytes;
            polys.avm_binary_bin_ib_bytes[i] = rows[i].avm_binary_bin_ib_bytes;
            polys.avm_binary_bin_ic_bytes[i] = rows[i].avm_binary_bin_ic_bytes;
            polys.avm_binary_start[i] = rows[i].avm_binary_start;
            polys.avm_binary_mem_tag_ctr[i] = rows[i].avm_binary_mem_tag_ctr;
            polys.avm_binary_mem_tag_ctr_inv[i] = rows[i].avm_binary_mem_tag_ctr_inv;
            polys.avm_main_sel_rng_8[i] = rows[i].avm_main_sel_rng_8;
            polys.avm_main_sel_rng_16[i] = rows[i].avm_main_sel_rng_16;
            polys.avm_main_pc[i] = rows[i].avm_main_pc;
            polys.avm_main_internal_return_ptr[i] = rows[i].avm_main_internal_return_ptr;
            polys.avm_main_sel_internal_call[i] = rows[i].avm_main_sel_internal_call;
            polys.avm_main_sel_internal_return[i] = rows[i].avm_main_sel_internal_return;
            polys.avm_main_sel_jump[i] = rows[i].avm_main_sel_jump;
            polys.avm_main_sel_halt[i] = rows[i].avm_main_sel_halt;
            polys.avm_main_sel_mov[i] = rows[i].avm_main_sel_mov;
            polys.avm_main_sel_op_add[i] = rows[i].avm_main_sel_op_add;
            polys.avm_main_sel_op_sub[i] = rows[i].avm_main_sel_op_sub;
            polys.avm_main_sel_op_mul[i] = rows[i].avm_main_sel_op_mul;
            polys.avm_main_sel_op_div[i] = rows[i].avm_main_sel_op_div;
            polys.avm_main_sel_op_not[i] = rows[i].avm_main_sel_op_not;
            polys.avm_main_sel_op_eq[i] = rows[i].avm_main_sel_op_eq;
            polys.avm_main_sel_op_and[i] = rows[i].avm_main_sel_op_and;
            polys.avm_main_sel_op_or[i] = rows[i].avm_main_sel_op_or;
            polys.avm_main_sel_op_xor[i] = rows[i].avm_main_sel_op_xor;
            polys.avm_main_alu_sel[i] = rows[i].avm_main_alu_sel;
            polys.avm_main_bin_sel[i] = rows[i].avm_main_bin_sel;
            polys.avm_main_r_in_tag[i] = rows[i].avm_main_r_in_tag;
            polys.avm_main_w_in_tag[i] = rows[i].avm_main_w_in_tag;
            polys.avm_main_op_err[i] = rows[i].avm_main_op_err;
            polys.avm_main_tag_err[i] = rows[i].avm_main_tag_err;
            polys.avm_main_inv[i] = rows[i].avm_main_inv;
            polys.avm_main_ia[i] = rows[i].avm_main_ia;
            polys.avm_main_ib[i] = rows[i].avm_main_ib;
            polys.avm_main_ic[i] = rows[i].avm_main_ic;
            polys.avm_main_mem_op_a[i] = rows[i].avm_main_mem_op_a;
            polys.avm_main_mem_op_b[i] = rows[i].avm_main_mem_op_b;
            polys.avm_main_mem_op_c[i] = rows[i].avm_main_mem_op_c;
            polys.avm_main_rwa[i] = rows[i].avm_main_rwa;
            polys.avm_main_rwb[i] = rows[i].avm_main_rwb;
            polys.avm_main_rwc[i] = rows[i].avm_main_rwc;
            polys.avm_main_ind_a[i] = rows[i].avm_main_ind_a;
            polys.avm_main_ind_b[i] = rows[i].avm_main_ind_b;
            polys.avm_main_ind_c[i] = rows[i].avm_main_ind_c;
            polys.avm_main_ind_op_a[i] = rows[i].avm_main_ind_op_a;
            polys.avm_main_ind_op_b[i] = rows[i].avm_main_ind_op_b;
            polys.avm_main_ind_op_c[i] = rows[i].avm_main_ind_op_c;
            polys.avm_main_mem_idx_a[i] = rows[i].avm_main_mem_idx_a;
            polys.avm_main_mem_idx_b[i] = rows[i].avm_main_mem_idx_b;
            polys.avm_main_mem_idx_c[i] = rows[i].avm_main_mem_idx_c;
            polys.avm_main_last[i] = rows[i].avm_main_last;
            polys.avm_main_bin_op_id[i] = rows[i].avm_main_bin_op_id;
            polys.perm_main_alu[i] = rows[i].perm_main_alu;
            polys.perm_main_bin[i] = rows[i].perm_main_bin;
            polys.perm_main_mem_a[i] = rows[i].perm_main_mem_a;
            polys.perm_main_mem_b[i] = rows[i].perm_main_mem_b;
            polys.perm_main_mem_c[i] = rows[i].perm_main_mem_c;
            polys.perm_main_mem_ind_a[i] = rows[i].perm_main_mem_ind_a;
            polys.perm_main_mem_ind_b[i] = rows[i].perm_main_mem_ind_b;
            polys.perm_main_mem_ind_c[i] = rows[i].perm_main_mem_ind_c;
            polys.lookup_byte_lengths[i] = rows[i].lookup_byte_lengths;
            polys.lookup_byte_operations[i] = rows[i].lookup_byte_operations;
            polys.incl_main_tag_err[i] = rows[i].incl_main_tag_err;
            polys.incl_mem_tag_err[i] = rows[i].incl_mem_tag_err;
            polys.lookup_byte_lengths_counts[i] = rows[i].lookup_byte_lengths_counts;
            polys.lookup_byte_operations_counts[i] = rows[i].lookup_byte_operations_counts;
            polys.incl_main_tag_err_counts[i] = rows[i].incl_main_tag_err_counts;
            polys.incl_mem_tag_err_counts[i] = rows[i].incl_mem_tag_err_counts;
        }

        polys.avm_mem_m_tag_shift = Polynomial(polys.avm_mem_m_tag.shifted());
        polys.avm_mem_m_rw_shift = Polynomial(polys.avm_mem_m_rw.shifted());
        polys.avm_mem_m_addr_shift = Polynomial(polys.avm_mem_m_addr.shifted());
        polys.avm_mem_m_val_shift = Polynomial(polys.avm_mem_m_val.shifted());
        polys.avm_binary_acc_ic_shift = Polynomial(polys.avm_binary_acc_ic.shifted());
        polys.avm_binary_op_id_shift = Polynomial(polys.avm_binary_op_id.shifted());
        polys.avm_binary_acc_ib_shift = Polynomial(polys.avm_binary_acc_ib.shifted());
        polys.avm_binary_mem_tag_ctr_shift = Polynomial(polys.avm_binary_mem_tag_ctr.shifted());
        polys.avm_binary_acc_ia_shift = Polynomial(polys.avm_binary_acc_ia.shifted());
        polys.avm_main_internal_return_ptr_shift = Polynomial(polys.avm_main_internal_return_ptr.shifted());
        polys.avm_main_pc_shift = Polynomial(polys.avm_main_pc.shifted());
        polys.avm_alu_alu_u16_r1_shift = Polynomial(polys.avm_alu_alu_u16_r1.shifted());
        polys.avm_alu_alu_u16_r3_shift = Polynomial(polys.avm_alu_alu_u16_r3.shifted());
        polys.avm_alu_alu_u16_r2_shift = Polynomial(polys.avm_alu_alu_u16_r2.shifted());
        polys.avm_alu_alu_u16_r5_shift = Polynomial(polys.avm_alu_alu_u16_r5.shifted());
        polys.avm_alu_alu_u16_r4_shift = Polynomial(polys.avm_alu_alu_u16_r4.shifted());
        polys.avm_alu_alu_u16_r6_shift = Polynomial(polys.avm_alu_alu_u16_r6.shifted());
        polys.avm_alu_alu_u16_r0_shift = Polynomial(polys.avm_alu_alu_u16_r0.shifted());
        polys.avm_alu_alu_u16_r7_shift = Polynomial(polys.avm_alu_alu_u16_r7.shifted());

        return polys;
    }

    [[maybe_unused]] bool check_circuit()
    {

        const FF gamma = FF::random_element();
        const FF beta = FF::random_element();
        bb::RelationParameters<typename Flavor::FF> params{
            .eta = 0,
            .beta = beta,
            .gamma = gamma,
            .public_input_delta = 0,
            .lookup_grand_product_delta = 0,
            .beta_sqr = 0,
            .beta_cube = 0,
            .eccvm_set_permutation_delta = 0,
        };

        auto polys = compute_polynomials();
        const size_t num_rows = polys.get_polynomial_size();

        const auto evaluate_relation = [&]<typename Relation>(const std::string& relation_name,
                                                              std::string (*debug_label)(int)) {
            typename Relation::SumcheckArrayOfValuesOverSubrelations result;
            for (auto& r : result) {
                r = 0;
            }
            constexpr size_t NUM_SUBRELATIONS = result.size();

            for (size_t i = 0; i < num_rows; ++i) {
                Relation::accumulate(result, polys.get_row(i), {}, 1);

                bool x = true;
                for (size_t j = 0; j < NUM_SUBRELATIONS; ++j) {
                    if (result[j] != 0) {
                        std::string row_name = debug_label(static_cast<int>(j));
                        throw_or_abort(
                            format("Relation ", relation_name, ", subrelation index ", row_name, " failed at row ", i));
                        x = false;
                    }
                }
                if (!x) {
                    return false;
                }
            }
            return true;
        };

        const auto evaluate_logderivative = [&]<typename LogDerivativeSettings>(const std::string& lookup_name) {
            // Check the logderivative relation
            bb::compute_logderivative_inverse<Flavor, LogDerivativeSettings>(polys, params, num_rows);

            typename LogDerivativeSettings::SumcheckArrayOfValuesOverSubrelations lookup_result;

            for (auto& r : lookup_result) {
                r = 0;
            }
            for (size_t i = 0; i < num_rows; ++i) {
                LogDerivativeSettings::accumulate(lookup_result, polys.get_row(i), params, 1);
            }
            for (auto r : lookup_result) {
                if (r != 0) {
                    throw_or_abort(format("Lookup ", lookup_name, " failed."));
                    return false;
                }
            }
            return true;
        };

        if (!evaluate_relation.template operator()<Avm_vm::avm_mem<FF>>("avm_mem",
                                                                        Avm_vm::get_relation_label_avm_mem)) {
            return false;
        }
        if (!evaluate_relation.template operator()<Avm_vm::avm_binary<FF>>("avm_binary",
                                                                           Avm_vm::get_relation_label_avm_binary)) {
            return false;
        }
        if (!evaluate_relation.template operator()<Avm_vm::avm_main<FF>>("avm_main",
                                                                         Avm_vm::get_relation_label_avm_main)) {
            return false;
        }
        if (!evaluate_relation.template operator()<Avm_vm::avm_alu<FF>>("avm_alu",
                                                                        Avm_vm::get_relation_label_avm_alu)) {
            return false;
        }

        if (!evaluate_logderivative.template operator()<perm_main_alu_relation<FF>>("PERM_MAIN_ALU")) {
            return false;
        }
        if (!evaluate_logderivative.template operator()<perm_main_bin_relation<FF>>("PERM_MAIN_BIN")) {
            return false;
        }
        if (!evaluate_logderivative.template operator()<perm_main_mem_a_relation<FF>>("PERM_MAIN_MEM_A")) {
            return false;
        }
        if (!evaluate_logderivative.template operator()<perm_main_mem_b_relation<FF>>("PERM_MAIN_MEM_B")) {
            return false;
        }
        if (!evaluate_logderivative.template operator()<perm_main_mem_c_relation<FF>>("PERM_MAIN_MEM_C")) {
            return false;
        }
        if (!evaluate_logderivative.template operator()<perm_main_mem_ind_a_relation<FF>>("PERM_MAIN_MEM_IND_A")) {
            return false;
        }
        if (!evaluate_logderivative.template operator()<perm_main_mem_ind_b_relation<FF>>("PERM_MAIN_MEM_IND_B")) {
            return false;
        }
        if (!evaluate_logderivative.template operator()<perm_main_mem_ind_c_relation<FF>>("PERM_MAIN_MEM_IND_C")) {
            return false;
        }
        if (!evaluate_logderivative.template operator()<lookup_byte_lengths_relation<FF>>("LOOKUP_BYTE_LENGTHS")) {
            return false;
        }
        if (!evaluate_logderivative.template operator()<lookup_byte_operations_relation<FF>>(
                "LOOKUP_BYTE_OPERATIONS")) {
            return false;
        }
        if (!evaluate_logderivative.template operator()<incl_main_tag_err_relation<FF>>("INCL_MAIN_TAG_ERR")) {
            return false;
        }
        if (!evaluate_logderivative.template operator()<incl_mem_tag_err_relation<FF>>("INCL_MEM_TAG_ERR")) {
            return false;
        }

        return true;
    }

    [[nodiscard]] size_t get_num_gates() const { return rows.size(); }

    [[nodiscard]] size_t get_circuit_subgroup_size() const
    {
        const size_t num_rows = get_num_gates();
        const auto num_rows_log2 = static_cast<size_t>(numeric::get_msb64(num_rows));
        size_t num_rows_pow2 = 1UL << (num_rows_log2 + (1UL << num_rows_log2 == num_rows ? 0 : 1));
        return num_rows_pow2;
    }
};
} // namespace bb
