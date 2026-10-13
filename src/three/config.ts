/** Single place for 3D asset paths and framing numbers. */
export const MODEL_URL = "/models/farhan.glb";                // 2048px face atlas, ~47k triangles — desktop on a normal link (~0.5 MB)
export const MODEL_MOBILE_URL = "/models/farhan-mobile.glb";  // 1024/512px textures, ~12k triangles — phones, slow links, performance mode (~0.17 MB)
/** Download sizes in bytes, used for the progress readout while the model streams in. */
export const MODEL_BYTES = { [MODEL_URL]: 527520, [MODEL_MOBILE_URL]: 174712 } as Record<string, number>;

/** Model is normalised to this height (world units) with its feet on y = 0. */
export const MODEL_HEIGHT = 1.8;

export const CAMERA = {
  fov: 30,
  desktop: { position: [0.0, 0.95, 3.85] as const, lookAt: [0, 0.9, 0] as const },
  mobile: { position: [0.0, 0.95, 4.2] as const, lookAt: [0, 0.92, 0] as const },
};
