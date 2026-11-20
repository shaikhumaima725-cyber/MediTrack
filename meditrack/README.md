# 💊 MediTrack — Blockchain Medicine Batch Tracking & Healthcare Inventory

MediTrack is a full-stack Web3 healthcare provenance and inventory tracking platform built for the hackathon prototype. It empowers pharmaceutical manufacturers, logistics distributors, pharmacies, and patients to track every medicine batch with cryptographic immutability, tamper detection, and cold-chain compliance.

---

## 🌟 Key Features

1. **Unique Batch IDs**: Every pharmaceutical batch is assigned a unique, traceable Batch ID (e.g. `BATCH-MED-2026-001`).
2. **Blockchain Tracking Page**: Real-time batch search and interactive supply chain inspector.
3. **Supply-Chain Journey Visualizer**: Tracks custody transitions through all 3 vital stages:
   - 🏭 **Manufacturer** (GMP Release & Initial Seal)
   - 🚚 **Distributor** (Regional Logistics & Cold Chain)
   - 🏥 **Pharmacy** (Dispensary Stock & Patient Handover)
4. **Comprehensive Batch Details**: Medicine name, strength, batch ID, dosage form, manufacturing date, expiry date, current location, and storage temperature requirements.
5. **Event Timeline**: Chronological log of every physical and digital handover with cryptographic checkpoint hashes and wallet signatures.
6. **QR Code Verification**: High-resolution QR code generator for every batch. Scanning the QR code opens the exact batch tracking URL (`?batchId=...`).
7. **Multi-Point Integrity Verification Engine**:
   - Cryptographic Hash Chain verification (`previousHash` matching prior `eventHash`)
   - Custody Progression Sequencing (Manufacturer → Distributor → Pharmacy)
   - Timestamp Monotonicity check
   - Detects tampered batches (e.g. `BATCH-MED-2026-SUSPECT`)
8. **Strict Demo vs. Blockchain Distinction**:
   - **Never** misrepresents sample or local mock records as blockchain-verified.
   - Shows **"Demo Mode — Not Connected to Blockchain"** when no wallet is attached.
   - Shows **"BLOCKCHAIN-VERIFIED RECORD"** only when confirmed against the Ethereum smart contract on a testnet.
9. **Full Healthcare Suite Retained**:
   - 🏥 **Pharmacy Dashboard**: Inventory stock, aisles, batch tracking, quick intake.
   - 👤 **Patient Dashboard**: Active prescriptions, dosage reminders, 1-click authenticity verification.
   - ⚠️ **Stock Alerts**: Critical low-stock threshold detection and reorder pipelines.
   - ⏳ **Expiry Alerts**: Expiration sentinel and batch quarantine manager.
   - ⚙️ **Admin Dashboard**: Node topology, audit stream, and contract configuration.

---

## 📁 Files Created & Architecture

| File Path | Description |
|-----------|-------------|
| `contracts/MedicineTracker.sol` | Beginner-friendly Solidity smart contract for recording batches and supply-chain transfer checkpoints on testnets. |
| `hardhat.config.cjs` | Hardhat configuration targeting local node (31337) and Ethereum Sepolia Testnet (11155111). |
| `scripts/deploy.js` | Automated deployment script to compile and deploy `MedicineTracker.sol`. |
| `src/contracts/contractABI.json` | Interface ABI of `MedicineTracker` for Web3 frontend consumption. |
| `src/services/blockchain.js` | Web3 service using `ethers.js` to connect MetaMask, detect Sepolia testnet, and call smart contract methods. |
| `src/services/integrityCheck.js` | Supply-chain verification engine performing cryptographic hash chain checks, stage sequencing, and source validation. |
| `src/data/mockData.js` | Sample batches with rich events, stock inventory, and prescriptions (all strictly tagged `source: 'DEMO'`). |
| `src/components/Navbar.jsx` | Header with MediTrack branding, responsive tab navigation, and Web3 connection pill badge. |
| `src/components/BlockchainTracker.jsx` | Provenance search, QR modal trigger, 3-stage journey visualizer, integrity check audit, and event timeline. |
| `src/components/BatchQRCodeModal.jsx` | QR code generator with 1-click download PNG and deep link (`?batchId=...`). |
| `src/components/AddBatchModal.jsx` | Form to register a new unique batch ID either in Demo Mode or broadcast to Ethereum testnet. |
| `src/components/WalletConnectModal.jsx` | Modal to connect MetaMask, switch to Sepolia testnet, and configure contract addresses. |
| `src/components/PharmacyDashboard.jsx` | Dispensary inventory table with batch traceability links. |
| `src/components/PatientDashboard.jsx` | Patient prescription cards with direct "Verify Batch" buttons. |
| `src/components/StockAlerts.jsx` | Stock depletion console with automatic reorder triggers. |
| `src/components/ExpiryAlerts.jsx` | Expiry tracker with early quarantine warning controls. |
| `src/components/AdminDashboard.jsx` | System health, node counts, and hackathon compliance metrics. |
| `src/App.jsx` | Root application orchestrating tabs, URL parameters, batch state, and wallet interactions. |
| `package.json` & `vite.config.js` | React + Vite + Tailwind CSS build configuration. |
| `standalone-preview.html` | Self-contained single-file version that runs directly in any browser with **zero dependencies or npm install required**. |

