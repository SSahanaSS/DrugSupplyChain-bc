import React, { useState, useEffect } from "react";
import { BrowserProvider, Contract } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../contract/drugsupplychainrbac";

export default function ManufacturerDashboard({ account }) {
  const [contract, setContract] = useState(null);
  const [batchNumber, setBatchNumber] = useState("");
  const [drugName, setDrugName] = useState("");
  const [manufacturerName, setManufacturerName] = useState("");
  const [composition, setComposition] = useState("");
  const [productionDate, setProductionDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [price, setPrice] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [distributor, setDistributor] = useState("");
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) return alert("Install Metamask");
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      setContract(contractInstance);

      contractInstance.on("DrugCreated", (batchNumber, drugName, manufacturer, ...rest) => {
        setLogs(prev => [`Drug Created: ${drugName} (${batchNumber})`, ...prev]);
      });

      contractInstance.on("DrugTransferred", (batchNumber, from, to, role) => {
        setLogs(prev => [`Drug ${batchNumber} transferred from ${from} to ${to} (${role})`, ...prev]);
      });
    };
    init();

    return () => {
      if (contract) {
        contract.removeAllListeners("DrugCreated");
        contract.removeAllListeners("DrugTransferred");
      }
    };
  }, []);

  const addDrug = async () => {
    if (!contract) return;
    try {
      const tx = await contract.addDrug(
        batchNumber,
        drugName,
        manufacturerName,
        composition,
        productionDate,
        expiryDate,
        price,
        qrCode
      );
      await tx.wait();
      alert("Drug added successfully!");
    } catch (err) {
      console.error(err);
      alert("Error adding drug");
    }
  };

  const transferToDistributor = async () => {
    if (!contract) return;
    try {
      const tx = await contract.transferToDistributor(batchNumber, distributor);
      await tx.wait();
      alert("Drug transferred successfully!");
    } catch (err) {
      console.error(err);
      alert("Error transferring drug");
    }
  };

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px", fontFamily: "Arial, sans-serif", backgroundColor: "#f0f4f8", minHeight: "90vh" }}>
      
      {/* Left: Forms */}
      <div style={{ flex: 1, backgroundColor: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
        <h2 style={{ color: "#1e88e5", marginBottom: "20px" }}>Manufacturer Dashboard</h2>
        <p><strong>Connected Account:</strong> {account}</p>

        <div style={{ marginTop: "20px" }}>
          <h3>Add Drug</h3>
          <input style={inputStyle} placeholder="Batch Number" value={batchNumber} onChange={e => setBatchNumber(e.target.value)} />
          <input style={inputStyle} placeholder="Drug Name" value={drugName} onChange={e => setDrugName(e.target.value)} />
          <input style={inputStyle} placeholder="Manufacturer Name" value={manufacturerName} onChange={e => setManufacturerName(e.target.value)} />
          <input style={inputStyle} placeholder="Composition" value={composition} onChange={e => setComposition(e.target.value)} />
          <input style={inputStyle} placeholder="Production Date (YYYYMMDD)" value={productionDate} onChange={e => setProductionDate(e.target.value)} />
          <input style={inputStyle} placeholder="Expiry Date (YYYYMMDD)" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} />
          <input style={inputStyle} placeholder="Price (in Wei)" value={price} onChange={e => setPrice(e.target.value)} />
          <input style={inputStyle} placeholder="QR Code" value={qrCode} onChange={e => setQrCode(e.target.value)} />
          <button style={buttonStyle} onClick={addDrug}>Add Drug</button>
        </div>

        <div style={{ marginTop: "30px" }}>
          <h3>Transfer to Distributor</h3>
          <input style={inputStyle} placeholder="Batch Number" value={batchNumber} onChange={e => setBatchNumber(e.target.value)} />
          <input style={inputStyle} placeholder="Distributor Address" value={distributor} onChange={e => setDistributor(e.target.value)} />
          <button style={buttonStyle} onClick={transferToDistributor}>Transfer</button>
        </div>
      </div>

      {/* Right: Logs */}
      <div style={{ flex: 1, backgroundColor: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", maxHeight: "80vh", overflowY: "auto" }}>
        <h3 style={{ color: "#1e88e5", marginBottom: "15px" }}>Transaction Logs</h3>
        {logs.length === 0 ? <p>No transactions yet.</p> : (
          <ul>
            {logs.map((log, idx) => <li key={idx}>{log}</li>)}
          </ul>
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
  marginTop: "10px",
};

