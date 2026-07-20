import type { MetaAdsProvider } from "./provider.js";
import { DryRunProvider } from "./dry-run-provider.js";
import { GraphApiProvider } from "./graph-api-provider.js";

export function createProvider(): MetaAdsProvider {
  const name = process.env.META_ADS_PROVIDER || "dry-run";
  if (name === "dry-run") return new DryRunProvider();
  if (name === "graph-api") return new GraphApiProvider();
  throw new Error(`Unsupported META_ADS_PROVIDER: ${name}`);
}
