import React, { useState, useEffect } from "react";
import { BrowserProvider, Contract } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../contract/drugsupplychainrbac";

export default function DistributorDashboard({ account }) {
  const [contract, setContract] = useState(null);
  const [batchNumber, setBatchNumber] = useState("");
  const [pharmacy, setPharmacy] = useState("");
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        if (!window.ethereum) throw new Error("Metamask not installed");
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contractInstance = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        setContract(contractInstance);
      } catch (err) {
        console.error("Initialization Error:", err);
        setError(err.message);
      }
    };
    init();
  }, []);

  const transferToPharmacy = async () => {
    if (!contract) return;
    try {
      const tx = await contract.transferToPharmacy(batchNumber, pharmacy);
      await tx.wait();
      alert("Drug transferred to pharmacy successfully!");
    } catch (err) {
      console.error("Transfer Error:", err);
      setError(err.message || "Error transferring drug");
      alert(`Transfer failed: ${err.message}`);
    }
  };

  // 🔹 Fetch transaction history + drug details
  const getTransactions = async () => {
    if (!contract) return;
    try {
      const filter = contract.filters.DrugTransferred(null, null, account, null);
      const logs = await contract.queryFilter(filter, 0, "latest");

      const parsed = await Promise.all(
        logs.map(async (log) => {
          const batchNum = log.args[0];
          let details = {};
          try {
            const d = await contract.getDrug(batchNum);
            details = {
              drugName: d.drugName,
              manufacturer: d.manufacturer,
              composition: d.composition,
              productionDate: d.productionDate,
              expiryDate: d.expiryDate,
              price: d.price?.toString?.() || d.price,
              qrCode: d.qrCode,
              currentOwner: d.currentOwner,
            };
          } catch (err) {
            console.warn(`No details found for batch ${batchNum}`, err);
          }

          return {
            batchNumber: batchNum,
            from: log.args[1],
            to: log.args[2],
            role: log.args[3],
            txHash: log.transactionHash,
            ...details,
          };
        })
      );

      setTransactions(parsed);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError(err.message);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f0f4f8",
        minHeight: "90vh",
      }}
    >
      <div
        style={{
          width: "90%",
          maxWidth: "900px",
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ color: "#1e88e5", marginBottom: "20px" }}>Distributor Dashboard</h2>
        <p>
          <strong>Connected Account:</strong> {account}
        </p>

        {error && (
          <div style={{ color: "red", marginBottom: "15px" }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* 🔹 Transfer Section */}
        <h3>Transfer to Pharmacy</h3>
        <input
          style={inputStyle}
          placeholder="Batch Number"
          value={batchNumber}
          onChange={(e) => setBatchNumber(e.target.value)}
        />
        <input
          style={inputStyle}
          placeholder="Pharmacy Address"
          value={pharmacy}
          onChange={(e) => setPharmacy(e.target.value)}
        />
        <button style={buttonStyle} onClick={transferToPharmacy}>
          Transfer
        </button>

        {/* 🔹 Drug History Section */}
        <h3 style={{ marginTop: "30px" }}>View My Received Drugs</h3>
        <button style={buttonStyleAlt} onClick={getTransactions}>
          Get My Transactions
        </button>

        {transactions.length > 0 && (
          <div style={{ marginTop: "25px", maxHeight: "500px", overflowY: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#e3f2fd" }}>
                  <th style={thStyle}>Batch #</th>
                  <th style={thStyle}>Drug Name</th>
                  <th style={thStyle}>Manufacturer</th>
                  <th style={thStyle}>Prod. Date</th>
                  <th style={thStyle}>Expiry</th>
                  <th style={thStyle}>Price</th>
                  <th style={thStyle}>QR</th>
                  <th style={thStyle}>From</th>
                  <th style={thStyle}>Tx</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t, idx) => (
                  <tr key={idx}>
                    <td style={tdStyle}>{t.batchNumber}</td>
                    <td style={tdStyle}>{t.drugName || "—"}</td>
                    <td style={tdStyle}>{t.manufacturer || "—"}</td>
                    <td style={tdStyle}>{t.productionDate || "—"}</td>
                    <td style={tdStyle}>{t.expiryDate || "—"}</td>
                    <td style={tdStyle}>{t.price || "—"}</td>
                    <td style={tdStyle}>
                      {t.qrCode ? (
                        <a
                          href={t.qrCode}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#1e88e5", textDecoration: "none" }}
                        >
                          View
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td style={tdStyle}>{t.from}</td>
                    <td style={{ ...tdStyle, color: "#1e88e5" }}>
                      <a
                        href={`https://sepolia.etherscan.io/tx/${t.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#1e88e5", textDecoration: "none" }}
                      >
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
};

const buttonStyleAlt = {
  ...buttonStyle,
  backgroundColor: "#43a047",
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
