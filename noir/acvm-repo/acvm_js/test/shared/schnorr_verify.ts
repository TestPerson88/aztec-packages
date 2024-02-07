// See `schnorr_verify_circuit` integration test in `acir/tests/test_program_serialization.rs`.
export const bytecode = Uint8Array.from([
  31, 139, 8, 0, 0, 0, 0, 0, 0, 255, 77, 210, 7, 74, 3, 1, 20, 69, 209, 177, 247, 222, 123, 239, 189, 119, 141, 93, 99,
  220, 133, 251, 95, 130, 152, 103, 78, 32, 3, 195, 33, 4, 66, 248, 239, 254, 20, 69, 209, 84, 212, 158, 216, 206, 223,
  234, 219, 204, 146, 239, 91, 170, 111, 103, 245, 109, 101, 27, 219, 217, 193, 250, 219, 197, 110, 246, 176, 151, 125,
  236, 231, 0, 7, 57, 196, 97, 142, 112, 148, 99, 28, 231, 4, 39, 57, 197, 105, 206, 112, 150, 115, 156, 231, 2, 23,
  185, 196, 101, 174, 112, 149, 107, 92, 231, 6, 55, 185, 197, 109, 238, 112, 151, 123, 220, 231, 1, 15, 121, 196, 99,
  158, 240, 148, 103, 60, 231, 5, 47, 121, 197, 107, 222, 240, 150, 119, 188, 231, 3, 75, 124, 228, 83, 195, 142, 121,
  158, 125, 126, 225, 43, 223, 248, 206, 15, 126, 178, 204, 47, 86, 248, 237, 119, 43, 76, 127, 105, 47, 189, 165, 181,
  116, 150, 198, 234, 125, 117, 249, 47, 233, 41, 45, 165, 163, 52, 148, 126, 210, 78, 186, 73, 51, 233, 37, 173, 164,
  147, 52, 146, 62, 210, 70, 186, 72, 19, 233, 33, 45, 164, 131, 52, 144, 253, 23, 139, 218, 238, 217, 60, 123, 103,
  235, 236, 156, 141, 179, 239, 166, 93, 183, 237, 185, 107, 199, 125, 251, 29, 218, 237, 216, 94, 167, 118, 58, 183,
  207, 165, 93, 174, 237, 113, 107, 135, 123, 247, 47, 185, 251, 147, 59, 191, 184, 239, 155, 187, 126, 184, 103, 217,
  29, 235, 55, 171, 223, 173, 104, 184, 231, 255, 243, 7, 236, 52, 239, 128, 225, 3, 0, 0,
]);

