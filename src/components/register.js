import React, { useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../contract/drugsupplychainrbac";

const roleMap = {
  1: "Manufacturer",
  2: "Distributor",
  3: "Pharmacy",
  4: "Customer",
};

function RegisterPage() {
  const [account, setAccount] = useState(null);
  const [selectedRole, setSelectedRole] = useState("Manufacturer");
  const [contract, setContract] = useState(null);

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Install Metamask");

    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);

      const signer = await provider.getSigner();
      const contractInstance = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      setContract(contractInstance);
    } catch (err) {
      console.error(err);
      alert("Error connecting wallet");
    }
  };

  const registerRole = async () => {
    if (!contract || !account) return;

    try {
      const roleValue = Object.keys(roleMap).find(
        (key) => roleMap[key] === selectedRole
      );
      const tx = await contract.registerRole(roleValue);
      await tx.wait();
      alert("Role registered successfully!");
    } catch (err) {
      console.error(err);
      alert("Error registering role. Maybe already assigned?");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        backgroundColor: "#f0f4f8",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "40px 50px",
          borderRadius: "12px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
          textAlign: "center",
          width: "350px",
        }}
      >
        <h2 style={{ marginBottom: "30px", color: "#1e88e5" }}>Register</h2>
        {!account ? (
          <button
            onClick={connectWallet}
            style={{
              backgroundColor: "#1e88e5",
              color: "#fff",
              border: "none",
              padding: "12px 25px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "16px",
              transition: "background 0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#1565c0")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#1e88e5")}
          >
            Connect Wallet
          </button>
        ) : (
          <div style={{ marginTop: "20px", color: "#333" }}>
            <p>
              <strong>Connected Account:</strong>
              <br /> {account}
            </p>
            <div style={{ marginTop: "15px" }}>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                style={{
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "16px",
                  width: "100%",
                  marginBottom: "15px",
                  appearance: "none",
                  outline: "none",
                }}
              >
                <option>Manufacturer</option>
                <option>Distributor</option>
                <option>Pharmacy</option>
                <option>Customer</option>
              </select>
              <button
                onClick={registerRole}
                style={{
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
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = "#1565c0")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "#1e88e5")}
              >
                Register
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RegisterPage;
