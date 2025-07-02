import { MenuItem, Select, FormControl, Tooltip, Box } from "@mui/material";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React from "react";

const fieldHelp = {
    bs: "Batch size determines how many samples are processed before the model is updated.",
    seed: "Seed ensures reproducibility by initializing the random number generator.",
    valid_pct: "Percentage of the data to use for validation (not used for training).",
    size: "The size (in pixels) to which each image will be resized.",
    resize_method: "The method used to resize images: Crop, Pad, or Squish."
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

const DatasetConfiguration = ({ config, setConfig, save }) => {
    const handleChange = (field) => (event) => {
        let value = event.target.value;
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
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 420, p: 2, background: "#f9f9fb", borderRadius: 2, boxShadow: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Data Configuration
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{ fontWeight: 500, minWidth: 140 }}>
                    Batch Size
                </Typography>
                <TextField
                    label=""
                    type="number"
                    value={config.bs}
                    id="bs"
                    onChange={(e) => { handleChange("bs")(e); save(); }}
                    fullWidth
                    sx={{ flex: 1 }}
                />
                <HelpMark title={fieldHelp.bs} />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{ fontWeight: 500, minWidth: 140 }}>
                    Seed
                </Typography>
                <TextField
                    label=""
                    type="number"
                    value={config.seed}
                    id="seed"
                    onChange={(e) => { handleChange("seed")(e); save(); }}
                    fullWidth
                    sx={{ flex: 1 }}
                />
                <HelpMark title={fieldHelp.seed} />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{ fontWeight: 500, minWidth: 140 }}>
                    Validation %
                </Typography>
                <TextField
                    label=""
                    type="number"
                    value={config.valid_pct * 100}
                    id="validPct"
                    InputProps={{ endAdornment: <span>%</span> }}
                    onChange={(e) => { handleChange("valid_pct")(e); save(); }}
                    fullWidth
                    sx={{ flex: 1 }}
                />
                <HelpMark title={fieldHelp.valid_pct} />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{ fontWeight: 500, minWidth: 140 }}>
                    Trans. Size
                </Typography>
                <TextField
                    label=""
                    type="number"
                    value={config.item_tfms.size}
                    id="transformationSize"
                    onChange={(e) => { handleItemTfmsChange("size")(e); save(); }}
                    fullWidth
                    sx={{ flex: 1 }}
                />
                <HelpMark title={fieldHelp.size} />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{ fontWeight: 500, minWidth: 140 }}>
                    Resizing Method
                </Typography>
                <FormControl sx={{ flex: 1 }}>
                    <Select
                        labelId="resize-method-label"
                        value={config.item_tfms.resize_method}
                        onChange={(e) => { handleItemTfmsChange("resize_method")(e); save(); }}
                        displayEmpty
                        id="transformationResizingTypeSelect"
                        sx={{ flex: 1, background: "inherit" }}
                        renderValue={(selected) => {
                            if (!selected) return <span style={{ color: "#aaa" }}>Select method</span>;
                            if (selected === "crop") return "Crop";
                            if (selected === "pad") return "Pad";
                            if (selected === "squish") return "Squish";
                            return selected;
                        }}
                    >
                        <MenuItem value={'crop'}>Crop</MenuItem>
                        <MenuItem value={'pad'}>Pad</MenuItem>
                        <MenuItem value={'squish'}>Squish</MenuItem>
                    </Select>
                </FormControl>
                <HelpMark title={fieldHelp.resize_method} />
            </Box>
        </Box>
    );
};

export default DatasetConfiguration;
