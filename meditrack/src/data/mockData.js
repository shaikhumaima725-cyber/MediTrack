/**
 * Mock data for MediTrack Prototype
 * 
 * IMPORTANT HACKATHON RULE ENFORCED:
 * All records here are strictly flagged with `source: 'DEMO'` and `isBlockchainVerified: false`.
 * Sample/locally stored records are NEVER presented as blockchain-verified.
 */

export const mockBatches = [
  {
    batchId: "BATCH-MED-2026-001",
    medicineName: "Amoxicillin Trihydrate",
    strength: "500mg",
    dosageForm: "Capsules (Strip of 10)",
    category: "Antibiotics",
    mfgDate: "2026-01-15",
    expDate: "2028-01-14",
    quantity: 12000,
    currentLocation: "MetroCare Pharmacy #12, Shelf B-4, Boston, MA",
    currentStage: "Pharmacy",
    manufacturer: {
      name: "Novartis Pharma Plant #3",
      location: "Cambridge, MA",
      license: "FDA-MFG-984421",
      wallet: "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7"
    },
    distributor: {
      name: "AmerisourceBergen Cold Logistics",
      location: "Harrisburg Distribution Hub, PA",
      license: "W-DIST-2024-88",
      wallet: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
    },
    pharmacy: {
      name: "MetroCare Central Pharmacy",
      location: "Boston, MA",
      license: "PH-MA-55421",
      wallet: "0x90F79bf6EB2c4f870365E785982E1f101E93b906"
    },
    source: "DEMO",
    isBlockchainVerified: false,
    verificationStatus: "PASS", // Passes demo integrity check
    integrityNote: "Internal SHA-256 hash sequence valid. Unaltered demo record.",
    temperatureControl: "Controlled Room Temperature (20°C - 25°C)",
    events: [
      {
        id: "EVT-001",
        stage: "Manufacturer",
        title: "Batch Manufactured & Quality Certified",
        actor: "Novartis Pharma Plant #3",
        location: "Cambridge, MA",
        timestamp: "2026-01-15T09:30:00Z",
        notes: "Chemical purity: 99.8%. Sterility and dissolution tests passed standard USP specs.",
        previousHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
        eventHash: "0x7a3f81e9b20c9f1d43a5716e25539d48b11c97a544139971bc18206d203f3922",
        signer: "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7"
      },
      {
        id: "EVT-002",
        stage: "Distributor",
        title: "Received at Central Logistics Hub",
        actor: "AmerisourceBergen Cold Logistics",
        location: "Harrisburg Distribution Hub, PA",
        timestamp: "2026-01-22T14:15:00Z",
        notes: "Inbound barcode scan completed. Temperature sensors logged continuous 21.2°C during transit.",
        previousHash: "0x7a3f81e9b20c9f1d43a5716e25539d48b11c97a544139971bc18206d203f3922",
        eventHash: "0x91b2c4d8e70a129384756281928374650192837465abcdfe1234567890abcdef",
        signer: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
      },
      {
        id: "EVT-003",
        stage: "Pharmacy",
        title: "Delivered & Stocked into Pharmacy Dispensary",
        actor: "MetroCare Central Pharmacy",
        location: "Boston, MA",
        timestamp: "2026-01-29T11:00:00Z",
        notes: "Final consignment verified by Chief Pharmacist. Tamper-evident seals intact.",
        previousHash: "0x91b2c4d8e70a129384756281928374650192837465abcdfe1234567890abcdef",
        eventHash: "0xd4e5f6a7b8c90123456789abcdef0123456789abcdef0123456789abcdef0123",
        signer: "0x90F79bf6EB2c4f870365E785982E1f101E93b906"
      }
    ]
  },
  {
    batchId: "BATCH-MED-2026-002",
    medicineName: "Paracetamol (Acetaminophen)",
    strength: "650mg",
    dosageForm: "Oral Tablets",
    category: "Analgesic & Antipyretic",
    mfgDate: "2026-02-01",
    expDate: "2028-02-01",
    quantity: 25000,
    currentLocation: "Transit Vehicle #TRK-882 (En route to Chicago Hub)",
    currentStage: "Distributor",
    manufacturer: {
      name: "GSK Healthcare Solutions",
      location: "Raleigh, NC",
      license: "FDA-MFG-332190",
      wallet: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65"
    },
    distributor: {
      name: "Cardinal Health Freight Lines",
      location: "Midwest Transit Sector",
      license: "W-DIST-2025-14",
      wallet: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4df"
    },
    pharmacy: null, // Still in transit
    source: "DEMO",
    isBlockchainVerified: false,
    verificationStatus: "PASS",
    integrityNote: "Active transit batch. Hash chain unbroken.",
    temperatureControl: "Ambient storage (15°C - 30°C)",
    events: [
      {
        id: "EVT-010",
        stage: "Manufacturer",
        title: "Bulk Synthesis & Blister Pack Packaging",
        actor: "GSK Healthcare Solutions",
        location: "Raleigh, NC",
        timestamp: "2026-02-01T08:00:00Z",
        notes: "GMP Batch release certified by QP Dr. Sarah Lin.",
        previousHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
        eventHash: "0x1111222233334444555566667777888899990000aaaabbbbccccddddeeeeffff",
        signer: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65"
      },
      {
        id: "EVT-011",
        stage: "Distributor",
        title: "Dispatched to Regional Cross-Dock",
        actor: "Cardinal Health Freight Lines",
        location: "Midwest Transit Sector",
        timestamp: "2026-02-05T16:40:00Z",
        notes: "Cargo transferred to GPS-monitored fleet. Waybill #CB-88219.",
        previousHash: "0x1111222233334444555566667777888899990000aaaabbbbccccddddeeeeffff",
        eventHash: "0x2222333344445555666677778888999900001111bbbbccccddddeeeeffffaaaa",
        signer: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4df"
      }
    ]
  },
  {
    batchId: "BATCH-MED-2026-003",
    medicineName: "Insulin Glargine (Recombinant)",
    strength: "100 units/mL (3mL Solostar Pen)",
    dosageForm: "Injectable Solution",
    category: "Antidiabetic / Biologics",
    mfgDate: "2026-01-20",
    expDate: "2027-01-19",
    quantity: 4000,
    currentLocation: "Cold Vault Freezer Unit A-1, Sanofi Industrial Complex, Frankfurt",
    currentStage: "Manufacturer",
    manufacturer: {
      name: "Sanofi Biologics Centre",
      location: "Frankfurt, Germany",
      license: "EMA-BIO-4410",
      wallet: "0x976EA74026E72CD5554302B0a0823302daC3d639"
    },
    distributor: null,
    pharmacy: null,
    source: "DEMO",
    isBlockchainVerified: false,
    verificationStatus: "PASS",
    integrityNote: "Fresh manufacturing release. Monitored 2°C - 8°C cold chain.",
    temperatureControl: "Cold Storage Required: 2°C to 8°C. Do not freeze.",
    events: [
      {
        id: "EVT-020",
        stage: "Manufacturer",
        title: "Bioreactor Harvest & Sterile Pen Filling",
        actor: "Sanofi Biologics Centre",
        location: "Frankfurt, Germany",
        timestamp: "2026-01-20T10:15:00Z",
        notes: "HPLC assay: 100.2 IU/mL. Endotoxin level < 0.05 EU/mL. Cold chain initialized.",
        previousHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
        eventHash: "0x3333444455556666777788889999000011112222ccccddddeeeeffffaaaabbbb",
        signer: "0x976EA74026E72CD5554302B0a0823302daC3d639"
      }
    ]
  },
  {
    batchId: "BATCH-MED-2026-004",
    medicineName: "Azithromycin",
    strength: "250mg",
    dosageForm: "Film-coated Tablets",
    category: "Antibiotics",
    mfgDate: "2024-03-01",
    expDate: "2026-11-25", // Near expiry demonstration!
    quantity: 45, // Low stock demonstration!
    currentLocation: "St. Jude Hospital Pharmacy, Emergency Cart, New York, NY",
    currentStage: "Pharmacy",
    manufacturer: {
      name: "Pfizer Pharmaceuticals",
      location: "Kalamazoo, MI",
      license: "FDA-MFG-10294",
      wallet: "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955"
    },
    distributor: {
      name: "McKesson Distribution Group",
      location: "Newburgh, NY",
      license: "W-DIST-2023-71",
      wallet: "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f"
    },
    pharmacy: {
      name: "St. Jude Hospital Pharmacy",
      location: "New York, NY",
      license: "PH-NY-90214",
      wallet: "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720"
    },
    source: "DEMO",
    isBlockchainVerified: false,
    verificationStatus: "PASS",
    integrityNote: "Event chain verified. Stock & Expiry threshold alert active.",
    temperatureControl: "Store between 15°C and 30°C",
    events: [
      {
        id: "EVT-030",
        stage: "Manufacturer",
        title: "Batch Created & Packed",
        actor: "Pfizer Pharmaceuticals",
        location: "Kalamazoo, MI",
        timestamp: "2024-03-01T11:00:00Z",
        notes: "Original lot #AZ-24-301.",
        previousHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
        eventHash: "0x4444555566667777888899990000111122223333ddddeeeeffffaaaabbbbcccc",
        signer: "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955"
      },
      {
        id: "EVT-031",
        stage: "Distributor",
        title: "Regional Transit & QA Check",
        actor: "McKesson Distribution Group",
        location: "Newburgh, NY",
        timestamp: "2024-03-10T15:20:00Z",
        notes: "Inspected and sorted for metropolitan hospital deliveries.",
        previousHash: "0x4444555566667777888899990000111122223333ddddeeeeffffaaaabbbbcccc",
        eventHash: "0x5555666677778888999900001111222233334444eeeeffffaaaabbbbccccdddd",
        signer: "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f"
      },
      {
        id: "EVT-032",
        stage: "Pharmacy",
        title: "Received at Hospital Pharmacy",
        actor: "St. Jude Hospital Pharmacy",
        location: "New York, NY",
        timestamp: "2024-03-15T09:10:00Z",
        notes: "Shelf allocation: Emergency Cart Row 3. Stock nearing expiration window.",
        previousHash: "0x5555666677778888999900001111222233334444eeeeffffaaaabbbbccccdddd",
        eventHash: "0x6666777788889999000011112222333344445555ffffaaaabbbbccccddddeeee",
        signer: "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720"
      }
    ]
  },
  {
    batchId: "BATCH-MED-2026-SUSPECT",
    medicineName: "Metformin Hydrochloride [FLAGGED]",
    strength: "500mg",
    dosageForm: "Extended Release Tablets",
    category: "Antidiabetic",
    mfgDate: "2026-01-05",
    expDate: "2028-01-05",
    quantity: 8000,
    currentLocation: "Quarantine Bay 0, Unverified Warehouse, NJ",
    currentStage: "Distributor",
    manufacturer: {
      name: "GenericRx Formulations",
      location: "Mumbai, India",
      license: "UNVERIFIED-LIC-99",
      wallet: "0xBcd4042DE499D14e55001CcbB24a551F3b954096"
    },
    distributor: {
      name: "GreyMarket Logistics Co.",
      location: "Newark, NJ",
      license: "EXPIRED-PERMIT",
      wallet: "0x71bE63f3384f5fb98995898A86B02Fb2426cC563"
    },
    pharmacy: null,
    source: "DEMO",
    isBlockchainVerified: false,
    verificationStatus: "FAILED", // Demonstrates simulated integrity tampering detection
    integrityNote: "CRITICAL: Hash mismatch detected at event #2! The cryptographic chain of custody was broken or modified out-of-band.",
    temperatureControl: "Standard",
    events: [
      {
        id: "EVT-090",
        stage: "Manufacturer",
        title: "Reported Batch Production",
        actor: "GenericRx Formulations",
        location: "Mumbai, India",
        timestamp: "2026-01-05T12:00:00Z",
        notes: "Unverified manufacturing release claim.",
        previousHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
        eventHash: "0x88889999aaaa0000111122223333444455556666bbbbccccddddeeeeffff1111",
        signer: "0xBcd4042DE499D14e55001CcbB24a551F3b954096"
      },
      {
        id: "EVT-091",
        stage: "Distributor",
        title: "Intercepted by Port Customs & Quarantined",
        actor: "GreyMarket Logistics Co.",
        location: "Newark, NJ",
        timestamp: "2026-01-18T10:00:00Z",
        notes: "Tamper alert: Waybill sequence does not match manufacturer root hash. Seal was broken.",
        previousHash: "0xBAD0000000000000000000000000000000000000000000000000000000000000", // Tampered hash!
        eventHash: "0x9999000011112222333344445555666677778888ccccddddeeeeffff11112222",
        signer: "0x71bE63f3384f5fb98995898A86B02Fb2426cC563"
      }
    ]
  }
];

