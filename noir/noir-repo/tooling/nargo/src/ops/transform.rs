use acvm::acir::circuit::ExpressionWidth;
use iter_extended::vecmap;
use noirc_driver::{CompiledContract, CompiledProgram};

/// TODO(https://github.com/noir-lang/noir/issues/4428): Need to update how these passes are run to account for
/// multiple ACIR functions

pub fn transform_program(
    mut compiled_program: CompiledProgram,
    expression_width: ExpressionWidth,
) -> CompiledProgram {
    // TODO: Work to get rid of these clones by borrowing `Circuit` in the acvm compiler or by accepted a `Program`
    let (optimized_circuit, location_map) =
        acvm::compiler::compile(compiled_program.program.functions[0].clone(), expression_width);

    compiled_program.program.functions[0] = optimized_circuit;
    compiled_program.debug.update_acir(location_map);
    compiled_program
}

pub fn transform_contract(
    contract: CompiledContract,
    expression_width: ExpressionWidth,
) -> CompiledContract {
    let functions = vecmap(contract.functions, |mut func| {
        let (optimized_bytecode, location_map) =
            acvm::compiler::compile(func.bytecode.functions[0].clone(), expression_width);
        func.bytecode.functions[0] = optimized_bytecode;
        func.debug.update_acir(location_map);
        func
    });

    CompiledContract { functions, ..contract }
}
