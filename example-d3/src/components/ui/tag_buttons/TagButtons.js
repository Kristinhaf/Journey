const CATEGORIES = [
    { key: "flight",     label: "Flights",        color: "#4e79a7" },
    { key: "stay",       label: "Accommodations",  color: "#f28e2b" },
    { key: "experience", label: "Experiences",     color: "#59a14f" },
];

export default function TagButtons({ activeCategories, onChange }) {
    const toggle = (key) => {
        if (activeCategories.includes(key)) {
            onChange(activeCategories.filter(c => c !== key));
        } else {
            onChange([...activeCategories, key]);
        }
    };

    return (
        <div style={{
            position: "absolute",
            top: 12,
            left: 12,
            display: "flex",
            gap: "8px",
            zIndex: 10,
        }}>
            {CATEGORIES.map(({ key, label, color }) => {
                const active = activeCategories.includes(key);
                return (
                    <button
                        key={key}
                        onClick={() => toggle(key)}
                        style={{
                            padding: "6px 16px",
                            borderRadius: "20px",
                            border: `2px solid ${color}`,
                            backgroundColor: active ? color : "rgba(255,255,255,0.85)",
                            color: active ? "white" : color,
                            cursor: "pointer",
                            fontWeight: 600,
                            fontSize: "12px",
                            transition: "all 0.15s ease",
                        }}
                    >
                        {label}
                    </button>
                );
            })}
        </div>
    );
}