---

## 🚀 Setup & Run Instructions

### Option 1: Instant Zero-Install Preview (Recommended for immediate testing)
You can test the entire interactive MediTrack system immediately in your browser:
1. Navigate to:
   ```
   C:\Users\IMADKHAN\.gemini\antigravity\scratch\meditrack\standalone-preview.html
   ```
2. Double-click `standalone-preview.html` (or right-click → **Open with** → **Google Chrome** / **Microsoft Edge**).
3. The entire application runs out-of-the-box with full UI, QR code generation, mock data, and tab switching.

---

### Option 2: Running the React + Vite Development Server

#### Step 1: Install Node.js (if not already installed)
If Node.js is not installed on your Windows machine, install it via Windows Terminal (PowerShell):
```powershell
winget install OpenJS.NodeJS.LTS
```
*(Alternatively, download and run the installer from https://nodejs.org)*

#### Step 2: Open Terminal in Project Directory
```powershell
cd C:\Users\IMADKHAN\.gemini\antigravity\scratch\meditrack
```

#### Step 3: Install Dependencies
```powershell
npm install
```

#### Step 4: Start Development Server
```powershell
npm run dev
```
Open your browser at **`http://localhost:5173`**.

---

## ⛓️ Deploying & Testing the Smart Contract (Test Network Only)

The smart contract `MedicineTracker.sol` is designed for testnets (Ethereum Sepolia or Local Hardhat).

### Method A: Deploy via Remix IDE (Easiest & Fastest)
1. Open [Remix IDE](https://remix.ethereum.org).
2. Create a new file `MedicineTracker.sol` and paste the contents of `contracts/MedicineTracker.sol`.
3. In the **Solidity Compiler** tab, select compiler `0.8.20` and click **Compile MedicineTracker.sol**.
4. In the **Deploy & Run Transactions** tab:
   - Select Environment: **Injected Provider - MetaMask** (Make sure MetaMask is set to **Sepolia Test Network**).
   - Click **Deploy**.
   - Confirm the transaction in MetaMask.
5. Copy your deployed contract address and paste it into MediTrack via **Admin Dashboard** &rarr; **Smart Contract Address** or in `src/services/blockchain.js`.

### Method B: Deploy via Hardhat
1. In the project directory, run:
   ```powershell
   npx hardhat run scripts/deploy.js --network sepolia
   ```
   *(Ensure `SEPOLIA_RPC_URL` and `PRIVATE_KEY` are configured in your environment or `hardhat.config.cjs`)*

---

## 🛡️ Hackathon Rule Compliance Checklist

| Rule | Implementation Detail |
|------|------------------------|
| **Unique Batch ID** | Every batch has a dedicated identifier e.g. `BATCH-MED-2026-001`, `BATCH-MED-2026-002`, `BATCH-MED-2026-SUSPECT`. |
| **Blockchain Tracking Page** | Interactive tracker accessible via the primary navigation tab. |
| **Search by Batch ID** | Search bar with instant suggestion chips and real-time filtering. |
| **Supply Chain 3-Stage Journey** | Visual timeline displaying **Manufacturer &rarr; Distributor &rarr; Pharmacy**. |
| **Batch Details** | Displays medicine name, strength, batch ID, mfg date, expiry date, storage conditions, and current location. |
| **Event Timeline** | Chronological checkpoints with actor, location, timestamp, and cryptographic event hashes. |
| **QR Code per Batch** | High-fidelity QR code with 1-click PNG download that deep-links directly to `?batchId=<ID>`. |
| **Integrity Status Check** | Multi-point automated audit checking hash chain consistency, timestamp ordering, and stage progression. |
| **Strict Demo vs. Blockchain Distinction** | Demo records display an amber warning badge ("Demo Mode — Not Connected to Blockchain") and are **never** presented as blockchain-verified. Blockchain verification only displays when confirmed on a testnet. |
| **Existing Dashboards Preserved** | Patient Dashboard, Pharmacy Dashboard, Stock Alerts, Expiry Alerts, and Admin Dashboard all fully functional and interconnected. |
