use std::{
    collections::BTreeMap,
    fs::File,
    io::Write,
    path::{Path, PathBuf},
};

use acvm::acir::native_types::WitnessMap;

use crate::errors::{CliError, FilesystemError};

fn create_named_dir(named_dir: &Path, name: &str) -> PathBuf {
    std::fs::create_dir_all(named_dir)
        .unwrap_or_else(|_| panic!("could not create the `{name}` directory"));

    PathBuf::from(named_dir)
}

fn write_to_file(bytes: &[u8], path: &Path) -> String {
    let display = path.display();

    let mut file = match File::create(path) {
        Err(why) => panic!("couldn't create {display}: {why}"),
        Ok(file) => file,
    };

    match file.write_all(bytes) {
        Err(why) => panic!("couldn't write to {display}: {why}"),
        Ok(_) => display.to_string(),
    }
}

/// Saves the provided output witnesses to a toml file created at the given location
pub(crate) fn save_witness_string_to_dir<P: AsRef<Path>>(
    output_witness: &String,
    witness_dir: P,
    file_name: &String,
) -> Result<PathBuf, FilesystemError> {
    let witness_path = witness_dir.as_ref().join(file_name);
    let mut file = File::create(&witness_path)
        .map_err(|_| FilesystemError::OutputWitnessCreationFailed(file_name.clone()))?;
    write!(file, "{}", output_witness)
        .map_err(|_| FilesystemError::OutputWitnessWriteFailed(file_name.clone()))?;
    Ok(witness_path)
}
/// Creates a toml representation of the provided witness map
pub(crate) fn create_output_witness_string(witnesses: &WitnessMap) -> Result<String, CliError> {
    let mut witness_map: BTreeMap<String, String> = BTreeMap::new();
    for (key, value) in witnesses.clone().into_iter() {
        witness_map.insert(key.0.to_string(), format!("0x{}", value.to_hex()));
    }

    toml::to_string(&witness_map).map_err(|_| CliError::OutputWitnessSerializationFailed())
}

pub(crate) fn save_witness_to_dir<P: AsRef<Path>>(
    witnesses: WitnessMap,
    witness_name: &str,
    witness_dir: P,
) -> Result<PathBuf, FilesystemError> {
    create_named_dir(witness_dir.as_ref(), "witness");
    let witness_path = witness_dir.as_ref().join(witness_name).with_extension("gz");

    let buf: Vec<u8> = witnesses.try_into().map_err(|_op| FilesystemError::OutputWitnessCreationFailed(witness_name.to_string()))?;
    println!("Writing out to {}", witness_path.display());
    write_to_file(buf.as_slice(), &witness_path);

    Ok(witness_path)
}
