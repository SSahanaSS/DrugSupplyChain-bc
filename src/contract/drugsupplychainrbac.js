export const CONTRACT_ADDRESS = "0xD7B22513C8CCD405F8D955a79b2aDf28432A17dE";

export const CONTRACT_ABI = [
  
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_batchNumber",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_drugName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_manufacturer",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_composition",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_productionDate",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_expiryDate",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_qrCode",
				"type": "string"
			}
		],
		"name": "addDrug",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "batchNumber",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "pharmacy",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "customer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "finalPrice",
				"type": "uint256"
			}
		],
		"name": "CustomerPurchase",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "batchNumber",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "drugName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "manufacturer",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "composition",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "productionDate",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "expiryDate",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "qrCode",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "currentOwner",
				"type": "address"
			}
		],
		"name": "DrugCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "batchNumber",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "role",
				"type": "string"
			}
		],
		"name": "DrugTransferred",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_batchNumber",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "_customer",
				"type": "address"
			}
		],
		"name": "purchaseByCustomer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "enum DrugSupplyChainRBAC.Role",
				"name": "_role",
				"type": "uint8"
			}
		],
		"name": "registerRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_account",
				"type": "address"
			}
		],
		"name": "revokeRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "enum DrugSupplyChainRBAC.Role",
				"name": "role",
				"type": "uint8"
			}
		],
		"name": "RoleAssigned",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "RoleRevoked",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_batchNumber",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "_distributor",
				"type": "address"
			}
		],
		"name": "transferToDistributor",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_batchNumber",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "_pharmacy",
				"type": "address"
			}
		],
		"name": "transferToPharmacy",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "admin",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_batchNumber",
				"type": "string"
			}
		],
		"name": "getCurrentOwner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_batchNumber",
				"type": "string"
			}
		],
		"name": "getDiscountedPrice",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_batchNumber",
				"type": "string"
			}
		],
		"name": "getDrug",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "drugName",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "manufacturer",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "composition",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "productionDate",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "expiryDate",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "price",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "qrCode",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "currentOwner",
						"type": "address"
					}
				],
				"internalType": "struct DrugSupplyChainRBAC.DrugView",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_batchNumber",
				"type": "string"
			}
		],
		"name": "getOwnershipHistory",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "roles",
		"outputs": [
			{
				"internalType": "enum DrugSupplyChainRBAC.Role",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}

  // Paste your contract ABI JSON array here
];
