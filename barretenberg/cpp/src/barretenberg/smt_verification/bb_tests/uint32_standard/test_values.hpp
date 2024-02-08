#include "barretenberg/smt_verification/circuit/circuit.hpp"
#include "barretenberg/stdlib/primitives/uint/uint.hpp"
#include "barretenberg/smt_verification/util/smt_util.hpp"

const std::vector<std::vector<bb::fr>> xor_unique_output = {
{0, 0},           //zero_circuit1, zero_circuit2
{1, 1},           //one_circuit1, one_circuit2
{0, 0},           //a_circuit1, a_circuit2
{0, 0},           //var_3_circuit1, var_3_circuit2
{0, 0},           //var_4_circuit1, var_4_circuit2
{0, 0},           //var_5_circuit1, var_5_circuit2
{0, 0},           //var_6_circuit1, var_6_circuit2
{0, 0},           //var_7_circuit1, var_7_circuit2
{0, 0},           //var_8_circuit1, var_8_circuit2
{0, 0},           //var_9_circuit1, var_9_circuit2
{0, 0},           //var_10_circuit1, var_10_circuit2
{0, 0},           //var_11_circuit1, var_11_circuit2
{0, 0},           //var_12_circuit1, var_12_circuit2
{0, 0},           //var_13_circuit1, var_13_circuit2
{0, 0},           //var_14_circuit1, var_14_circuit2
{0, 0},           //var_15_circuit1, var_15_circuit2
{0, 0},           //var_16_circuit1, var_16_circuit2
{0, 0},           //var_17_circuit1, var_17_circuit2
{0, 0},           //var_18_circuit1, var_18_circuit2
{0, 0},           //var_19_circuit1, var_19_circuit2
{0, 0},           //var_20_circuit1, var_20_circuit2
{0, 0},           //var_21_circuit1, var_21_circuit2
{0, 0},           //var_22_circuit1, var_22_circuit2
{0, 0},           //var_23_circuit1, var_23_circuit2
{0, 0},           //var_24_circuit1, var_24_circuit2
{0, 0},           //var_25_circuit1, var_25_circuit2
{0, 0},           //var_26_circuit1, var_26_circuit2
{0, 0},           //var_27_circuit1, var_27_circuit2
{0, 0},           //var_28_circuit1, var_28_circuit2
{0, 0},           //var_29_circuit1, var_29_circuit2
{0, 0},           //var_30_circuit1, var_30_circuit2
{0, 0},           //var_31_circuit1, var_31_circuit2
{0, 0},           //var_32_circuit1, var_32_circuit2
{0, 0},           //var_33_circuit1, var_33_circuit2
{0, 0},           //var_34_circuit1, var_34_circuit2
{0, 0},           //var_35_circuit1, var_35_circuit2
{0, 0},           //var_36_circuit1, var_36_circuit2
{0, 0},           //var_37_circuit1, var_37_circuit2
{0, 0},           //var_38_circuit1, var_38_circuit2
{0, 0},           //var_39_circuit1, var_39_circuit2
{0, 0},           //var_40_circuit1, var_40_circuit2
{0, 0},           //var_41_circuit1, var_41_circuit2
{0, 0},           //var_42_circuit1, var_42_circuit2
{0, 0},           //var_43_circuit1, var_43_circuit2
{0, 0},           //var_44_circuit1, var_44_circuit2
{0, 0},           //var_45_circuit1, var_45_circuit2
{0, 0},           //var_46_circuit1, var_46_circuit2
{0, 0},           //var_47_circuit1, var_47_circuit2
{0, 0},           //var_48_circuit1, var_48_circuit2
{0, 0},           //var_49_circuit1, var_49_circuit2
{0, 0},           //var_50_circuit1, var_50_circuit2
{0, 0},           //var_51_circuit1, var_51_circuit2
{0, 0},           //var_52_circuit1, var_52_circuit2
{0, 0},           //var_53_circuit1, var_53_circuit2
{0, 0},           //var_54_circuit1, var_54_circuit2
{0, 0},           //var_55_circuit1, var_55_circuit2
{0, 0},           //var_56_circuit1, var_56_circuit2
{0, 0},           //var_57_circuit1, var_57_circuit2
{0, 0},           //var_58_circuit1, var_58_circuit2
{0, 0},           //var_59_circuit1, var_59_circuit2
{0, 0},           //var_60_circuit1, var_60_circuit2
{0, 0},           //var_61_circuit1, var_61_circuit2
{0, 0},           //var_62_circuit1, var_62_circuit2
{0, 0},           //var_63_circuit1, var_63_circuit2
{0, 0},           //var_64_circuit1, var_64_circuit2
{0, 0},           //var_65_circuit1, var_65_circuit2
{0, 0},           //b_circuit1, b_circuit2
{0, 0},           //var_67_circuit1, var_67_circuit2
{0, 0},           //var_68_circuit1, var_68_circuit2
{0, 0},           //var_69_circuit1, var_69_circuit2
{0, 0},           //var_70_circuit1, var_70_circuit2
{0, 0},           //var_71_circuit1, var_71_circuit2
{0, 0},           //var_72_circuit1, var_72_circuit2
{0, 0},           //var_73_circuit1, var_73_circuit2
{0, 0},           //var_74_circuit1, var_74_circuit2
{0, 0},           //var_75_circuit1, var_75_circuit2
{0, 0},           //var_76_circuit1, var_76_circuit2
{0, 0},           //var_77_circuit1, var_77_circuit2
{0, 0},           //var_78_circuit1, var_78_circuit2
{0, 0},           //var_79_circuit1, var_79_circuit2
{0, 0},           //var_80_circuit1, var_80_circuit2
{0, 0},           //var_81_circuit1, var_81_circuit2
{0, 0},           //var_82_circuit1, var_82_circuit2
{0, 0},           //var_83_circuit1, var_83_circuit2
{0, 0},           //var_84_circuit1, var_84_circuit2
{0, 0},           //var_85_circuit1, var_85_circuit2
{0, 0},           //var_86_circuit1, var_86_circuit2
{0, 0},           //var_87_circuit1, var_87_circuit2
{0, 0},           //var_88_circuit1, var_88_circuit2
{0, 0},           //var_89_circuit1, var_89_circuit2
{0, 0},           //var_90_circuit1, var_90_circuit2
{0, 0},           //var_91_circuit1, var_91_circuit2
{0, 0},           //var_92_circuit1, var_92_circuit2
{0, 0},           //var_93_circuit1, var_93_circuit2
{0, 0},           //var_94_circuit1, var_94_circuit2
{0, 0},           //var_95_circuit1, var_95_circuit2
{0, 0},           //var_96_circuit1, var_96_circuit2
{0, 0},           //var_97_circuit1, var_97_circuit2
{0, 0},           //var_98_circuit1, var_98_circuit2
{0, 0},           //var_99_circuit1, var_99_circuit2
{0, 0},           //var_100_circuit1, var_100_circuit2
{0, 0},           //var_101_circuit1, var_101_circuit2
{0, 0},           //var_102_circuit1, var_102_circuit2
{0, 0},           //var_103_circuit1, var_103_circuit2
{0, 0},           //var_104_circuit1, var_104_circuit2
{0, 0},           //var_105_circuit1, var_105_circuit2
{0, 0},           //var_106_circuit1, var_106_circuit2
{0, 0},           //var_107_circuit1, var_107_circuit2
{0, 0},           //var_108_circuit1, var_108_circuit2
{0, 0},           //var_109_circuit1, var_109_circuit2
{0, 0},           //var_110_circuit1, var_110_circuit2
{0, 0},           //var_111_circuit1, var_111_circuit2
{0, 0},           //var_112_circuit1, var_112_circuit2
{0, 0},           //var_113_circuit1, var_113_circuit2
{0, 0},           //var_114_circuit1, var_114_circuit2
{0, 0},           //var_115_circuit1, var_115_circuit2
{0, 0},           //var_116_circuit1, var_116_circuit2
{0, 0},           //var_117_circuit1, var_117_circuit2
{0, 0},           //var_118_circuit1, var_118_circuit2
{0, 0},           //var_119_circuit1, var_119_circuit2
{0, 0},           //var_120_circuit1, var_120_circuit2
{0, 0},           //var_121_circuit1, var_121_circuit2
{0, 0},           //var_122_circuit1, var_122_circuit2
{0, 0},           //var_123_circuit1, var_123_circuit2
{0, 0},           //var_124_circuit1, var_124_circuit2
{0, 0},           //var_125_circuit1, var_125_circuit2
{0, 0},           //var_126_circuit1, var_126_circuit2
{0, 0},           //var_127_circuit1, var_127_circuit2
{0, 0},           //var_128_circuit1, var_128_circuit2
{0, 0},           //var_129_circuit1, var_129_circuit2
{0, 0},           //var_130_circuit1, var_130_circuit2
{0, 0},           //var_131_circuit1, var_131_circuit2
{0, 0},           //var_132_circuit1, var_132_circuit2
{0, 0},           //var_133_circuit1, var_133_circuit2
{0, 0},           //var_134_circuit1, var_134_circuit2
{0, 0},           //var_135_circuit1, var_135_circuit2
{0, 0},           //var_136_circuit1, var_136_circuit2
{0, 0},           //var_137_circuit1, var_137_circuit2
{0, 0},           //var_138_circuit1, var_138_circuit2
{0, 0},           //var_139_circuit1, var_139_circuit2
{0, 0},           //var_140_circuit1, var_140_circuit2
{0, 0},           //var_141_circuit1, var_141_circuit2
{0, 0},           //var_142_circuit1, var_142_circuit2
{0, 0},           //var_143_circuit1, var_143_circuit2
{0, 0},           //var_144_circuit1, var_144_circuit2
{0, 0},           //var_145_circuit1, var_145_circuit2
{0, 0},           //var_146_circuit1, var_146_circuit2
{0, 0},           //var_147_circuit1, var_147_circuit2
{0, 0},           //var_148_circuit1, var_148_circuit2
{0, 0},           //var_149_circuit1, var_149_circuit2
{0, 0},           //var_150_circuit1, var_150_circuit2
{0, 0},           //var_151_circuit1, var_151_circuit2
{0, 0},           //var_152_circuit1, var_152_circuit2
{0, 0},           //var_153_circuit1, var_153_circuit2
{0, 0},           //var_154_circuit1, var_154_circuit2
{0, 0},           //var_155_circuit1, var_155_circuit2
{0, 0},           //var_156_circuit1, var_156_circuit2
{0, 0},           //var_157_circuit1, var_157_circuit2
{0, 0},           //var_158_circuit1, var_158_circuit2
{0, 0},           //var_159_circuit1, var_159_circuit2
{0, 0},           //var_160_circuit1, var_160_circuit2
{0, 0},           //var_161_circuit1, var_161_circuit2
{0, 0},           //var_162_circuit1, var_162_circuit2
{0, 0},           //var_163_circuit1, var_163_circuit2
{0, 0},           //var_164_circuit1, var_164_circuit2
{0, 0},           //var_165_circuit1, var_165_circuit2
{0, 0},           //var_166_circuit1, var_166_circuit2
{0, 0},           //var_167_circuit1, var_167_circuit2
{0, 0},           //var_168_circuit1, var_168_circuit2
{0, 0},           //var_169_circuit1, var_169_circuit2
{0, 0},           //var_170_circuit1, var_170_circuit2
{0, 0},           //var_171_circuit1, var_171_circuit2
{0, 0},           //var_172_circuit1, var_172_circuit2
{0, 0},           //var_173_circuit1, var_173_circuit2
{0, 0},           //var_174_circuit1, var_174_circuit2
{0, 0},           //var_175_circuit1, var_175_circuit2
{0, 0},           //var_176_circuit1, var_176_circuit2
{0, 0},           //var_177_circuit1, var_177_circuit2
{0, 0},           //var_178_circuit1, var_178_circuit2
{0, 0},           //var_179_circuit1, var_179_circuit2
{0, 0},           //var_180_circuit1, var_180_circuit2
{0, 0},           //var_181_circuit1, var_181_circuit2
{0, 0},           //var_182_circuit1, var_182_circuit2
{0, 0},           //var_183_circuit1, var_183_circuit2
{0, 0},           //var_184_circuit1, var_184_circuit2
{0, 0},           //var_185_circuit1, var_185_circuit2
{0, 0},           //var_186_circuit1, var_186_circuit2
{0, 0},           //var_187_circuit1, var_187_circuit2
{0, 0},           //var_188_circuit1, var_188_circuit2
{0, 0},           //var_189_circuit1, var_189_circuit2
{0, 0},           //var_190_circuit1, var_190_circuit2
{0, 0},           //var_191_circuit1, var_191_circuit2
{0, 0},           //var_192_circuit1, var_192_circuit2
{0, 0},           //var_193_circuit1, var_193_circuit2
{0, 0},           //var_194_circuit1, var_194_circuit2
{0, 0},           //var_195_circuit1, var_195_circuit2
{0, 0},           //var_196_circuit1, var_196_circuit2
{0, 0},           //var_197_circuit1, var_197_circuit2
{0, 0},           //var_198_circuit1, var_198_circuit2
{0, 0},           //var_199_circuit1, var_199_circuit2
{0, 0},           //var_200_circuit1, var_200_circuit2
{0, 0},           //var_201_circuit1, var_201_circuit2
{0, 0},           //var_202_circuit1, var_202_circuit2
{0, 0},           //var_203_circuit1, var_203_circuit2
{0, 0},           //var_204_circuit1, var_204_circuit2
{0, 0},           //var_205_circuit1, var_205_circuit2
{0, 0},           //var_206_circuit1, var_206_circuit2
{0, 0},           //var_207_circuit1, var_207_circuit2
{0, 0},           //var_208_circuit1, var_208_circuit2
{0, 0},           //var_209_circuit1, var_209_circuit2
{0, 0},           //var_210_circuit1, var_210_circuit2
{0, 0},           //var_211_circuit1, var_211_circuit2
{0, 0},           //var_212_circuit1, var_212_circuit2
{0, 0},           //var_213_circuit1, var_213_circuit2
{0, 0},           //var_214_circuit1, var_214_circuit2
{0, 0},           //var_215_circuit1, var_215_circuit2
{0, 0},           //var_216_circuit1, var_216_circuit2
{0, 0},           //var_217_circuit1, var_217_circuit2
{0, 0},           //var_218_circuit1, var_218_circuit2
{0, 0},           //var_219_circuit1, var_219_circuit2
{0, 0},           //var_220_circuit1, var_220_circuit2
{0, 0},           //var_221_circuit1, var_221_circuit2
{0, 0},           //var_222_circuit1, var_222_circuit2
{0, 0},           //var_223_circuit1, var_223_circuit2
{0, 0},           //var_224_circuit1, var_224_circuit2
{0, 0},           //var_225_circuit1, var_225_circuit2
{0, 0},           //var_226_circuit1, var_226_circuit2
{0, 0},           //var_227_circuit1, var_227_circuit2
{0, 0},           //var_228_circuit1, var_228_circuit2
{0, 0},           //var_229_circuit1, var_229_circuit2
{0, 0},           //var_230_circuit1, var_230_circuit2
{0, 0},           //var_231_circuit1, var_231_circuit2
{0, 0},           //var_232_circuit1, var_232_circuit2
{0, 0},           //var_233_circuit1, var_233_circuit2
{0, 0},           //var_234_circuit1, var_234_circuit2
{0, 0},           //var_235_circuit1, var_235_circuit2
{0, 0},           //var_236_circuit1, var_236_circuit2
{0, 0},           //var_237_circuit1, var_237_circuit2
{0, 0},           //var_238_circuit1, var_238_circuit2
{0, 0},           //var_239_circuit1, var_239_circuit2
{0, 0},           //var_240_circuit1, var_240_circuit2
{0, 0},           //var_241_circuit1, var_241_circuit2
{0, 0},           //var_242_circuit1, var_242_circuit2
{0, 0},           //var_243_circuit1, var_243_circuit2
{0, 0},           //var_244_circuit1, var_244_circuit2
{0, 0},           //var_245_circuit1, var_245_circuit2
{0, 0},           //var_246_circuit1, var_246_circuit2
{0, 0},           //var_247_circuit1, var_247_circuit2
{0, 0},           //var_248_circuit1, var_248_circuit2
{0, 0},           //var_249_circuit1, var_249_circuit2
{0, 0},           //var_250_circuit1, var_250_circuit2
{0, 0},           //var_251_circuit1, var_251_circuit2
{0, 0},           //var_252_circuit1, var_252_circuit2
{0, 0},           //var_253_circuit1, var_253_circuit2
{0, 0},           //var_254_circuit1, var_254_circuit2
{0, 0},           //var_255_circuit1, var_255_circuit2
{0, 0},           //var_256_circuit1, var_256_circuit2
{0, 0},           //var_257_circuit1, var_257_circuit2
{0, 0},           //var_258_circuit1, var_258_circuit2
{0, 0},           //var_259_circuit1, var_259_circuit2
{0, 0},           //var_260_circuit1, var_260_circuit2
{0, 0},           //var_261_circuit1, var_261_circuit2
{0, 0},           //var_262_circuit1, var_262_circuit2
{0, 0},           //var_263_circuit1, var_263_circuit2
{0, 0},           //var_264_circuit1, var_264_circuit2
{0, 0},           //var_265_circuit1, var_265_circuit2
{0, 0},           //var_266_circuit1, var_266_circuit2
{0, 0},           //var_267_circuit1, var_267_circuit2
{0, 0},           //var_268_circuit1, var_268_circuit2
{0, 0},           //var_269_circuit1, var_269_circuit2
{0, 0},           //var_270_circuit1, var_270_circuit2
{0, 0},           //var_271_circuit1, var_271_circuit2
{0, 0},           //var_272_circuit1, var_272_circuit2
{0, 0},           //var_273_circuit1, var_273_circuit2
{0, 0},           //var_274_circuit1, var_274_circuit2
{0, 0},           //var_275_circuit1, var_275_circuit2
{0, 0},           //var_276_circuit1, var_276_circuit2
{0, 0},           //var_277_circuit1, var_277_circuit2
{0, 0},           //var_278_circuit1, var_278_circuit2
{0, 0},           //var_279_circuit1, var_279_circuit2
{0, 0},           //var_280_circuit1, var_280_circuit2
{0, 0},           //var_281_circuit1, var_281_circuit2
{0, 0},           //var_282_circuit1, var_282_circuit2
{0, 0},           //var_283_circuit1, var_283_circuit2
{0, 0},           //var_284_circuit1, var_284_circuit2
{0, 0},           //var_285_circuit1, var_285_circuit2
{0, 0},           //var_286_circuit1, var_286_circuit2
{0, 0},           //var_287_circuit1, var_287_circuit2
{0, 0},           //var_288_circuit1, var_288_circuit2
{0, 0},           //var_289_circuit1, var_289_circuit2
{0, 0},           //var_290_circuit1, var_290_circuit2
{0, 0},           //var_291_circuit1, var_291_circuit2
{0, 0},           //var_292_circuit1, var_292_circuit2
{0, 0},           //var_293_circuit1, var_293_circuit2
{0, 0},           //var_294_circuit1, var_294_circuit2
{0, 0},           //var_295_circuit1, var_295_circuit2
{0, 0},           //var_296_circuit1, var_296_circuit2
{0, 0},           //var_297_circuit1, var_297_circuit2
{0, 0},           //var_298_circuit1, var_298_circuit2
{0, 0},           //var_299_circuit1, var_299_circuit2
{0, 0},           //var_300_circuit1, var_300_circuit2
{0, 0},           //var_301_circuit1, var_301_circuit2
{0, 0},           //var_302_circuit1, var_302_circuit2
{0, 0},           //var_303_circuit1, var_303_circuit2
{0, 0},           //var_304_circuit1, var_304_circuit2
{0, 0},           //var_305_circuit1, var_305_circuit2
{0, 0},           //var_306_circuit1, var_306_circuit2
{0, 0},           //var_307_circuit1, var_307_circuit2
{0, 0},           //var_308_circuit1, var_308_circuit2
{0, 0},           //var_309_circuit1, var_309_circuit2
{0, 0},           //var_310_circuit1, var_310_circuit2
{0, 0},           //var_311_circuit1, var_311_circuit2
{0, 0},           //var_312_circuit1, var_312_circuit2
{0, 0},           //var_313_circuit1, var_313_circuit2
{0, 0},           //var_314_circuit1, var_314_circuit2
{0, 0},           //var_315_circuit1, var_315_circuit2
{0, 0},           //var_316_circuit1, var_316_circuit2
{0, 0},           //var_317_circuit1, var_317_circuit2
{0, 1},           //var_318_circuit1, var_318_circuit2
{0, 0},           //var_319_circuit1, var_319_circuit2
{0, 0},           //var_320_circuit1, var_320_circuit2
{0, 1},           //c_circuit1, c_circuit2
};