import React from 'react';



const TrainVocabList = ({ dataset }) => {
    
    if(dataset.train_vocab.length === 0) {
        return (
            <div>
                <h2>Train Vocabulary</h2>
                <p>No training vocabulary available.</p>
            </div>
        );
    }
    
    return (
        <div>
            <h2>Train Vocabulary</h2>
            {dataset.train_vocab.map((vocab, index) => (
                <div key={index} className="vocab-item">
                    <h3>{vocab.name}</h3>
                    
                </div>
            ))}
        </div>
    );
};

export default TrainVocabList;