// Prescriptions for Patient Dashboard
export const mockPrescriptions = [
  {
    id: "RX-88412",
    patientName: "Eleanor Vance",
    patientId: "PAT-1092",
    medicineName: "Amoxicillin Trihydrate",
    strength: "500mg",
    dosage: "1 capsule 3 times daily after meals",
    batchId: "BATCH-MED-2026-001",
    prescribedBy: "Dr. Robert Chen, MD",
    dispensedDate: "2026-01-30",
    daysRemaining: 7,
    status: "Active",
    canVerify: true
  },
  {
    id: "RX-88413",
    patientName: "Eleanor Vance",
    patientId: "PAT-1092",
    medicineName: "Paracetamol",
    strength: "650mg",
    dosage: "1 tablet every 6 hours as needed for fever",
    batchId: "BATCH-MED-2026-002",
    prescribedBy: "Dr. Robert Chen, MD",
    dispensedDate: "2026-02-06",
    daysRemaining: 14,
    status: "Active",
    canVerify: true
  },
  {
    id: "RX-88414",
    patientName: "Eleanor Vance",
    patientId: "PAT-1092",
    medicineName: "Azithromycin",
    strength: "250mg",
    dosage: "2 tablets day 1, then 1 daily for 4 days",
    batchId: "BATCH-MED-2026-004",
    prescribedBy: "Dr. Sarah Jenkins, MD",
    dispensedDate: "2026-10-15",
    daysRemaining: 0,
    status: "Completed",
    canVerify: true
  }
];

