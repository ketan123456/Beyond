declare module "@splidejs/react-splide" {
  import type { ComponentType, PropsWithChildren } from "react";

  export const Splide: ComponentType<PropsWithChildren<Record<string, unknown>>>;
  export const SplideSlide: ComponentType<PropsWithChildren<Record<string, unknown>>>;
  export const SplideTrack: ComponentType<PropsWithChildren<Record<string, unknown>>>;
}
