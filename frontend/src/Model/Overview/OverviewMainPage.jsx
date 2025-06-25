import "../MainPage.css";

const OverviewMainPage = ({ model }) => {
  if (!model) {
    return (
      <div className="main-page">
        <h1>Overview Main Page</h1>
        <p>No model loaded.</p>
      </div>
    );
  }

  return (
    <div className="main-page">
      <h1>Overview: {model.name}</h1>
      <div style={{ marginBottom: 24 }}>
        <strong>Model ID:</strong> {model.id}
        <br />
        <strong>State:</strong> {model.state}
        <br />
        <strong>Last Accessed:</strong> {model.last_accessed}
      </div>
      <h2>Loader Configuration</h2>
      <div style={{ marginBottom: 24 }}>
        <strong>Dataset ID:</strong> {model.loader.dataset_id}
        <br />
        <strong>Batch Size:</strong> {model.loader.bs}
        <br />
        <strong>Seed:</strong> {model.loader.seed}
        <br />
        <strong>Validation %:</strong> {model.loader.valid_pct * 100}%
        <br />
        <strong>Transformation Type:</strong> {model.loader.item_tfms.type}
        <br />
        <strong>Transformation Size:</strong> {model.loader.item_tfms.size}
        <br />
        <strong>Resizing Method:</strong> {model.loader.item_tfms.resize_method}
      </div>
      <h2>Learner Configuration</h2>
      <div>
        <strong>Type:</strong> {model.learner.type}
        <br />
        <strong>Epochs:</strong> {model.learner.epoch}
        <br />
        <strong>Learning Rate:</strong> {model.learner.lr}
        <br />
        <strong>Architecture:</strong> {model.learner.arch}
        <br />
        <strong>Training Time:</strong> {model.learner.training_time ?? "N/A"}
        <br />
        <strong>Test Accuracy:</strong> {model.learner.test_accuracy ?? "N/A"}
        <br />
        <strong>Test Loss:</strong> {model.learner.test_loss ?? "N/A"}
        <br />
        <strong>Learner Exists:</strong> {model.learner.learner_exists ? "Yes" : "No"}
      </div>
    </div>
  );
};

export default OverviewMainPage;