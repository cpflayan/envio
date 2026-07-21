import { indexer, MetaMorphoFactory, MetaMorpho } from "envio";
import { getAddress } from "viem";
import { vaultId } from "../utils/ids.js";

indexer.contractRegister(
  { contract: "MetaMorphoFactory", event: "CreateMetaMorpho" },
  async ({ event, context }) => {
  context.chain.MetaMorpho.add(event.params.metaMorpho);
}
);

indexer.onEvent(
  { contract: "MetaMorphoFactory", event: "CreateMetaMorpho" },
  async ({ event, context }) => {
  const id = vaultId(event.chainId, event.params.metaMorpho);

  context.Vault.set({
    id,
    chainId: event.chainId,
    address: getAddress(event.params.metaMorpho),
    withdrawQueue: [],
  });
}
);

indexer.onEvent(
  { contract: "MetaMorpho", event: "SetWithdrawQueue" },
  async ({ event, context }) => {
  const id = vaultId(event.chainId, event.srcAddress);

  context.Vault.set({
    id,
    chainId: event.chainId,
    address: getAddress(event.srcAddress),
    withdrawQueue: [...event.params.newWithdrawQueue],
  });
}
);
