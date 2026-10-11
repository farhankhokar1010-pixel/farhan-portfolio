/** Single place for 3D asset paths and framing numbers. */
export const MODEL_URL = "/models/farhan.glb";            // 2048px textures — desktop
export const MODEL_LITE_URL = "/models/farhan-lite.glb";  // 1024px textures — mobile / performance mode

/** Model is normalised to this height (world units) with its feet on y = 0. */
export const MODEL_HEIGHT = 1.8;

export const CAMERA = {
  fov: 30,
  desktop: { position: [0.0, 0.95, 3.85] as const, lookAt: [0, 0.9, 0] as const },
  mobile: { position: [0.0, 0.95, 4.2] as const, lookAt: [0, 0.92, 0] as const },
};
