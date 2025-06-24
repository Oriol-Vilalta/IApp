

const SidebarButton = ({ label, setMode, isActive }) => {
    return (
        <li className="sidebar-item">
            <button
                className={`sidebar-button ${isActive ? 'active' : ''}`}
                onClick={() => setMode(label)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "inherit" }}
            >
                {label}
            </button>
        </li>
    );
}


export default SidebarButton;