// Pharmacy Stock Inventory
export const mockPharmacyStock = [
  {
    id: "MED-1",
    name: "Amoxicillin Trihydrate",
    strength: "500mg",
    batchId: "BATCH-MED-2026-001",
    currentStock: 480,
    minThreshold: 100,
    unit: "Capsules",
    expDate: "2028-01-14",
    status: "Normal",
    shelf: "Aisle 3, Shelf B"
  },
  {
    id: "MED-2",
    name: "Paracetamol",
    strength: "650mg",
    batchId: "BATCH-MED-2026-002",
    currentStock: 1200,
    minThreshold: 250,
    unit: "Tablets",
    expDate: "2028-02-01",
    status: "In Transit",
    shelf: "Loading Dock"
  },
  {
    id: "MED-3",
    name: "Insulin Glargine",
    strength: "100 units/mL",
    batchId: "BATCH-MED-2026-003",
    currentStock: 85,
    minThreshold: 50,
    unit: "Vials",
    expDate: "2027-01-19",
    status: "Normal",
    shelf: "Cold Storage #1"
  },
  {
    id: "MED-4",
    name: "Azithromycin",
    strength: "250mg",
    batchId: "BATCH-MED-2026-004",
    currentStock: 18, // CRITICAL LOW STOCK
    minThreshold: 80,
    unit: "Strips",
    expDate: "2026-11-25", // NEAR EXPIRY
    status: "Critical Low Stock",
    shelf: "Aisle 1, Shelf D"
  },
  {
    id: "MED-5",
    name: "Ciprofloxacin",
    strength: "500mg",
    batchId: "BATCH-MED-2024-EXPIRED",
    currentStock: 60,
    minThreshold: 100,
    unit: "Tablets",
    expDate: "2026-10-01", // EXPIRED!
    status: "Expired — Quarantined",
    shelf: "Disposal Bin 9"
  }
];

// Admin Metrics
export const mockAdminStats = {
  totalBatchesTracked: 14820,
  verifiedIntegrityRate: "99.4%",
  activeRecalls: 0,
  connectedNodes: {
    manufacturers: 14,
    distributors: 38,
    pharmacies: 124,
    testnetNode: "Sepolia RPC Gateway (Infura/Alchemy)"
  },
  recentAlerts: [
    { id: 1, type: "integrity", message: "BATCH-MED-2026-SUSPECT failed hash chain validation", time: "2 hours ago" },
    { id: 2, type: "expiry", message: "Batch BATCH-MED-2026-004 reaches expiration within 7 days", time: "5 hours ago" },
    { id: 3, type: "stock", message: "Azithromycin 250mg dropped below reorder threshold (18 units)", time: "1 day ago" }
  ]
};
