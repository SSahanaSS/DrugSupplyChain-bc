import React, { useState, useEffect } from "react";
import { BrowserProvider, Contract } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../contract/drugsupplychainrbac";

export default function CustomerDashboard({ account }) {
  const [contract, setContract] = useState(null);
  const [purchasedDrugs, setPurchasedDrugs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        if (!window.ethereum) throw new Error("Metamask not installed");

        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contractInstance = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        setContract(contractInstance);

        await loadPurchasedDrugs(contractInstance);
      } catch (err) {
        console.error("Initialization Error:", err);
        setError(err.message);
      }
    };
    init();
  }, []);

  const loadPurchasedDrugs = async (contractInstance) => {
    try {
      const allBatches = ["batch1", "batch2", "batch3"]; // Replace with your batch tracking or fetch logic
      const drugs = [];
      for (let batch of allBatches) {
        try {
          const data = await contractInstance.getDrug(batch);
          if (data.currentOwner.toLowerCase() === account.toLowerCase()) {
            drugs.push({ batchNumber: batch, ...data });
          }
        } catch {}
      }
      setPurchasedDrugs(drugs);
    } catch (err) {
      console.error("Load Purchased Drugs Error:", err);
      setError(err.message || "Failed to load purchased drugs");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px", fontFamily: "Arial, sans-serif", backgroundColor: "#f0f4f8", minHeight: "90vh" }}>
      <div style={{ width: "500px", backgroundColor: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
        <h2 style={{ color: "#1e88e5", marginBottom: "20px" }}>Customer Dashboard</h2>
        <p><strong>Connected Account:</strong> {account}</p>

        {error && <div style={{ color: "red", marginBottom: "15px" }}><strong>Error:</strong> {error}</div>}

        <div style={{ marginTop: "20px" }}>
          <h3>Purchased Drugs</h3>
          {purchasedDrugs.length === 0 ? <p>No drugs purchased yet.</p> : (
            <ul>
              {purchasedDrugs.map((drug, idx) => (
                <li key={idx} style={{ marginBottom: "10px" }}>
                  <strong>{drug.drugName}</strong> ({drug.batchNumber})<br/>
                  Price: {drug.price.toString()} Wei<br/>
                  Expiry: {drug.expiryDate}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
