import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import TextField from "@mui/material/TextField";
import React from "react";

const DatasetConfiguration = ({ config, setConfig }) => {
    const handleChange = (field) => (event) => {
        let value = event.target.value;
        // Convert to number for numeric fields
        if (field === "bs" || field === "seed") {
            value = value === "" ? "" : Number(value);
        }
        if (field === "valid_pct") {
            value = value === "" ? "" : Number(value) / 100;
        }
        setConfig(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleItemTfmsChange = (subfield) => (event) => {
        let value = event.target.value;
        // Convert to number for size field
        if (subfield === "size") {
            value = value === "" ? "" : Number(value);
        }
        setConfig(prev => ({
            ...prev,
            item_tfms: {
                ...prev.item_tfms,
                [subfield]: value
            }
        }));
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 400 }}>
            <h3>Data Configuration</h3>
            <TextField
                label="Batch Size"
                type="number"
                value={config.bs}
                id="bs"
                onChange={handleChange("bs")}
            />
            <TextField
                label="Seed"
                type="number"
                value={config.seed}
                id="seed"
                onChange={handleChange("seed")}
            />
            <TextField
                label="Validation Percentage"
                type="number"
                value={config.valid_pct * 100}
                id="validPct"
                InputProps={{ endAdornment: <span>%</span> }}
                onChange={handleChange("valid_pct")}
            />
            <TextField
                label="Transformation Size"
                type="number"
                value={config.item_tfms.size}
                id="transformationSize"
                onChange={handleItemTfmsChange("size")}
            />
            <FormControl>
                <InputLabel id="resize-method-label">Resizing Method</InputLabel>
                <Select
                    labelId="resize-method-label"
                    label="Resizing Method"
                    value={config.item_tfms.resize_method}
                    onChange={handleItemTfmsChange("resize_method")}
                    displayEmpty
                    id="transformationResizingTypeSelect"
                    sx={{ minWidth: 120 }}
                >
                    <MenuItem value={'crop'}>Crop</MenuItem>
                    <MenuItem value={'pad'}>Pad</MenuItem>
                    <MenuItem value={'squish'}>Squish</MenuItem>
                </Select>
            </FormControl>
        </div>
    );
};

export default DatasetConfiguration;
