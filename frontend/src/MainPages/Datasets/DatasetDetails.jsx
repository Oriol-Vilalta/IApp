import React from "react";
import "../Models/ModelDetails.css";


const DatasetDetails = ({ activeDataset }) => {
    if (!activeDataset) return null;

    const { id, name, path, has_test, train_vocab, test_vocab } = activeDataset;

    const trainVocabCount = train_vocab && Array.isArray(train_vocab) ? train_vocab.length : 0;

    return (
        <div className="model-details" style={{ color: "white" }}>
            <h2>{name}</h2>
            <div>
                {train_vocab && Array.isArray(train_vocab) ? train_vocab.join(", ") : ""}
            </div>
            {trainVocabCount > 0 && (
                <div>
                    {trainVocabCount} different classes
                </div>
            )}
        </div>
    );
};

export default DatasetDetails;