import type Provider from "@/provider/interface";

import ProviderAli from "./lib/ali";
import ProviderBaidu from "./lib/baidu";
import ProviderQuark from "./lib/quark";
import ProviderPikpak from "./lib/pikpak";

export let provider: Provider | undefined;
export const getProvider = (): Provider | undefined => {
  if (ProviderAli.test()) {
    provider = provider instanceof ProviderAli ? provider : new ProviderAli();
  } else if (ProviderBaidu.test()) {
    provider = provider instanceof ProviderBaidu ? provider : new ProviderBaidu();
  } else if (ProviderQuark.test()) {
    provider = provider instanceof ProviderQuark ? provider : new ProviderQuark();
  } else if (ProviderPikpak.test()) {
    provider = provider instanceof ProviderPikpak ? provider : new ProviderPikpak();
  } else {
    provider = undefined;
    return undefined;
  }
  return provider;
};

export default getProvider;
