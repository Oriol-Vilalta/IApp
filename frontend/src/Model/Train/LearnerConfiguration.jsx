import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import TextField from "@mui/material/TextField";
import React from "react";

const LearnerConfiguration = ({ config, setConfig }) => {
    const handleChange = (field) => (event) => {
        let value = event.target.value;
        // Convert to number for numeric fields
        if (field === "epoch" || field === "lr") {
            value = value === "" ? "" : Number(value);
        }
        setConfig(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 400 }}>
            <h3>Learner Configuration</h3>
            <FormControl>
                <InputLabel id="arch-label">Architecture</InputLabel>
                <Select
                    labelId="arch-label"
                    label="Architecture"
                    value={config.arch}
                    onChange={handleChange("arch")}
                    displayEmpty
                    id="arch-select"
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
            <TextField
                label="Epochs"
                type="number"
                value={config.epoch}
                id="epoch"
                onChange={handleChange("epoch")}
            />
            <TextField
                label="Learning Rate"
                type="number"
                value={config.lr}
                id="lr"
                onChange={handleChange("lr")}
            />
        </div>
    );
}

export default LearnerConfiguration;
