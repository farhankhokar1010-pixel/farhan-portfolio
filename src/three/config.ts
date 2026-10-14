/** Single place for 3D asset paths and framing numbers. */
/** ONE model for every device (phone, tablet, laptop): ~51k triangles (face at full detail), 2048px colour map, ~0.58 MB. */
export const MODEL_URL = "/models/farhan.glb";
/** Download size in bytes, used for the progress readout while the model streams in. */
export const MODEL_BYTES = { [MODEL_URL]: 592976 } as Record<string, number>;

/** Model is normalised to this height (world units) with its feet on y = 0. */
export const MODEL_HEIGHT = 1.8;

export const CAMERA = {
  fov: 30,
  desktop: { position: [0.0, 0.95, 3.85] as const, lookAt: [0, 0.9, 0] as const },
  mobile: { position: [0.0, 0.95, 4.2] as const, lookAt: [0, 0.92, 0] as const },
};
