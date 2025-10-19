import React, { useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../contract/drugsupplychainrbac";
import { useNavigate } from "react-router-dom";

const roleMap = {
  0: "None",
  1: "Manufacturer",
  2: "Distributor",
  3: "Pharmacy",
  4: "Customer",
};

function LoginPage() {
  const [account, setAccount] = useState(null);
  const [role, setRole] = useState(null);
  const [contract, setContract] = useState(null);
  const navigate = useNavigate();

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Install Metamask");

    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);

      const signer = await provider.getSigner();
      const contractInstance = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      setContract(contractInstance);

      const userRole = await contractInstance.roles(accounts[0]);
      const mappedRole = roleMap[userRole];
      setRole(mappedRole);

      if (mappedRole === "Manufacturer") navigate("/manudb");
      else if (mappedRole === "Distributor") navigate("/distridb");
      else if (mappedRole === "Pharmacy") navigate("/pharmadb");
      else if (mappedRole === "Customer") navigate("/custodb");
      else alert("No role assigned. Please register first.");
    } catch (err) {
      console.error(err);
      alert("Error connecting wallet");
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
        <h2 style={{ marginBottom: "30px", color: "#1e88e5" }}>Login</h2>
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
            <p>
              <strong>Your Role:</strong> {role || "None"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
