// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MedicineTracker
 * @dev Simple, beginner-friendly smart contract for tracking medicine batches
 * across the pharmaceutical supply chain (Manufacturer -> Distributor -> Pharmacy).
 * 
 * Target Network: Ethereum Testnets (e.g., Sepolia, Holesky) or local Hardhat test network.
 */
contract MedicineTracker {

    // Possible stages of the supply chain
    enum SupplyChainStage {
        Manufacturer,
        Distributor,
        Pharmacy,
        DispensedToPatient
    }

    // Details of each recorded supply-chain event (checkpoint)
    struct SupplyChainEvent {
        uint256 timestamp;
        SupplyChainStage stage;
        string stageName;       // e.g. "Manufacturer", "Distributor", "Pharmacy"
        string location;        // e.g. "Novartis Plant #4, Basel"
        address recordedBy;     // Ethereum address that signed the transaction
        string actorName;       // e.g. "Novartis Pharma AG"
        string notes;           // e.g. "Batch created & sealed in cold storage"
        bytes32 previousHash;   // Hash of the prior event for tamper-evident chaining
        bytes32 eventHash;      // Cryptographic hash of this event
    }

    // Medicine batch information
    struct MedicineBatch {
        string batchId;         // Unique Batch ID, e.g. "BATCH-MED-2026-001"
        string medicineName;    // e.g. "Amoxicillin"
        string strength;        // e.g. "500mg"
        string mfgDate;         // Manufacturing Date e.g. "2026-01-10"
        string expDate;         // Expiry Date e.g. "2028-01-10"
        string currentLocation; // Current physical location
        SupplyChainStage currentStage;
        address currentHolder;  // Address of current custodian
        bool exists;
        uint256 eventCount;
    }

    // Storage mappings
    mapping(string => MedicineBatch) private batches;
    mapping(string => SupplyChainEvent[]) private batchEvents;
    string[] private allBatchIds;

    // Events emitted for off-chain indexing and frontend listeners
    event BatchCreated(
        string indexed batchId,
        string medicineName,
        string strength,
        address indexed manufacturer,
        uint256 timestamp
    );

    event BatchTransferred(
        string indexed batchId,
        SupplyChainStage stage,
        string stageName,
        string newLocation,
        address indexed transferredBy,
        uint256 timestamp
    );

    /**
     * @dev Helper to convert stage enum to readable string
     */
    function getStageString(SupplyChainStage _stage) internal pure returns (string memory) {
        if (_stage == SupplyChainStage.Manufacturer) return "Manufacturer";
        if (_stage == SupplyChainStage.Distributor) return "Distributor";
        if (_stage == SupplyChainStage.Pharmacy) return "Pharmacy";
        return "Dispensed";
    }

    /**
     * @notice Register a newly manufactured medicine batch on the blockchain
     * @param _batchId Unique identifier for the batch (e.g. BATCH-MED-2026-001)
     * @param _medicineName Commercial/generic name of the drug
     * @param _strength Dosage/strength (e.g. 500mg, 100 IU/ml)
     * @param _mfgDate Date of manufacture (YYYY-MM-DD)
     * @param _expDate Expiry date (YYYY-MM-DD)
     * @param _location Physical factory / facility location
     * @param _actorName Name of the manufacturing company
     * @param _notes Initial inspection and batch creation notes
     */
    function registerBatch(
        string memory _batchId,
        string memory _medicineName,
        string memory _strength,
        string memory _mfgDate,
        string memory _expDate,
        string memory _location,
        string memory _actorName,
        string memory _notes
    ) external {
        require(bytes(_batchId).length > 0, "Batch ID cannot be empty");
        require(!batches[_batchId].exists, "Batch ID already registered on blockchain");

        // Compute initial cryptographic hash for tamper resistance
        bytes32 initialHash = keccak256(
            abi.encodePacked(_batchId, _medicineName, _strength, _mfgDate, _expDate, block.timestamp, msg.sender)
        );

        // Store batch details
        batches[_batchId] = MedicineBatch({
            batchId: _batchId,
            medicineName: _medicineName,
            strength: _strength,
            mfgDate: _mfgDate,
            expDate: _expDate,
            currentLocation: _location,
            currentStage: SupplyChainStage.Manufacturer,
            currentHolder: msg.sender,
            exists: true,
            eventCount: 1
        });

        allBatchIds.push(_batchId);

        // Record initial creation event
        batchEvents[_batchId].push(SupplyChainEvent({
            timestamp: block.timestamp,
            stage: SupplyChainStage.Manufacturer,
            stageName: "Manufacturer",
            location: _location,
            recordedBy: msg.sender,
            actorName: _actorName,
            notes: _notes,
            previousHash: bytes32(0),
            eventHash: initialHash
        }));

        emit BatchCreated(_batchId, _medicineName, _strength, msg.sender, block.timestamp);
    }

    /**
     * @notice Record a custody transfer along the supply chain
     * @param _batchId Unique identifier for the batch
     * @param _newStage New supply chain stage (1=Distributor, 2=Pharmacy, 3=Dispensed)
     * @param _newLocation New storage or transit location
     * @param _actorName Name of the receiving organization/actor
     * @param _notes Inspection or handoff notes (e.g. cold chain verified)
     */
    function transferBatch(
        string memory _batchId,
        SupplyChainStage _newStage,
        string memory _newLocation,
        string memory _actorName,
        string memory _notes
    ) external {
        require(batches[_batchId].exists, "Batch not found on blockchain");
        require(uint8(_newStage) > uint8(batches[_batchId].currentStage), "Cannot revert to previous stage");

        MedicineBatch storage batch = batches[_batchId];
        batch.currentStage = _newStage;
        batch.currentLocation = _newLocation;
        batch.currentHolder = msg.sender;
        batch.eventCount += 1;

        // Hash chain: link to previous event hash
        bytes32 prevHash = batchEvents[_batchId][batchEvents[_batchId].length - 1].eventHash;
        bytes32 currentHash = keccak256(
            abi.encodePacked(_batchId, uint8(_newStage), _newLocation, block.timestamp, msg.sender, prevHash)
        );

        string memory stageString = getStageString(_newStage);

        batchEvents[_batchId].push(SupplyChainEvent({
            timestamp: block.timestamp,
            stage: _newStage,
            stageName: stageString,
            location: _newLocation,
            recordedBy: msg.sender,
            actorName: _actorName,
            notes: _notes,
            previousHash: prevHash,
            eventHash: currentHash
        }));

        emit BatchTransferred(_batchId, _newStage, stageString, _newLocation, msg.sender, block.timestamp);
    }

    /**
     * @notice Fetch batch overview details
     */
    function getBatch(string memory _batchId) external view returns (MedicineBatch memory) {
        require(batches[_batchId].exists, "Batch does not exist");
        return batches[_batchId];
    }

    /**
     * @notice Fetch the complete immutable timeline of events for a batch
     */
    function getBatchEvents(string memory _batchId) external view returns (SupplyChainEvent[] memory) {
        require(batches[_batchId].exists, "Batch does not exist");
        return batchEvents[_batchId];
    }

    /**
     * @notice Get all batch IDs recorded on this smart contract
     */
    function getAllBatchIds() external view returns (string[] memory) {
        return allBatchIds;
    }
}
