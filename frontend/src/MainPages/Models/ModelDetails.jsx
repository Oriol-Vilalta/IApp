import "./ModelDetails.css";
import Chip from '@mui/material/Chip';

const ModelDetails = ({ activeModel }) => {
    if (!activeModel) return null;

    const { id, name, last_accessed, state, learner, loader } = activeModel;

    return (
        <div className="model-details">
            <div className="model-details-row">
                <div className="model-details-title-container">
                    <div className="model-details-title">
                        {name}
                        <Chip
                            label={state}
                            size="small"
                            className="custom-chip"
                            style={{
                                marginLeft: 12,
                                backgroundColor: "#1976d2", // MUI blue
                                color: "#fff"
                            }}
                        />
                    </div>
                    <div className="model-details-description">
                        {activeModel.description || "No description"}
                    </div>
                </div>
                <div className="model-details-columns model-details-right-half">
                    <div>
                        <div className="column-title">Learner</div>
                        <div><strong>Architecure:</strong> {learner?.arch}</div>
                        <div><strong>Type:</strong> {learner?.type}</div>
                        <div><strong>Epoch:</strong> {learner?.epoch}</div>
                        <div><strong>Learning Rate:</strong> {learner?.lr}</div>
                    </div>
                    <div>
                        <div className="column-title">Loader</div>
                        <div><strong>Batch Size:</strong> {loader?.bs}</div>
                        <div><strong>Seed:</strong> {loader?.seed}</div>
                        <div><strong>Validation Perc.:</strong> {loader?.valid_pct}</div>
                    </div>
                    <div>
                        <div className="column-title">Item Transformation</div>
                        <div><strong>Type:</strong> {loader?.item_tfms?.type}</div>
                        <div><strong>Size:</strong> {loader?.item_tfms?.size}</div>
                        <div><strong>Resize Method:</strong> {loader?.item_tfms?.resize_method}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModelDetails;