import React, { useState, useEffect } from "react";
import { BrowserProvider, Contract } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../contract/drugsupplychainrbac";

export default function CustomerDashboard({ account }) {
  const [contract, setContract] = useState(null);
  const [purchasedDrugs, setPurchasedDrugs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const loadPurchasedDrugs = async () => {
    if (!contract) {
      setError("Contract not initialized");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const drugs = [];
      const processedBatches = new Set();

      // Get all DrugTransferred events where customer is the receiver (third parameter)
      const transferFilter = contract.filters.DrugTransferred(null, null, account);
      const transferEvents = await contract.queryFilter(transferFilter);
      
      console.log(`Found ${transferEvents.length} transfer events to ${account}`);

      for (let event of transferEvents) {
        const batchNumber = event.args[0]; // First argument is batch number
        const fromAddress = event.args[1]; // Second argument is from
        const toAddress = event.args[2]; // Third argument is to
        
        console.log(`Processing batch: ${batchNumber}, from: ${fromAddress}, to: ${toAddress}`);
        
        if (!processedBatches.has(batchNumber)) {
          processedBatches.add(batchNumber);
          
          try {
            const data = await contract.getDrug(batchNumber);
            
            drugs.push({
              batchNumber: batchNumber,
              drugName: data.drugName || "N/A",
              manufacturer: data.manufacturer || "",
              composition: data.composition || "",
              productionDate: data.productionDate || "",
              expiryDate: data.expiryDate || "N/A",
              price: data.price ? data.price.toString() : "0",
              qrCode: data.qrCode || "",
              transferredFrom: fromAddress,
              transferredTo: toAddress
            });
          } catch (err) {
            console.error(`Error loading batch ${batchNumber}:`, err);
          }
        }
      }
      
      setPurchasedDrugs(drugs);
      
      if (drugs.length === 0) {
        setError("No drugs transferred to this account");
      }
    } catch (err) {
      console.error("Load Purchased Drugs Error:", err);
      setError(err.message || "Failed to load drugs");
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    try {
      if (!timestamp || timestamp === "N/A") return timestamp;
      const date = new Date(parseInt(timestamp) * 1000);
      return date.toLocaleDateString();
    } catch {
      return timestamp;
    }
  };

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      padding: "40px", 
      fontFamily: "Arial, sans-serif", 
      backgroundColor: "#f0f4f8", 
      minHeight: "90vh" 
    }}>
      <div style={{ 
        width: "700px", 
        backgroundColor: "#fff", 
        padding: "30px", 
        borderRadius: "12px", 
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)" 
      }}>
        <h2 style={{ color: "#1e88e5", marginBottom: "20px" }}>Customer Dashboard</h2>
        <p style={{ marginBottom: "20px", wordBreak: "break-all" }}>
          <strong>Connected Account:</strong> {account}
        </p>

        <button
          onClick={loadPurchasedDrugs}
          disabled={loading || !contract}
          style={{
            backgroundColor: loading ? "#ccc" : "#1e88e5",
            color: "white",
            padding: "12px 24px",
            border: "none",
            borderRadius: "6px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            marginBottom: "20px",
            width: "100%"
          }}
        >
          {loading ? "Loading..." : "Load My Purchases"}
        </button>

        {error && (
          <div style={{ 
            color: "#d32f2f", 
            backgroundColor: "#ffebee", 
            padding: "10px", 
            borderRadius: "6px", 
            marginBottom: "15px" 
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        <div style={{ marginTop: "20px" }}>
          <h3 style={{ color: "#333", marginBottom: "15px" }}>
            Drugs Transferred to Me ({purchasedDrugs.length})
          </h3>
          {purchasedDrugs.length === 0 ? (
            <p style={{ color: "#666" }}>Click "Load My Purchases" to view drugs transferred to you.</p>
          ) : (
            <div>
              {purchasedDrugs.map((drug, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    backgroundColor: "#e8f5e9", 
                    padding: "15px", 
                    borderRadius: "8px", 
                    marginBottom: "15px",
                    border: "2px solid #4caf50"
                  }}
                >
                  <h4 style={{ color: "#1e88e5", marginTop: 0, marginBottom: "10px" }}>
                    {drug.drugName}
                  </h4>
                  <div style={{ fontSize: "14px", lineHeight: "1.8" }}>
                    <p><strong>Batch Number:</strong> {drug.batchNumber}</p>
                    <p><strong>Expiry Date:</strong> {formatTimestamp(drug.expiryDate)}</p>
                    <p><strong>Price:</strong> {drug.price} Wei</p>
                    
                    {drug.manufacturer && (
                      <p><strong>Manufacturer:</strong> {drug.manufacturer}</p>
                    )}
                    {drug.composition && (
                      <p><strong>Composition:</strong> {drug.composition}</p>
                    )}
                    {drug.productionDate && (
                      <p><strong>Production Date:</strong> {drug.productionDate}</p>
                    )}
                    {drug.qrCode && (
                      <p><strong>QR Code:</strong> {drug.qrCode}</p>
                    )}
                    
                    <div style={{ 
                      marginTop: "10px", 
                      padding: "10px", 
                      backgroundColor: "#f5f5f5", 
                      borderRadius: "4px" 
                    }}>
                      <p style={{ margin: "5px 0", fontSize: "12px" }}>
                        <strong>Transferred From:</strong><br/>
                        <span style={{ wordBreak: "break-all" }}>{drug.transferredFrom}</span>
                      </p>
                      <p style={{ margin: "5px 0", fontSize: "12px" }}>
                        <strong>Transferred To:</strong><br/>
                        <span style={{ wordBreak: "break-all", color: "#4caf50", fontWeight: "bold" }}>
                          {drug.transferredTo} (You)
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}