import React from 'react';
import VocabElement from './VocabElement';


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
                    <VocabElement label={vocab} />
                </div>
            ))}
        </div>
    );
};

export default TrainVocabList;