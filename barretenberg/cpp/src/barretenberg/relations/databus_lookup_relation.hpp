#pragma once
#include <array>
#include <tuple>

#include "barretenberg/common/constexpr_utils.hpp"
#include "barretenberg/polynomials/polynomial.hpp"
#include "barretenberg/polynomials/univariate.hpp"
#include "barretenberg/relations/relation_types.hpp"

namespace bb {

template <typename FF_> class DatabusLookupRelationImpl {
  public:
    using FF = FF_;
    static constexpr size_t NUM_BUS_COLUMNS = 2;
    static constexpr size_t READ_TERMS = 1;  // per bus column
    static constexpr size_t WRITE_TERMS = 1; // per bus column
    // 1 + polynomial degree of this relation
    static constexpr size_t LENGTH = READ_TERMS + WRITE_TERMS + 3;

    // Note: The first subrelation actually has length = LENGTH-1 but taking advantage of this would require additional
    // computation that would nullify the benefits.
    static constexpr std::array<size_t, NUM_BUS_COLUMNS * 2> SUBRELATION_PARTIAL_LENGTHS{
        LENGTH, // inverse polynomial correctness subrelation
        LENGTH, // log-derivative lookup argument subrelation
        LENGTH, // inverse polynomial correctness subrelation
        LENGTH  // log-derivative lookup argument subrelation
    };

    // The lookup subrelations are "linearly dependent" in the sense that they establishe the value of a sum across the
    // entire execution trace rather than a per-row identity.
    static constexpr std::array<bool, NUM_BUS_COLUMNS* 2> SUBRELATION_LINEARLY_INDEPENDENT = {
        true, false, true, false
    };

    template <size_t bus_idx, typename AllEntities> struct BusData;

    // Specialization for bus_idx 0
    template <typename AllEntities> struct BusData</*bus_idx=*/0, AllEntities> {
        static auto& values(const AllEntities& in) { return in.calldata; }
        static auto& selector(const AllEntities& in) { return in.q_l; }
        static auto& inverses(AllEntities& in) { return in.calldata_inverses; }
        static auto& inverses(const AllEntities& in) { return in.calldata_inverses; } // const version
        static auto& read_counts(const AllEntities& in) { return in.calldata_read_counts; }
    };

    // Specialization for bus_idx 1
    template <typename AllEntities> struct BusData</*bus_idx=*/1, AllEntities> {
        static auto& values(const AllEntities& in) { return in.return_data; }
        static auto& selector(const AllEntities& in) { return in.q_r; }
        static auto& inverses(AllEntities& in) { return in.return_data_inverses; }
        static auto& inverses(const AllEntities& in) { return in.return_data_inverses; } // const version
        static auto& read_counts(const AllEntities& in) { return in.return_data_read_counts; }
    };

    /**
     * @brief Determine whether the inverse I needs to be computed at a given row for a given bus column
     * @details The value of the inverse polynomial I(X) only needs to be computed when the databus lookup gate is
     * "active". Otherwise it is set to 0. This method allows for determination of when the inverse should be computed.
     *
     * @tparam AllValues
     * @param row
     * @return true
     * @return false
     */
    template <size_t bus_idx, typename AllValues> static bool operation_exists_at_row(const AllValues& row)
    {
        auto read_selector = get_read_selector<FF, bus_idx>(row);
        auto read_counts = BusData<bus_idx, AllValues>::read_counts(row);
        return (read_selector == 1 || read_counts > 0);
    }

    /**
     * @brief Compute the Accumulator whose values indicate whether the inverse is computed or not
     * @details This is needed for efficiency since we don't need to compute the inverse unless the log derivative
     * lookup relation is active at a given row.
     * @note read_counts is constructed such that read_count_i <= 1 and is thus treated as boolean.
     *
     */
    template <typename Accumulator, size_t bus_idx, typename AllEntities>
    static Accumulator compute_inverse_exists(const AllEntities& in)
    {
        using View = typename Accumulator::View;

        const auto is_read_gate = get_read_selector<Accumulator, bus_idx>(in);
        const auto read_counts = View(BusData<bus_idx, AllEntities>::read_counts(in));

        return is_read_gate + read_counts - (is_read_gate * read_counts);
    }

    /**
     * @brief Compute scalar for read term in log derivative lookup argument
     * @details The selector indicating read from bus column j is given by q_busread * q_j, j = 1,2,3
     *
     */
    template <typename Accumulator, size_t bus_idx, typename AllEntities>
    static Accumulator get_read_selector(const AllEntities& in)
    {
        using View = typename Accumulator::View;

        auto q_busread = View(in.q_busread);
        auto column_selector = View(BusData<bus_idx, AllEntities>::selector(in));

        return q_busread * column_selector;
    }

    /**
     * @brief Compute write term denominator in log derivative lookup argument
     *
     */
    template <typename Accumulator, size_t bus_idx, typename AllEntities, typename Parameters>
    static Accumulator compute_write_term(const AllEntities& in, const Parameters& params)
    {
        using View = typename Accumulator::View;
        using ParameterView = GetParameterView<Parameters, View>;

        const auto& id = View(in.databus_id);
        const auto& value = View(BusData<bus_idx, AllEntities>::values(in));
        const auto& gamma = ParameterView(params.gamma);
        const auto& beta = ParameterView(params.beta);

        // Construct b_i + idx_i*\beta + \gamma
        return value + gamma + id * beta; // degree 1
    }

    /**
     * @brief Compute read term denominator in log derivative lookup argument
     * @note No bus_idx required here since inputs to a read are of the same form regardless the bus column
     *
     */
    template <typename Accumulator, typename AllEntities, typename Parameters>
    static Accumulator compute_read_term(const AllEntities& in, const Parameters& params)
    {
        using View = typename Accumulator::View;
        using ParameterView = GetParameterView<Parameters, View>;

        // Bus value stored in w_1, index into bus column stored in w_2
        const auto& w_1 = View(in.w_l);
        const auto& w_2 = View(in.w_r);
        const auto& gamma = ParameterView(params.gamma);
        const auto& beta = ParameterView(params.beta);

        // Construct value + index*\beta + \gamma
        return w_1 + gamma + w_2 * beta;
    }

    /**
     * @brief Construct the polynomial I whose components are the inverse of the product of the read and write terms
     * @details If the denominators of log derivative lookup relation are read_term and write_term, then I_i =
     * (read_term_i*write_term_i)^{-1}.
     * @note Importantly, I_i = 0 for rows i at which there is no read or write.
     *
     */
    template <size_t bus_idx, typename Polynomials>
    static void compute_logderivative_inverse(Polynomials& polynomials,
                                              auto& relation_parameters,
                                              const size_t circuit_size)
    {
        auto& inverse_polynomial = BusData<bus_idx, Polynomials>::inverses(polynomials);
        // Compute the product of the read and write terms for each row
        for (size_t i = 0; i < circuit_size; ++i) {
            auto row = polynomials.get_row(i);
            // We only compute the inverse if this row contains a read gate or data that has been read
            if (operation_exists_at_row<bus_idx>(row)) {
                inverse_polynomial[i] = compute_read_term<FF>(row, relation_parameters) *
                                        compute_write_term<FF, bus_idx>(row, relation_parameters);
            }
        }
        // Compute inverse polynomial I in place by inverting the product at each row
        FF::batch_invert(inverse_polynomial);
    };

    /**
     * @brief Accumulate the subrelation contributions for reads from a single databus column
     * @details Two subrelations are required per bus column, one to establish correctness of the precomputed inverses
     * and one to establish the validity of the read.
     *
     * @param accumulator
     * @param in
     * @param params
     * @param scaling_factor
     */
    template <typename FF,
              size_t bus_idx,
              typename ContainerOverSubrelations,
              typename AllEntities,
              typename Parameters>
    static void accumulate_subrelation_contributions(ContainerOverSubrelations& accumulator,
                                                     const AllEntities& in,
                                                     const Parameters& params,
                                                     const FF& scaling_factor)
    {
        using Accumulator = typename std::tuple_element_t<0, ContainerOverSubrelations>;
        using View = typename Accumulator::View;

        const auto inverses = View(BusData<bus_idx, AllEntities>::inverses(in));       // Degree 1
        const auto read_counts = View(BusData<bus_idx, AllEntities>::read_counts(in)); // Degree 1
        const auto read_term = compute_read_term<Accumulator>(in, params);             // Degree 1
        const auto write_term = compute_write_term<Accumulator, bus_idx>(in, params);  // Degree 1
        const auto inverse_exists = compute_inverse_exists<Accumulator, bus_idx>(in);  // Degree 1
        const auto read_selector = get_read_selector<Accumulator, bus_idx>(in);        // Degree 2
        const auto write_inverse = inverses * read_term;                               // Degree 2
        const auto read_inverse = inverses * write_term;                               // Degree 2

        // Determine which pair of subrelations to update based on which bus column is being read
        constexpr size_t subrel_idx_1 = 2 * bus_idx;
        constexpr size_t subrel_idx_2 = 2 * bus_idx + 1;

        // Establish the correctness of the polynomial of inverses I. Note: inverses is computed so that the value is 0
        // if !inverse_exists. Degree 3
        std::get<subrel_idx_1>(accumulator) += (read_term * write_term * inverses - inverse_exists) * scaling_factor;

        // Establish validity of the read. Note: no scaling factor here since this constraint is enforced across the
        // entire trace, not on a per-row basis
        std::get<subrel_idx_2>(accumulator) += read_selector * read_inverse - read_counts * write_inverse; // Degree 4
    }

    /**
     * @brief Accumulate the log derivative databus lookup argument subrelation contributions for each databus column
     * @details Each databus column requires two subrelations
     *
     * @param accumulator transformed to `evals + C(in(X)...)*scaling_factor`
     * @param in an std::array containing the fully extended Accumulator edges.
     * @param params contains beta, gamma, and public_input_delta, ....
     * @param scaling_factor optional term to scale the evaluation before adding to evals.
     */
    template <typename ContainerOverSubrelations, typename AllEntities, typename Parameters>
    static void accumulate(ContainerOverSubrelations& accumulator,
                           const AllEntities& in,
                           const Parameters& params,
                           const FF& scaling_factor)
    {
        // Accumulate the subrelation contributions for each column of the databus
        bb::constexpr_for<0, NUM_BUS_COLUMNS, 1>([&]<size_t bus_idx>() {
            accumulate_subrelation_contributions<FF, bus_idx>(accumulator, in, params, scaling_factor);
        });
    }
};

template <typename FF> using DatabusLookupRelation = Relation<DatabusLookupRelationImpl<FF>>;

} // namespace bb
