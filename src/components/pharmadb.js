import React, { useState, useEffect } from "react";
import { BrowserProvider, Contract, Interface } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../contract/drugsupplychainrbac";

export default function PharmacyDashboard({ account }) {
  const [contract, setContract] = useState(null);
  const [batchNumber, setBatchNumber] = useState("");
  const [customer, setCustomer] = useState("");
  const [ownedDrugs, setOwnedDrugs] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [fromDistributor, setFromDistributor] = useState([]); // ✅ new state
  const [error, setError] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        if (!window.ethereum) throw new Error("Metamask not installed");

        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contractInstance = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        setContract(contractInstance);

        await loadOwnedDrugs(contractInstance);
      } catch (err) {
        console.error("Initialization Error:", err);
        setError(err.message);
      }
    };
    init();
  }, []);

  const loadOwnedDrugs = async (contractInstance) => {
    try {
      const allBatches = ["batch1", "batch2", "batch3"]; // Replace with dynamic logic if needed
      const drugs = [];
      for (let batch of allBatches) {
        try {
          const data = await contractInstance.getDrug(batch);
          if (data.currentOwner.toLowerCase() === account.toLowerCase()) {
            drugs.push({
              batchNumber: batch,
              drugName: data.drugName,
              productionDate: data.productionDate,
              expiryDate: data.expiryDate,
              price: data.price?.toString?.() || data.price,
              qrCode: data.qrCode,
              currentOwner: data.currentOwner,
            });
          }
        } catch {}
      }
      setOwnedDrugs(drugs);
    } catch (err) {
      console.error("Load Owned Drugs Error:", err);
      setError(err.message || "Failed to load drugs");
    }
  };

  const sellToCustomer = async () => {
    if (!contract) return;
    try {
      const tx = await contract.purchaseByCustomer(batchNumber, customer);
      await tx.wait();
      alert("Drug sold to customer successfully!");
      setBatchNumber("");
      setCustomer("");
      await loadOwnedDrugs(contract);
    } catch (err) {
      console.error("Sell Error:", err);
      setError(err.message || "Error selling drug");
      alert(`Failed to sell: ${err.message}`);
    }
  };

  // ✅ Fetch all transactions (to pharmacy)
  const loadTransactions = async () => {
    if (!contract) return;
    try {
      const provider = await contract.runner.provider;
      const iface = new Interface(CONTRACT_ABI);
      const currentBlock = await provider.getBlockNumber();
      const startBlock = Math.max(0, currentBlock - 5000);

      const logs = await provider.getLogs({
        fromBlock: startBlock,
        toBlock: "latest",
        address: CONTRACT_ADDRESS,
      });

      const decoded = logs
        .map((log) => {
          try {
            const parsed = iface.parseLog(log);
            if (parsed && parsed.name === "DrugTransferred") {
              return {
                event: parsed.name,
                batchNumber: parsed.args.batchNumber,
                from: parsed.args.from,
                to: parsed.args.to,
                role: parsed.args.role,
              };
            }
          } catch {
            return null;
          }
          return null;
        })
        .filter((x) => x);

      setTransactions(decoded);
      alert("Transactions loaded successfully!");
    } catch (err) {
      console.error("Transaction Fetch Error:", err);
      setError(err.message);
    }
  };

  // ✅ Filter transactions: only Distributor → Pharmacy
  const loadFromDistributor = async () => {
    if (!contract) return;
    try {
      const provider = await contract.runner.provider;
      const iface = new Interface(CONTRACT_ABI);
      const currentBlock = await provider.getBlockNumber();
      const startBlock = Math.max(0, currentBlock - 5000);

      const logs = await provider.getLogs({
        fromBlock: startBlock,
        toBlock: "latest",
        address: CONTRACT_ADDRESS,
      });

      const filtered = logs
        .map((log) => {
          try {
            const parsed = iface.parseLog(log);
            if (
              parsed.name === "DrugTransferred" &&
              parsed.args.role === "Pharmacy" &&
              parsed.args.to.toLowerCase() === account.toLowerCase()
            ) {
              return {
                batchNumber: parsed.args.batchNumber,
                from: parsed.args.from,
                to: parsed.args.to,
                role: parsed.args.role,
              };
            }
          } catch {
            return null;
          }
          return null;
        })
        .filter((x) => x);

      setFromDistributor(filtered);
      if (filtered.length === 0) alert("No drugs received from distributor yet.");
    } catch (err) {
      console.error("Distributor Fetch Error:", err);
      setError(err.message);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f0f4f8",
        minHeight: "90vh",
      }}
    >
      <div
        style={{
          width: "650px",
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ color: "#1e88e5", marginBottom: "20px" }}>Pharmacy Dashboard</h2>
        <p>
          <strong>Connected Account:</strong> {account}
        </p>

        {error && (
          <div style={{ color: "red", marginBottom: "15px" }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* 🔹 Sell Section */}
        <h3>Sell Drug to Customer</h3>
        <input
          style={inputStyle}
          placeholder="Batch Number"
          value={batchNumber}
          onChange={(e) => setBatchNumber(e.target.value)}
        />
        <input
          style={inputStyle}
          placeholder="Customer Address"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
        />
        <button style={buttonStyle} onClick={sellToCustomer}>
          Sell
        </button>

        {/* 🔹 Owned Drugs Section */}
        <h3 style={{ marginTop: "30px" }}>Drugs Owned</h3>
        {ownedDrugs.length === 0 ? (
          <p>No drugs currently owned.</p>
        ) : (
          <ul>
            {ownedDrugs.map((drug, idx) => (
              <li key={idx}>
                {drug.drugName} ({drug.batchNumber}) - Price: {drug.price} Wei
              </li>
            ))}
          </ul>
        )}

        {/* 🔹 Distributor → Pharmacy Section */}
        <div style={{ marginTop: "30px" }}>
          <h3>Drugs Received from Distributor</h3>
          <button style={buttonStyle} onClick={loadFromDistributor}>
            Load From Distributor
          </button>
          {fromDistributor.length > 0 && (
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
              <thead>
                <tr style={{ backgroundColor: "#e3f2fd" }}>
                  <th style={thStyle}>Batch #</th>
                  <th style={thStyle}>From</th>
                  <th style={thStyle}>To</th>
                  <th style={thStyle}>Role</th>
                </tr>
              </thead>
              <tbody>
                {fromDistributor.map((tx, idx) => (
                  <tr key={idx}>
                    <td style={tdStyle}>{tx.batchNumber}</td>
                    <td style={tdStyle}>{tx.from}</td>
                    <td style={tdStyle}>{tx.to}</td>
                    <td style={tdStyle}>{tx.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* 🔹 All Transactions Section */}
        <div style={{ marginTop: "30px" }}>
          <h3>All Drug Transfer Events</h3>
          <button style={buttonStyle} onClick={loadTransactions}>
            Load All Transactions
          </button>
          {transactions.length > 0 && (
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
              <thead>
                <tr style={{ backgroundColor: "#e3f2fd" }}>
                  <th style={thStyle}>Event</th>
                  <th style={thStyle}>Batch #</th>
                  <th style={thStyle}>From</th>
                  <th style={thStyle}>To</th>
                  <th style={thStyle}>Role</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, idx) => (
                  <tr key={idx}>
                    <td style={tdStyle}>{tx.event}</td>
                    <td style={tdStyle}>{tx.batchNumber}</td>
                    <td style={tdStyle}>{tx.from}</td>
                    <td style={tdStyle}>{tx.to}</td>
                    <td style={tdStyle}>{tx.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "14px",
  outline: "none",
};

const buttonStyle = {
  backgroundColor: "#1e88e5",
  color: "#fff",
  border: "none",
  padding: "12px 25px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "16px",
  width: "100%",
  transition: "background 0.3s",
  marginTop: "10px",
};

const thStyle = {
  borderBottom: "1px solid #ccc",
  padding: "8px",
  textAlign: "left",
};

const tdStyle = {
  borderBottom: "1px solid #eee",
  padding: "8px",
  fontSize: "14px",
};
