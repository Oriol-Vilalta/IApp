import SidebarButton from "./SidebarButton";

const Sidebar = ({ setMode, state }) => {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h2>Sidebar</h2>
            </div>
            <ul className="sidebar-menu">
                <SidebarButton
                    label="Overview"
                    setMode={setMode}
                    isActive={false}
                />
                <SidebarButton
                    label="Dataset"
                    setMode={setMode}
                    isActive={false}
                />
                <SidebarButton
                    label="Train"
                    setMode={setMode}
                    isActive={false}
                />
                {state === "TRAINED" && (
                    <>
                        <SidebarButton
                            label="Test"
                            setMode={setMode}
                            isActive={false} 
                        />
                        <SidebarButton
                            label="Predict"
                            setMode={setMode}
                            isActive={false}
                        />
                    </>
                )}
            </ul>
        </aside>
    );
}

export default Sidebar;