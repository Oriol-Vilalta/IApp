import { MenuItem, Select, FormControl, InputLabel, Tooltip, Box } from "@mui/material";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React from "react";

const fieldHelp = {
    arch: "Select the neural network architecture to use for training.",
    epoch: "Number of times the model will see the entire dataset during training.",
    lr: "Learning rate controls how much to change the model in response to the estimated error each time the model weights are updated."
};

const HelpMark = ({ title }) => (
    <Tooltip title={title} arrow>
        <Typography
            sx={{
                ml: 1,
                color: "primary.main",
                fontWeight: 700,
                fontSize: 18,
                cursor: "help",
                userSelect: "none",
                lineHeight: 1,
            }}
            component="span"
        >
            ?
        </Typography>
    </Tooltip>
);

const LearnerConfiguration = ({ config, setConfig, save }) => {
    const handleChange = (field) => (event) => {
        let value = event.target.value;
        if (field === "epoch" || field === "lr") {
            value = value === "" ? "" : Number(value);
        }
        setConfig(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAndSave = (field) => (event) => {
        handleChange(field)(event);
        save();
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 420, p: 2, background: "#f9f9fb", borderRadius: 2, boxShadow: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Learner Configuration
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{ fontWeight: 500, minWidth: 120 }}>
                    Architecture
                </Typography>
                <FormControl sx={{ flex: 1 }}>
                    <Select
                        labelId="arch-label"
                        value={config.arch}
                        onChange={handleAndSave("arch")}
                        displayEmpty
                        id="arch-select"
                        sx={{
                            flex: 1,
                            background: "inherit"
                        }}
                    >
                        <MenuItem value={"resnet18"}>resnet18</MenuItem>
                        <MenuItem value={"resnet34"}>resnet34</MenuItem>
                        <MenuItem value={"resnet50"}>resnet50</MenuItem>
                        <MenuItem value={"resnet101"}>resnet101</MenuItem>
                        <MenuItem value={"resnet152"}>resnet152</MenuItem>
                        <MenuItem value={"alexnet"}>alexnet</MenuItem>
                        <MenuItem value={"googLeNet"}>googLeNet</MenuItem>
                        <MenuItem value={"efficientNet_b0"}>efficientNet_b0</MenuItem>
                        <MenuItem value={"efficientNet_b1"}>efficientNet_b1</MenuItem>
                        <MenuItem value={"efficientNet_b2"}>efficientNet_b2</MenuItem>
                        <MenuItem value={"efficientNet_b3"}>efficientNet_b3</MenuItem>
                        <MenuItem value={"efficientNet_b4"}>efficientNet_b4</MenuItem>
                        <MenuItem value={"efficientNet_b5"}>efficientNet_b5</MenuItem>
                        <MenuItem value={"efficientNet_b6"}>efficientNet_b6</MenuItem>
                        <MenuItem value={"efficientNet_b7"}>efficientNet_b7</MenuItem>
                        <MenuItem value={"densenet121"}>densenet121</MenuItem>
                        <MenuItem value={"densenet161"}>densenet161</MenuItem>
                        <MenuItem value={"densenet169"}>densenet169</MenuItem>
                        <MenuItem value={"densenet201"}>densenet201</MenuItem>
                        <MenuItem value={"vgg16"}>vgg16</MenuItem>
                        <MenuItem value={"vgg19"}>vgg19</MenuItem>
                        <MenuItem value={"vgg16_bn"}>vgg16_bn</MenuItem>
                        <MenuItem value={"vgg19_bn"}>vgg19_bn</MenuItem>
                    </Select>
                </FormControl>
                <HelpMark title={fieldHelp.arch} />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{ fontWeight: 500, minWidth: 120 }}>
                    Epochs
                </Typography>
                <TextField
                    label=""
                    type="number"
                    value={config.epoch}
                    id="epoch"
                    onChange={handleAndSave("epoch")}
                    fullWidth
                    sx={{ flex: 1 }}
                />
                <HelpMark title={fieldHelp.epoch} />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{ fontWeight: 500, minWidth: 120 }}>
                    Learning Rate
                </Typography>
                <TextField
                    label=""
                    type="number"
                    value={config.lr}
                    id="lr"
                    onChange={handleAndSave("lr")}
                    fullWidth
                    sx={{ flex: 1 }}
                />
                <HelpMark title={fieldHelp.lr} />
            </Box>
        </Box>
    );
};

export default LearnerConfiguration;
