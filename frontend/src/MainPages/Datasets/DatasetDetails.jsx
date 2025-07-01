import "../Models/ModelDetails.css";


const DatasetDetails = ({ activeDataset }) => {
    if (!activeDataset) return null;

    const { name, train_vocab } = activeDataset;

    const trainVocabCount = train_vocab && Array.isArray(train_vocab) ? train_vocab.length : 0;

    return (
        <div className="model-details" style={{ color: "white", display: "flex", alignItems: "flex-start" }}>
            {train_vocab && Array.isArray(train_vocab) && train_vocab.length > 0 && activeDataset.id && (
                <img
                    src={`http://127.0.0.1:5000/datasets/${activeDataset.id}/image/train/${train_vocab[0]}`}
                    alt={train_vocab[0]}
                    style={{ width: 120, height: 120, objectFit: "cover", marginRight: 24, borderRadius: 8 }}
                />
            )}
            <div>
                <h2>{name}</h2>
                {trainVocabCount > 0 && (
                    <div>
                        {trainVocabCount} different classes
                    </div>
                )}
                <div>
                    {train_vocab && Array.isArray(train_vocab) ? train_vocab.join(", ") : ""}
                </div>
            </div>
        </div>
    );
};

export default DatasetDetails;