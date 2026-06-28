

const SidebarButton = ({ label, setMode, isActive, disabled }) => {
    return (
        <li className="sidebar-item">
            <button
                className={`sidebar-button ${isActive ? 'bold' : ''}`}
                disabled={disabled}
                onClick={() => !disabled && setMode(label)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: disabled ? "gray" : "inherit" }}
            >
                {label}
            </button>
        </li>
    );
}


export default SidebarButton;