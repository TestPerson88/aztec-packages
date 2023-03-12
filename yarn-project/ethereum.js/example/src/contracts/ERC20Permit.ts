// THIS IS GENERATED CODE, DO NOT EDIT!
/* eslint-disable */
import { EthAddress } from "@aztec/ethereum.js/eth_address";
import { EthereumRpc } from "@aztec/ethereum.js/eth_rpc";
import { Contract, ContractTxReceipt, EventLog, Options, TxCall, TxSend } from "@aztec/ethereum.js/contract";
import * as Bytes from "@aztec/ethereum.js/contract/bytes.js";
import abi from "./ERC20PermitAbi.js";
export type ApprovalEvent = {
    owner: EthAddress;
    spender: EthAddress;
    value: bigint;
};
export type TransferEvent = {
    from: EthAddress;
    to: EthAddress;
    value: bigint;
};
export interface ApprovalEventLog extends EventLog<ApprovalEvent, "Approval"> {
}
export interface TransferEventLog extends EventLog<TransferEvent, "Transfer"> {
}
interface ERC20PermitEvents {
    Approval: ApprovalEvent;
    Transfer: TransferEvent;
}
interface ERC20PermitEventLogs {
    Approval: ApprovalEventLog;
    Transfer: TransferEventLog;
}
interface ERC20PermitTxEventLogs {
    Approval: ApprovalEventLog[];
    Transfer: TransferEventLog[];
}
export interface ERC20PermitTransactionReceipt extends ContractTxReceipt<ERC20PermitTxEventLogs> {
}
interface ERC20PermitMethods {
    DOMAIN_SEPARATOR(): TxCall<Bytes.Bytes32>;
    PERMIT_TYPEHASH(): TxCall<Bytes.Bytes32>;
    PERMIT_TYPEHASH_NON_STANDARD(): TxCall<Bytes.Bytes32>;
    allowance(owner: EthAddress, spender: EthAddress): TxCall<bigint>;
    approve(spender: EthAddress, amount: bigint): TxSend<ERC20PermitTransactionReceipt, boolean>;
    balanceOf(account: EthAddress): TxCall<bigint>;
    decimals(): TxCall<number>;
    decreaseAllowance(spender: EthAddress, subtractedValue: bigint): TxSend<ERC20PermitTransactionReceipt, boolean>;
    increaseAllowance(spender: EthAddress, addedValue: bigint): TxSend<ERC20PermitTransactionReceipt, boolean>;
    mint(_to: EthAddress, _value: bigint): TxSend<ERC20PermitTransactionReceipt, boolean>;
    name(): TxCall<string>;
    nonces(a0: EthAddress): TxCall<bigint>;
    permit(_holder: EthAddress, _spender: EthAddress, _nonce: bigint, _expiry: bigint, _allowed: boolean, _v: number, _r: Bytes.Bytes32, _s: Bytes.Bytes32): TxSend<ERC20PermitTransactionReceipt>;
    permit(_owner: EthAddress, _spender: EthAddress, _value: bigint, _deadline: bigint, _v: number, _r: Bytes.Bytes32, _s: Bytes.Bytes32): TxSend<ERC20PermitTransactionReceipt>;
    setDecimals(_decimals: number): TxSend<ERC20PermitTransactionReceipt>;
    symbol(): TxCall<string>;
    totalSupply(): TxCall<bigint>;
    transfer(to: EthAddress, amount: bigint): TxSend<ERC20PermitTransactionReceipt, boolean>;
    transferFrom(from: EthAddress, to: EthAddress, amount: bigint): TxSend<ERC20PermitTransactionReceipt, boolean>;
}
export interface ERC20PermitDefinition {
    methods: ERC20PermitMethods;
    events: ERC20PermitEvents;
    eventLogs: ERC20PermitEventLogs;
}
export class ERC20Permit extends Contract<ERC20PermitDefinition> {
    constructor(eth: EthereumRpc, address?: EthAddress, options?: Options) {
        super(eth, abi, address, options);
    }
    deploy(_symbol: string): TxSend<ERC20PermitTransactionReceipt> {
        return super.deployBytecode("0x60806040526005805460ff191660121790553480156200001e57600080fd5b506040516200162d3803806200162d833981016040819052620000419162000282565b80808181600390805190602001906200005c929190620001c6565b50805162000072906004906020840190620001c6565b505050507f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f620000a76200012c60201b60201c565b805160209182012060408051808201825260018152603160f81b90840152805192830193909352918101919091527fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc660608201524660808201523060a082015260c00160408051601f198184030181529190528051602090910120600655506200039b565b6060600380546200013d906200035e565b80601f01602080910402602001604051908101604052809291908181526020018280546200016b906200035e565b8015620001bc5780601f106200019057610100808354040283529160200191620001bc565b820191906000526020600020905b8154815290600101906020018083116200019e57829003601f168201915b5050505050905090565b828054620001d4906200035e565b90600052602060002090601f016020900481019282620001f8576000855562000243565b82601f106200021357805160ff191683800117855562000243565b8280016001018555821562000243579182015b828111156200024357825182559160200191906001019062000226565b506200025192915062000255565b5090565b5b8082111562000251576000815560010162000256565b634e487b7160e01b600052604160045260246000fd5b600060208083850312156200029657600080fd5b82516001600160401b0380821115620002ae57600080fd5b818501915085601f830112620002c357600080fd5b815181811115620002d857620002d86200026c565b604051601f8201601f19908116603f011681019083821181831017156200030357620003036200026c565b8160405282815288868487010111156200031c57600080fd5b600093505b8284101562000340578484018601518185018701529285019262000321565b82841115620003525760008684830101525b98975050505050505050565b600181811c908216806200037357607f821691505b602082108114156200039557634e487b7160e01b600052602260045260246000fd5b50919050565b61128280620003ab6000396000f3fe608060405234801561001057600080fd5b50600436106101515760003560e01c806340c10f19116100cd57806395d89b4111610081578063a9059cbb11610066578063a9059cbb1461030d578063d505accf14610320578063dd62ed3e1461033357600080fd5b806395d89b41146102f2578063a457c2d7146102fa57600080fd5b80637a1395aa116100b25780637a1395aa1461027b5780637ecebe00146102bf5780638fcbaf0c146102df57600080fd5b806340c10f191461023f57806370a082311461025257600080fd5b806323b872dd11610124578063313ce56711610109578063313ce5671461020e5780633644e51514610223578063395093511461022c57600080fd5b806323b872dd146101d457806330adf81f146101e757600080fd5b806306fdde0314610156578063095ea7b3146101745780630f96c5f41461019757806318160ddd146101cc575b600080fd5b61015e61036c565b60405161016b9190610f33565b60405180910390f35b610187610182366004610f82565b6103fe565b604051901515815260200161016b565b6101be7fea2aa0a1be11a07ed86d755c93467f4f82362b452371d1ba94d1715123511acb81565b60405190815260200161016b565b6002546101be565b6101876101e2366004610fac565b610416565b6101be7f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c981565b60055460405160ff909116815260200161016b565b6101be60065481565b61018761023a366004610f82565b61043a565b61018761024d366004610f82565b610479565b6101be610260366004610fe8565b6001600160a01b031660009081526020819052604090205490565b6102bd61028936600461101b565b600580547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001660ff92909216919091179055565b005b6101be6102cd366004610fe8565b60076020526000908152604090205481565b6102bd6102ed366004611036565b61048e565b61015e610776565b610187610308366004610f82565b610785565b61018761031b366004610f82565b61082f565b6102bd61032e3660046110b8565b61083d565b6101be610341366004611122565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b60606003805461037b90611155565b80601f01602080910402602001604051908101604052809291908181526020018280546103a790611155565b80156103f45780601f106103c9576101008083540402835291602001916103f4565b820191906000526020600020905b8154815290600101906020018083116103d757829003601f168201915b5050505050905090565b60003361040c818585610a77565b5060019392505050565b600033610424858285610bcf565b61042f858585610c5b565b506001949350505050565b3360008181526001602090815260408083206001600160a01b038716845290915281205490919061040c90829086906104749087906111d8565b610a77565b60006104858383610e48565b50600192915050565b600654604080517fea2aa0a1be11a07ed86d755c93467f4f82362b452371d1ba94d1715123511acb60208201526001600160a01b03808c169282019290925290891660608201526080810188905260a0810187905285151560c08201526000919060e0016040516020818303038152906040528051906020012060405160200161054a9291907f190100000000000000000000000000000000000000000000000000000000000081526002810192909252602282015260420190565b60408051601f19818403018152919052805160209091012090506001600160a01b0389166105bf5760405162461bcd60e51b815260206004820152600e60248201527f494e56414c49445f484f4c44455200000000000000000000000000000000000060448201526064015b60405180910390fd5b60408051600081526020810180835283905260ff861691810191909152606081018490526080810183905260019060a0016020604051602081039080840390855afa158015610612573d6000803e3d6000fd5b505050602060405103516001600160a01b0316896001600160a01b03161461067c5760405162461bcd60e51b815260206004820152601160248201527f494e56414c49445f5349474e415455524500000000000000000000000000000060448201526064016105b6565b8515806106895750428610155b6106d55760405162461bcd60e51b815260206004820152600760248201527f455850495245440000000000000000000000000000000000000000000000000060448201526064016105b6565b6001600160a01b03891660009081526007602052604081208054916106f9836111f0565b91905055871461074b5760405162461bcd60e51b815260206004820152600d60248201527f494e56414c49445f4e4f4e43450000000000000000000000000000000000000060448201526064016105b6565b60008561075957600061075d565b6000195b905061076a8a8a83610a77565b50505050505050505050565b60606004805461037b90611155565b3360008181526001602090815260408083206001600160a01b0387168452909152812054909190838110156108225760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760448201527f207a65726f00000000000000000000000000000000000000000000000000000060648201526084016105b6565b61042f8286868403610a77565b60003361040c818585610c5b565b4284101561088d5760405162461bcd60e51b815260206004820152600760248201527f455850495245440000000000000000000000000000000000000000000000000060448201526064016105b6565b6006546001600160a01b038816600090815260076020526040812080549192917f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9918b918b918b9190876108e0836111f0565b909155506040805160208101969096526001600160a01b0394851690860152929091166060840152608083015260a082015260c0810187905260e001604051602081830303815290604052805190602001206040516020016109749291907f190100000000000000000000000000000000000000000000000000000000000081526002810192909252602282015260420190565b60408051601f198184030181528282528051602091820120600080855291840180845281905260ff88169284019290925260608301869052608083018590529092509060019060a0016020604051602081039080840390855afa1580156109df573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b03811615801590610a155750886001600160a01b0316816001600160a01b0316145b610a615760405162461bcd60e51b815260206004820152601160248201527f494e56414c49445f5349474e415455524500000000000000000000000000000060448201526064016105b6565b610a6c898989610a77565b505050505050505050565b6001600160a01b038316610af25760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460448201527f726573730000000000000000000000000000000000000000000000000000000060648201526084016105b6565b6001600160a01b038216610b6e5760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f20616464726560448201527f737300000000000000000000000000000000000000000000000000000000000060648201526084016105b6565b6001600160a01b0383811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b6001600160a01b038381166000908152600160209081526040808320938616835292905220546000198114610c555781811015610c0a610776565b604051602001610c1a919061120b565b60405160208183030381529060405290610c475760405162461bcd60e51b81526004016105b69190610f33565b50610c558484848403610a77565b50505050565b6001600160a01b038316610cd75760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f20616460448201527f647265737300000000000000000000000000000000000000000000000000000060648201526084016105b6565b6001600160a01b038216610d535760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201527f657373000000000000000000000000000000000000000000000000000000000060648201526084016105b6565b6001600160a01b03831660009081526020819052604090205481811015610de25760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e742065786365656473206260448201527f616c616e6365000000000000000000000000000000000000000000000000000060648201526084016105b6565b6001600160a01b03848116600081815260208181526040808320878703905593871680835291849020805487019055925185815290927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a3610c55565b6001600160a01b038216610e9e5760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f20616464726573730060448201526064016105b6565b8060026000828254610eb091906111d8565b90915550506001600160a01b038216600081815260208181526040808320805486019055518481527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a35050565b60005b83811015610f22578181015183820152602001610f0a565b83811115610c555750506000910152565b6020815260008251806020840152610f52816040850160208701610f07565b601f01601f19169190910160400192915050565b80356001600160a01b0381168114610f7d57600080fd5b919050565b60008060408385031215610f9557600080fd5b610f9e83610f66565b946020939093013593505050565b600080600060608486031215610fc157600080fd5b610fca84610f66565b9250610fd860208501610f66565b9150604084013590509250925092565b600060208284031215610ffa57600080fd5b61100382610f66565b9392505050565b803560ff81168114610f7d57600080fd5b60006020828403121561102d57600080fd5b6110038261100a565b600080600080600080600080610100898b03121561105357600080fd5b61105c89610f66565b975061106a60208a01610f66565b965060408901359550606089013594506080890135801515811461108d57600080fd5b935061109b60a08a0161100a565b925060c0890135915060e089013590509295985092959890939650565b600080600080600080600060e0888a0312156110d357600080fd5b6110dc88610f66565b96506110ea60208901610f66565b955060408801359450606088013593506111066080890161100a565b925060a0880135915060c0880135905092959891949750929550565b6000806040838503121561113557600080fd5b61113e83610f66565b915061114c60208401610f66565b90509250929050565b600181811c9082168061116957607f821691505b602082108114156111a3577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600082198211156111eb576111eb6111a9565b500190565b6000600019821415611204576112046111a9565b5060010190565b6000825161121d818460208701610f07565b7f3a20696e73756666696369656e7420616c6c6f77616e6365000000000000000092019182525060180191905056fea264697066735822122054a35da2d250cd8d2d2f0d51975894ad0a754c0f6a8cb964d529e70c7ebf096664736f6c634300080a0033", _symbol) as any;
    }
}
export var ERC20PermitAbi = abi;
