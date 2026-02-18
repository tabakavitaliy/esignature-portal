import type { ReactNode } from 'react';

/**
 * BackgroundPattern component renders a decorative SVG pattern
 * @returns ReactNode
 */
export function BackgroundPattern(): ReactNode {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <svg
        width="311"
        height="598"
        viewBox="0 0 311 598"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
      >
        <g opacity="0.05">
          <path
            d="M314.571 449.806L286.678 498.112C366.038 543.931 467.873 516.636 513.673 437.277L465.368 409.384C434.931 462.104 367.272 480.243 314.551 449.806H314.571Z"
            fill="white"
          />
          <path
            d="M477.879 210.262C508.316 262.982 490.196 330.641 437.476 361.078L465.368 409.384C544.727 363.565 572.004 261.729 526.185 182.37L477.879 210.262Z"
            fill="white"
          />
          <path
            d="M176.265 387.737H120.499C120.499 479.376 195.059 553.916 286.678 553.916V498.151C225.804 498.151 176.265 448.63 176.265 387.756V387.737Z"
            fill="white"
          />
          <path
            d="M283.768 148.174L311.66 99.8682C232.301 54.0489 130.465 81.3439 84.6652 160.704L132.971 188.596C163.408 135.876 231.067 117.737 283.787 148.174H283.768Z"
            fill="white"
          />
          <path
            d="M160.864 236.921L132.972 188.615C53.6119 234.434 26.3363 336.27 72.1555 415.63L120.461 387.737C90.0245 335.017 108.144 267.358 160.864 236.921Z"
            fill="white"
          />
          <path
            d="M422.073 210.262H477.839C477.839 118.624 403.279 44.083 311.66 44.083V99.8487C372.534 99.8487 422.073 149.369 422.073 210.243V210.262Z"
            fill="white"
          />
        </g>
      </svg>
    </div>
  );
}