export const initialWitnessMap = new Map([
  [1, '0x04b260954662e97f00cab9adb773a259097f7a274b83b113532bce27fa3fb96a'],
  [2, '0x2fd51571db6c08666b0edfbfbc57d432068bccd0110a39b166ab243da0037197'],
  [3, '0x000000000000000000000000000000000000000000000000000000000000002e'],
  [4, '0x00000000000000000000000000000000000000000000000000000000000000ce'],
  [5, '0x0000000000000000000000000000000000000000000000000000000000000052'],
  [6, '0x00000000000000000000000000000000000000000000000000000000000000aa'],
  [7, '0x0000000000000000000000000000000000000000000000000000000000000087'],
  [8, '0x000000000000000000000000000000000000000000000000000000000000002a'],
  [9, '0x0000000000000000000000000000000000000000000000000000000000000049'],
  [10, '0x000000000000000000000000000000000000000000000000000000000000009d'],
  [11, '0x0000000000000000000000000000000000000000000000000000000000000050'],
  [12, '0x000000000000000000000000000000000000000000000000000000000000007c'],
  [13, '0x000000000000000000000000000000000000000000000000000000000000009a'],
  [14, '0x00000000000000000000000000000000000000000000000000000000000000aa'],
  [15, '0x00000000000000000000000000000000000000000000000000000000000000df'],
  [16, '0x0000000000000000000000000000000000000000000000000000000000000023'],
  [17, '0x0000000000000000000000000000000000000000000000000000000000000034'],
  [18, '0x0000000000000000000000000000000000000000000000000000000000000010'],
  [19, '0x000000000000000000000000000000000000000000000000000000000000008a'],
  [20, '0x0000000000000000000000000000000000000000000000000000000000000047'],
  [21, '0x0000000000000000000000000000000000000000000000000000000000000063'],
  [22, '0x00000000000000000000000000000000000000000000000000000000000000e8'],
  [23, '0x0000000000000000000000000000000000000000000000000000000000000037'],
  [24, '0x0000000000000000000000000000000000000000000000000000000000000054'],
  [25, '0x0000000000000000000000000000000000000000000000000000000000000096'],
  [26, '0x000000000000000000000000000000000000000000000000000000000000003e'],
  [27, '0x00000000000000000000000000000000000000000000000000000000000000d5'],
  [28, '0x00000000000000000000000000000000000000000000000000000000000000ae'],
  [29, '0x0000000000000000000000000000000000000000000000000000000000000024'],
  [30, '0x000000000000000000000000000000000000000000000000000000000000002d'],
  [31, '0x0000000000000000000000000000000000000000000000000000000000000020'],
  [32, '0x0000000000000000000000000000000000000000000000000000000000000080'],
  [33, '0x000000000000000000000000000000000000000000000000000000000000004d'],
  [34, '0x0000000000000000000000000000000000000000000000000000000000000047'],
  [35, '0x00000000000000000000000000000000000000000000000000000000000000a5'],
  [36, '0x00000000000000000000000000000000000000000000000000000000000000bb'],
  [37, '0x00000000000000000000000000000000000000000000000000000000000000f6'],
  [38, '0x00000000000000000000000000000000000000000000000000000000000000c3'],
  [39, '0x000000000000000000000000000000000000000000000000000000000000000b'],
  [40, '0x000000000000000000000000000000000000000000000000000000000000003b'],
  [41, '0x0000000000000000000000000000000000000000000000000000000000000065'],
  [42, '0x00000000000000000000000000000000000000000000000000000000000000c9'],
  [43, '0x0000000000000000000000000000000000000000000000000000000000000001'],
  [44, '0x0000000000000000000000000000000000000000000000000000000000000085'],
  [45, '0x0000000000000000000000000000000000000000000000000000000000000006'],
  [46, '0x000000000000000000000000000000000000000000000000000000000000009e'],
  [47, '0x000000000000000000000000000000000000000000000000000000000000002f'],
  [48, '0x0000000000000000000000000000000000000000000000000000000000000010'],
  [49, '0x00000000000000000000000000000000000000000000000000000000000000e6'],
  [50, '0x0000000000000000000000000000000000000000000000000000000000000030'],
  [51, '0x000000000000000000000000000000000000000000000000000000000000004a'],
  [52, '0x0000000000000000000000000000000000000000000000000000000000000018'],
  [53, '0x000000000000000000000000000000000000000000000000000000000000007c'],
  [54, '0x00000000000000000000000000000000000000000000000000000000000000d0'],
  [55, '0x00000000000000000000000000000000000000000000000000000000000000ab'],
  [56, '0x0000000000000000000000000000000000000000000000000000000000000031'],
  [57, '0x00000000000000000000000000000000000000000000000000000000000000d5'],
  [58, '0x0000000000000000000000000000000000000000000000000000000000000063'],
  [59, '0x0000000000000000000000000000000000000000000000000000000000000084'],
  [60, '0x00000000000000000000000000000000000000000000000000000000000000a3'],
  [61, '0x00000000000000000000000000000000000000000000000000000000000000a6'],
  [62, '0x00000000000000000000000000000000000000000000000000000000000000d5'],
  [63, '0x0000000000000000000000000000000000000000000000000000000000000091'],
  [64, '0x000000000000000000000000000000000000000000000000000000000000000d'],
  [65, '0x000000000000000000000000000000000000000000000000000000000000009c'],
  [66, '0x00000000000000000000000000000000000000000000000000000000000000f9'],
  [67, '0x0000000000000000000000000000000000000000000000000000000000000000'],
  [68, '0x0000000000000000000000000000000000000000000000000000000000000001'],
  [69, '0x0000000000000000000000000000000000000000000000000000000000000002'],
  [70, '0x0000000000000000000000000000000000000000000000000000000000000003'],
  [71, '0x0000000000000000000000000000000000000000000000000000000000000004'],
  [72, '0x0000000000000000000000000000000000000000000000000000000000000005'],
  [73, '0x0000000000000000000000000000000000000000000000000000000000000006'],
  [74, '0x0000000000000000000000000000000000000000000000000000000000000007'],
  [75, '0x0000000000000000000000000000000000000000000000000000000000000008'],
  [76, '0x0000000000000000000000000000000000000000000000000000000000000009'],
]);

export const expectedWitnessMap = new Map(initialWitnessMap).set(
  77,
  '0x0000000000000000000000000000000000000000000000000000000000000001',
);
