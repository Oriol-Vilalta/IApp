import SidebarButton from "./SidebarButton";

const Sidebar = ({ setMode, state, mode }) => {
    const buttons = [
        { label: "Overview" },
        { label: "Dataset" },
        { label: "Train" },
        { label: "Test" },
        { label: "Predict" }
    ];

    const disabledWhenNotTrained = (label) => {
        if (state === "TRAINED") return false;
        return label === "Test" || label === "Predict";
    }

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h2>Sidebar</h2>
            </div>
            <ul className="sidebar-menu">
                {buttons.map(({ label }) => (
                    <SidebarButton
                        key={label}
                        label={label}
                        setMode={setMode}
                        isActive={mode === label}
                        disabled={disabledWhenNotTrained(label)}
                    />
                ))}
            </ul>
        </aside>
    );
}

export default Sidebar;
