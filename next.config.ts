import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Turbopack panic 방지: 복잡한 SVG + JSX 렌더링 시 Turbopack 내부 오류 발생
  // Webpack 모드를 강제 사용
  bundlePagesRouterDependencies: true,
};

export default nextConfig;
