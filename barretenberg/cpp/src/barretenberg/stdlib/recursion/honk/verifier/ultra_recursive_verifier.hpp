#pragma once
#include "barretenberg/flavor/goblin_ultra_recursive.hpp"
#include "barretenberg/flavor/ultra_recursive.hpp"
#include "barretenberg/plonk/proof_system/types/proof.hpp"
#include "barretenberg/stdlib/recursion/honk/transcript/transcript.hpp"
#include "barretenberg/sumcheck/sumcheck.hpp"

namespace bb::stdlib::recursion::honk {
template <typename Flavor> class UltraRecursiveVerifier_ {
  public:
    using FF = typename Flavor::FF;
    using Commitment = typename Flavor::Commitment;
    using GroupElement = typename Flavor::GroupElement;
    using VerificationKey = typename Flavor::VerificationKey;
    using NativeVerificationKey = typename Flavor::NativeVerificationKey;
    using VerifierCommitmentKey = typename Flavor::VerifierCommitmentKey;
    using Builder = typename Flavor::CircuitBuilder;
    using RelationSeparator = typename Flavor::RelationSeparator;
    using PairingPoints = std::array<GroupElement, 2>;

    explicit UltraRecursiveVerifier_(Builder* builder,
                                     const std::shared_ptr<NativeVerificationKey>& native_verifier_key);
    UltraRecursiveVerifier_(UltraRecursiveVerifier_&& other) = delete;
    UltraRecursiveVerifier_(const UltraRecursiveVerifier_& other) = delete;
    UltraRecursiveVerifier_& operator=(const UltraRecursiveVerifier_& other) = delete;
    UltraRecursiveVerifier_& operator=(UltraRecursiveVerifier_&& other) = delete;
    ~UltraRecursiveVerifier_() = default;

    // TODO(luke): Eventually this will return something like aggregation_state but I'm simplifying for now until we
    // determine the exact interface. Simply returns the two pairing points.
    PairingPoints verify_proof(const plonk::proof& proof);

    std::shared_ptr<VerificationKey> key;
    std::map<std::string, Commitment> commitments;
    std::shared_ptr<VerifierCommitmentKey> pcs_verification_key;
    Builder* builder;
    std::shared_ptr<Transcript<Builder>> transcript;
};

// Instance declarations for Ultra and Goblin-Ultra verifier circuits with both conventional Ultra and Goblin-Ultra
// arithmetization.
using UltraRecursiveVerifier = UltraRecursiveVerifier_<UltraCircuitBuilder>;
} // namespace bb::stdlib::recursion::honk
