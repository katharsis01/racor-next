import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  transpilePackages: ["three"],
  async redirects() {
    return [
      {
        source: "/prendas/alto-del-leon",
        destination: "/prendas/maillot-manga-larga-termico-alto-del-leon",
        permanent: true,
      },
      {
        source: "/prendas/termico-cotor",
        destination: "/prendas/maillot-manga-larga-termico-cotos",
        permanent: true,
      },
      {
        source: "/prendas/culotte-corto",
        destination: "/prendas/culotte-puebla",
        permanent: true,
      },
      {
        source: "/prendas/culotte-largo",
        destination: "/prendas/culotte-rascafria",
        permanent: true,
      },
      {
        source: "/prendas/chaleco",
        destination: "/prendas/chaleco-miraflores",
        permanent: true,
      },
      {
        source: "/prendas/culotte-morcuera",
        destination: "/prendas/categoria/culottes-cortos",
        permanent: true,
      },
      {
        source: "/prendas/categoria/culottes-chalecos",
        destination: "/prendas",
        permanent: true,
      },
      {
        source: "/prendas/categoria/aero",
        destination: "/prendas",
        permanent: true,
      },
      {
        source: "/prendas/:handle(contrarreloj-valdesqui|buzo-siete-picos|pursuit-experience|mulero-cuesma)",
        destination: "/prendas",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "le-de.cdn-website.com",
        pathname: "/d2da41e3f40d49a0ab1b487666827263/**",
      },
    ],
  },
};

export default nextConfig;
