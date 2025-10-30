/* eslint-disable @typescript-eslint/no-explicit-any */
export type GenericContractsDeclaration = {
  [chainId: number]: {
    [contractName: string]: {
      address: string;
      abi: any[];
    };
  };
};
