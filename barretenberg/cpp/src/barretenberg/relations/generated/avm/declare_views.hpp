
#define Avm_DECLARE_VIEWS(index)                                                                                       \
    using Accumulator = typename std::tuple_element<index, ContainerOverSubrelations>::type;                           \
    using View = typename Accumulator::View;                                                                           \
    [[maybe_unused]] auto avm_main_clk = View(new_term.avm_main_clk);                                                  \
    [[maybe_unused]] auto avm_main_first = View(new_term.avm_main_first);                                              \
    [[maybe_unused]] auto avm_alu_a_hi = View(new_term.avm_alu_a_hi);                                                  \
    [[maybe_unused]] auto avm_alu_a_lo = View(new_term.avm_alu_a_lo);                                                  \
    [[maybe_unused]] auto avm_alu_alu_sel = View(new_term.avm_alu_alu_sel);                                            \
    [[maybe_unused]] auto avm_alu_b_hi = View(new_term.avm_alu_b_hi);                                                  \
    [[maybe_unused]] auto avm_alu_b_lo = View(new_term.avm_alu_b_lo);                                                  \
    [[maybe_unused]] auto avm_alu_borrow = View(new_term.avm_alu_borrow);                                              \
    [[maybe_unused]] auto avm_alu_cf = View(new_term.avm_alu_cf);                                                      \
    [[maybe_unused]] auto avm_alu_clk = View(new_term.avm_alu_clk);                                                    \
    [[maybe_unused]] auto avm_alu_cmp_sel = View(new_term.avm_alu_cmp_sel);                                            \
    [[maybe_unused]] auto avm_alu_ff_tag = View(new_term.avm_alu_ff_tag);                                              \
    [[maybe_unused]] auto avm_alu_ia = View(new_term.avm_alu_ia);                                                      \
    [[maybe_unused]] auto avm_alu_ib = View(new_term.avm_alu_ib);                                                      \
    [[maybe_unused]] auto avm_alu_ic = View(new_term.avm_alu_ic);                                                      \
    [[maybe_unused]] auto avm_alu_in_tag = View(new_term.avm_alu_in_tag);                                              \
    [[maybe_unused]] auto avm_alu_input_ia = View(new_term.avm_alu_input_ia);                                          \
    [[maybe_unused]] auto avm_alu_input_ib = View(new_term.avm_alu_input_ib);                                          \
    [[maybe_unused]] auto avm_alu_lt_sel = View(new_term.avm_alu_lt_sel);                                              \
    [[maybe_unused]] auto avm_alu_lte_sel = View(new_term.avm_alu_lte_sel);                                            \
    [[maybe_unused]] auto avm_alu_op_add = View(new_term.avm_alu_op_add);                                              \
    [[maybe_unused]] auto avm_alu_op_div = View(new_term.avm_alu_op_div);                                              \
    [[maybe_unused]] auto avm_alu_op_eq = View(new_term.avm_alu_op_eq);                                                \
    [[maybe_unused]] auto avm_alu_op_eq_diff_inv = View(new_term.avm_alu_op_eq_diff_inv);                              \
    [[maybe_unused]] auto avm_alu_op_mul = View(new_term.avm_alu_op_mul);                                              \
    [[maybe_unused]] auto avm_alu_op_not = View(new_term.avm_alu_op_not);                                              \
    [[maybe_unused]] auto avm_alu_op_sub = View(new_term.avm_alu_op_sub);                                              \
    [[maybe_unused]] auto avm_alu_p_a_borrow = View(new_term.avm_alu_p_a_borrow);                                      \
    [[maybe_unused]] auto avm_alu_p_b_borrow = View(new_term.avm_alu_p_b_borrow);                                      \
    [[maybe_unused]] auto avm_alu_p_sub_a_hi = View(new_term.avm_alu_p_sub_a_hi);                                      \
    [[maybe_unused]] auto avm_alu_p_sub_a_lo = View(new_term.avm_alu_p_sub_a_lo);                                      \
    [[maybe_unused]] auto avm_alu_p_sub_b_hi = View(new_term.avm_alu_p_sub_b_hi);                                      \
    [[maybe_unused]] auto avm_alu_p_sub_b_lo = View(new_term.avm_alu_p_sub_b_lo);                                      \
    [[maybe_unused]] auto avm_alu_res_hi = View(new_term.avm_alu_res_hi);                                              \
    [[maybe_unused]] auto avm_alu_res_lo = View(new_term.avm_alu_res_lo);                                              \
    [[maybe_unused]] auto avm_alu_rng_chk_remaining = View(new_term.avm_alu_rng_chk_remaining);                        \
    [[maybe_unused]] auto avm_alu_rng_chk_sel = View(new_term.avm_alu_rng_chk_sel);                                    \
    [[maybe_unused]] auto avm_alu_u128_tag = View(new_term.avm_alu_u128_tag);                                          \
    [[maybe_unused]] auto avm_alu_u16_r0 = View(new_term.avm_alu_u16_r0);                                              \
    [[maybe_unused]] auto avm_alu_u16_r1 = View(new_term.avm_alu_u16_r1);                                              \
    [[maybe_unused]] auto avm_alu_u16_r10 = View(new_term.avm_alu_u16_r10);                                            \
    [[maybe_unused]] auto avm_alu_u16_r11 = View(new_term.avm_alu_u16_r11);                                            \
    [[maybe_unused]] auto avm_alu_u16_r12 = View(new_term.avm_alu_u16_r12);                                            \
    [[maybe_unused]] auto avm_alu_u16_r13 = View(new_term.avm_alu_u16_r13);                                            \
    [[maybe_unused]] auto avm_alu_u16_r14 = View(new_term.avm_alu_u16_r14);                                            \
    [[maybe_unused]] auto avm_alu_u16_r2 = View(new_term.avm_alu_u16_r2);                                              \
    [[maybe_unused]] auto avm_alu_u16_r3 = View(new_term.avm_alu_u16_r3);                                              \
    [[maybe_unused]] auto avm_alu_u16_r4 = View(new_term.avm_alu_u16_r4);                                              \
    [[maybe_unused]] auto avm_alu_u16_r5 = View(new_term.avm_alu_u16_r5);                                              \
    [[maybe_unused]] auto avm_alu_u16_r6 = View(new_term.avm_alu_u16_r6);                                              \
    [[maybe_unused]] auto avm_alu_u16_r7 = View(new_term.avm_alu_u16_r7);                                              \
    [[maybe_unused]] auto avm_alu_u16_r8 = View(new_term.avm_alu_u16_r8);                                              \
    [[maybe_unused]] auto avm_alu_u16_r9 = View(new_term.avm_alu_u16_r9);                                              \
    [[maybe_unused]] auto avm_alu_u16_tag = View(new_term.avm_alu_u16_tag);                                            \
    [[maybe_unused]] auto avm_alu_u32_tag = View(new_term.avm_alu_u32_tag);                                            \
    [[maybe_unused]] auto avm_alu_u64_r0 = View(new_term.avm_alu_u64_r0);                                              \
    [[maybe_unused]] auto avm_alu_u64_tag = View(new_term.avm_alu_u64_tag);                                            \
    [[maybe_unused]] auto avm_alu_u8_r0 = View(new_term.avm_alu_u8_r0);                                                \
    [[maybe_unused]] auto avm_alu_u8_r1 = View(new_term.avm_alu_u8_r1);                                                \
    [[maybe_unused]] auto avm_alu_u8_tag = View(new_term.avm_alu_u8_tag);                                              \
    [[maybe_unused]] auto avm_binary_acc_ia = View(new_term.avm_binary_acc_ia);                                        \
    [[maybe_unused]] auto avm_binary_acc_ib = View(new_term.avm_binary_acc_ib);                                        \
    [[maybe_unused]] auto avm_binary_acc_ic = View(new_term.avm_binary_acc_ic);                                        \
    [[maybe_unused]] auto avm_binary_bin_sel = View(new_term.avm_binary_bin_sel);                                      \
    [[maybe_unused]] auto avm_binary_clk = View(new_term.avm_binary_clk);                                              \
    [[maybe_unused]] auto avm_binary_ia_bytes = View(new_term.avm_binary_ia_bytes);                                    \
    [[maybe_unused]] auto avm_binary_ib_bytes = View(new_term.avm_binary_ib_bytes);                                    \
    [[maybe_unused]] auto avm_binary_ic_bytes = View(new_term.avm_binary_ic_bytes);                                    \
    [[maybe_unused]] auto avm_binary_in_tag = View(new_term.avm_binary_in_tag);                                        \
    [[maybe_unused]] auto avm_binary_mem_tag_ctr = View(new_term.avm_binary_mem_tag_ctr);                              \
    [[maybe_unused]] auto avm_binary_mem_tag_ctr_inv = View(new_term.avm_binary_mem_tag_ctr_inv);                      \
    [[maybe_unused]] auto avm_binary_op_id = View(new_term.avm_binary_op_id);                                          \
    [[maybe_unused]] auto avm_binary_start = View(new_term.avm_binary_start);                                          \
    [[maybe_unused]] auto avm_byte_lookup_bin_sel = View(new_term.avm_byte_lookup_bin_sel);                            \
    [[maybe_unused]] auto avm_byte_lookup_table_byte_lengths = View(new_term.avm_byte_lookup_table_byte_lengths);      \
    [[maybe_unused]] auto avm_byte_lookup_table_in_tags = View(new_term.avm_byte_lookup_table_in_tags);                \
    [[maybe_unused]] auto avm_byte_lookup_table_input_a = View(new_term.avm_byte_lookup_table_input_a);                \
    [[maybe_unused]] auto avm_byte_lookup_table_input_b = View(new_term.avm_byte_lookup_table_input_b);                \
    [[maybe_unused]] auto avm_byte_lookup_table_op_id = View(new_term.avm_byte_lookup_table_op_id);                    \
    [[maybe_unused]] auto avm_byte_lookup_table_output = View(new_term.avm_byte_lookup_table_output);                  \
    [[maybe_unused]] auto avm_main_alu_sel = View(new_term.avm_main_alu_sel);                                          \
    [[maybe_unused]] auto avm_main_bin_op_id = View(new_term.avm_main_bin_op_id);                                      \
    [[maybe_unused]] auto avm_main_bin_sel = View(new_term.avm_main_bin_sel);                                          \
    [[maybe_unused]] auto avm_main_cmp_sel = View(new_term.avm_main_cmp_sel);                                          \
    [[maybe_unused]] auto avm_main_ia = View(new_term.avm_main_ia);                                                    \
    [[maybe_unused]] auto avm_main_ib = View(new_term.avm_main_ib);                                                    \
    [[maybe_unused]] auto avm_main_ic = View(new_term.avm_main_ic);                                                    \
    [[maybe_unused]] auto avm_main_ind_a = View(new_term.avm_main_ind_a);                                              \
    [[maybe_unused]] auto avm_main_ind_b = View(new_term.avm_main_ind_b);                                              \
    [[maybe_unused]] auto avm_main_ind_c = View(new_term.avm_main_ind_c);                                              \
    [[maybe_unused]] auto avm_main_ind_op_a = View(new_term.avm_main_ind_op_a);                                        \
    [[maybe_unused]] auto avm_main_ind_op_b = View(new_term.avm_main_ind_op_b);                                        \
    [[maybe_unused]] auto avm_main_ind_op_c = View(new_term.avm_main_ind_op_c);                                        \
    [[maybe_unused]] auto avm_main_internal_return_ptr = View(new_term.avm_main_internal_return_ptr);                  \
    [[maybe_unused]] auto avm_main_inv = View(new_term.avm_main_inv);                                                  \
    [[maybe_unused]] auto avm_main_last = View(new_term.avm_main_last);                                                \
    [[maybe_unused]] auto avm_main_mem_idx_a = View(new_term.avm_main_mem_idx_a);                                      \
    [[maybe_unused]] auto avm_main_mem_idx_b = View(new_term.avm_main_mem_idx_b);                                      \
    [[maybe_unused]] auto avm_main_mem_idx_c = View(new_term.avm_main_mem_idx_c);                                      \
    [[maybe_unused]] auto avm_main_mem_op_a = View(new_term.avm_main_mem_op_a);                                        \
    [[maybe_unused]] auto avm_main_mem_op_b = View(new_term.avm_main_mem_op_b);                                        \
    [[maybe_unused]] auto avm_main_mem_op_c = View(new_term.avm_main_mem_op_c);                                        \
    [[maybe_unused]] auto avm_main_op_err = View(new_term.avm_main_op_err);                                            \
    [[maybe_unused]] auto avm_main_pc = View(new_term.avm_main_pc);                                                    \
    [[maybe_unused]] auto avm_main_r_in_tag = View(new_term.avm_main_r_in_tag);                                        \
    [[maybe_unused]] auto avm_main_rwa = View(new_term.avm_main_rwa);                                                  \
    [[maybe_unused]] auto avm_main_rwb = View(new_term.avm_main_rwb);                                                  \
    [[maybe_unused]] auto avm_main_rwc = View(new_term.avm_main_rwc);                                                  \
    [[maybe_unused]] auto avm_main_sel_halt = View(new_term.avm_main_sel_halt);                                        \
    [[maybe_unused]] auto avm_main_sel_internal_call = View(new_term.avm_main_sel_internal_call);                      \
    [[maybe_unused]] auto avm_main_sel_internal_return = View(new_term.avm_main_sel_internal_return);                  \
    [[maybe_unused]] auto avm_main_sel_jump = View(new_term.avm_main_sel_jump);                                        \
    [[maybe_unused]] auto avm_main_sel_mov = View(new_term.avm_main_sel_mov);                                          \
    [[maybe_unused]] auto avm_main_sel_op_add = View(new_term.avm_main_sel_op_add);                                    \
    [[maybe_unused]] auto avm_main_sel_op_and = View(new_term.avm_main_sel_op_and);                                    \
    [[maybe_unused]] auto avm_main_sel_op_div = View(new_term.avm_main_sel_op_div);                                    \
    [[maybe_unused]] auto avm_main_sel_op_eq = View(new_term.avm_main_sel_op_eq);                                      \
    [[maybe_unused]] auto avm_main_sel_op_lt = View(new_term.avm_main_sel_op_lt);                                      \
    [[maybe_unused]] auto avm_main_sel_op_lte = View(new_term.avm_main_sel_op_lte);                                    \
    [[maybe_unused]] auto avm_main_sel_op_mul = View(new_term.avm_main_sel_op_mul);                                    \
    [[maybe_unused]] auto avm_main_sel_op_not = View(new_term.avm_main_sel_op_not);                                    \
    [[maybe_unused]] auto avm_main_sel_op_or = View(new_term.avm_main_sel_op_or);                                      \
    [[maybe_unused]] auto avm_main_sel_op_sub = View(new_term.avm_main_sel_op_sub);                                    \
    [[maybe_unused]] auto avm_main_sel_op_xor = View(new_term.avm_main_sel_op_xor);                                    \
    [[maybe_unused]] auto avm_main_sel_rng_16 = View(new_term.avm_main_sel_rng_16);                                    \
    [[maybe_unused]] auto avm_main_sel_rng_8 = View(new_term.avm_main_sel_rng_8);                                      \
    [[maybe_unused]] auto avm_main_tag_err = View(new_term.avm_main_tag_err);                                          \
    [[maybe_unused]] auto avm_main_w_in_tag = View(new_term.avm_main_w_in_tag);                                        \
    [[maybe_unused]] auto avm_mem_addr = View(new_term.avm_mem_addr);                                                  \
    [[maybe_unused]] auto avm_mem_clk = View(new_term.avm_mem_clk);                                                    \
    [[maybe_unused]] auto avm_mem_ind_op_a = View(new_term.avm_mem_ind_op_a);                                          \
    [[maybe_unused]] auto avm_mem_ind_op_b = View(new_term.avm_mem_ind_op_b);                                          \
    [[maybe_unused]] auto avm_mem_ind_op_c = View(new_term.avm_mem_ind_op_c);                                          \
    [[maybe_unused]] auto avm_mem_last = View(new_term.avm_mem_last);                                                  \
    [[maybe_unused]] auto avm_mem_lastAccess = View(new_term.avm_mem_lastAccess);                                      \
    [[maybe_unused]] auto avm_mem_one_min_inv = View(new_term.avm_mem_one_min_inv);                                    \
    [[maybe_unused]] auto avm_mem_op_a = View(new_term.avm_mem_op_a);                                                  \
    [[maybe_unused]] auto avm_mem_op_b = View(new_term.avm_mem_op_b);                                                  \
    [[maybe_unused]] auto avm_mem_op_c = View(new_term.avm_mem_op_c);                                                  \
    [[maybe_unused]] auto avm_mem_r_in_tag = View(new_term.avm_mem_r_in_tag);                                          \
    [[maybe_unused]] auto avm_mem_rw = View(new_term.avm_mem_rw);                                                      \
    [[maybe_unused]] auto avm_mem_sel_mov = View(new_term.avm_mem_sel_mov);                                            \
    [[maybe_unused]] auto avm_mem_sub_clk = View(new_term.avm_mem_sub_clk);                                            \
    [[maybe_unused]] auto avm_mem_tag = View(new_term.avm_mem_tag);                                                    \
    [[maybe_unused]] auto avm_mem_tag_err = View(new_term.avm_mem_tag_err);                                            \
    [[maybe_unused]] auto avm_mem_val = View(new_term.avm_mem_val);                                                    \
    [[maybe_unused]] auto avm_mem_w_in_tag = View(new_term.avm_mem_w_in_tag);                                          \
    [[maybe_unused]] auto perm_main_alu = View(new_term.perm_main_alu);                                                \
    [[maybe_unused]] auto perm_main_bin = View(new_term.perm_main_bin);                                                \
    [[maybe_unused]] auto perm_main_cmp = View(new_term.perm_main_cmp);                                                \
    [[maybe_unused]] auto perm_main_mem_a = View(new_term.perm_main_mem_a);                                            \
    [[maybe_unused]] auto perm_main_mem_b = View(new_term.perm_main_mem_b);                                            \
    [[maybe_unused]] auto perm_main_mem_c = View(new_term.perm_main_mem_c);                                            \
    [[maybe_unused]] auto perm_main_mem_ind_a = View(new_term.perm_main_mem_ind_a);                                    \
    [[maybe_unused]] auto perm_main_mem_ind_b = View(new_term.perm_main_mem_ind_b);                                    \
    [[maybe_unused]] auto perm_main_mem_ind_c = View(new_term.perm_main_mem_ind_c);                                    \
    [[maybe_unused]] auto lookup_byte_lengths = View(new_term.lookup_byte_lengths);                                    \
    [[maybe_unused]] auto lookup_byte_operations = View(new_term.lookup_byte_operations);                              \
    [[maybe_unused]] auto incl_main_tag_err = View(new_term.incl_main_tag_err);                                        \
    [[maybe_unused]] auto incl_mem_tag_err = View(new_term.incl_mem_tag_err);                                          \
    [[maybe_unused]] auto lookup_byte_lengths_counts = View(new_term.lookup_byte_lengths_counts);                      \
    [[maybe_unused]] auto lookup_byte_operations_counts = View(new_term.lookup_byte_operations_counts);                \
    [[maybe_unused]] auto incl_main_tag_err_counts = View(new_term.incl_main_tag_err_counts);                          \
    [[maybe_unused]] auto incl_mem_tag_err_counts = View(new_term.incl_mem_tag_err_counts);                            \
    [[maybe_unused]] auto avm_alu_a_hi_shift = View(new_term.avm_alu_a_hi_shift);                                      \
    [[maybe_unused]] auto avm_alu_a_lo_shift = View(new_term.avm_alu_a_lo_shift);                                      \
    [[maybe_unused]] auto avm_alu_b_hi_shift = View(new_term.avm_alu_b_hi_shift);                                      \
    [[maybe_unused]] auto avm_alu_b_lo_shift = View(new_term.avm_alu_b_lo_shift);                                      \
    [[maybe_unused]] auto avm_alu_p_sub_a_hi_shift = View(new_term.avm_alu_p_sub_a_hi_shift);                          \
    [[maybe_unused]] auto avm_alu_p_sub_a_lo_shift = View(new_term.avm_alu_p_sub_a_lo_shift);                          \
    [[maybe_unused]] auto avm_alu_p_sub_b_hi_shift = View(new_term.avm_alu_p_sub_b_hi_shift);                          \
    [[maybe_unused]] auto avm_alu_p_sub_b_lo_shift = View(new_term.avm_alu_p_sub_b_lo_shift);                          \
    [[maybe_unused]] auto avm_alu_rng_chk_remaining_shift = View(new_term.avm_alu_rng_chk_remaining_shift);            \
    [[maybe_unused]] auto avm_alu_rng_chk_sel_shift = View(new_term.avm_alu_rng_chk_sel_shift);                        \
    [[maybe_unused]] auto avm_alu_u16_r0_shift = View(new_term.avm_alu_u16_r0_shift);                                  \
    [[maybe_unused]] auto avm_alu_u16_r1_shift = View(new_term.avm_alu_u16_r1_shift);                                  \
    [[maybe_unused]] auto avm_alu_u16_r2_shift = View(new_term.avm_alu_u16_r2_shift);                                  \
    [[maybe_unused]] auto avm_alu_u16_r3_shift = View(new_term.avm_alu_u16_r3_shift);                                  \
    [[maybe_unused]] auto avm_alu_u16_r4_shift = View(new_term.avm_alu_u16_r4_shift);                                  \
    [[maybe_unused]] auto avm_alu_u16_r5_shift = View(new_term.avm_alu_u16_r5_shift);                                  \
    [[maybe_unused]] auto avm_alu_u16_r6_shift = View(new_term.avm_alu_u16_r6_shift);                                  \
    [[maybe_unused]] auto avm_alu_u16_r7_shift = View(new_term.avm_alu_u16_r7_shift);                                  \
    [[maybe_unused]] auto avm_binary_acc_ia_shift = View(new_term.avm_binary_acc_ia_shift);                            \
    [[maybe_unused]] auto avm_binary_acc_ib_shift = View(new_term.avm_binary_acc_ib_shift);                            \
    [[maybe_unused]] auto avm_binary_acc_ic_shift = View(new_term.avm_binary_acc_ic_shift);                            \
    [[maybe_unused]] auto avm_binary_mem_tag_ctr_shift = View(new_term.avm_binary_mem_tag_ctr_shift);                  \
    [[maybe_unused]] auto avm_binary_op_id_shift = View(new_term.avm_binary_op_id_shift);                              \
    [[maybe_unused]] auto avm_main_internal_return_ptr_shift = View(new_term.avm_main_internal_return_ptr_shift);      \
    [[maybe_unused]] auto avm_main_pc_shift = View(new_term.avm_main_pc_shift);                                        \
    [[maybe_unused]] auto avm_mem_addr_shift = View(new_term.avm_mem_addr_shift);                                      \
    [[maybe_unused]] auto avm_mem_rw_shift = View(new_term.avm_mem_rw_shift);                                          \
    [[maybe_unused]] auto avm_mem_tag_shift = View(new_term.avm_mem_tag_shift);                                        \
    [[maybe_unused]] auto avm_mem_val_shift = View(new_term.avm_mem_val_shift);
