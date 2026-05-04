import { useEffect, useState } from "react";
import { useResizeObserver } from "../../../hooks/useResizeObserver";
import data from "../../../data/data.json";
import BedOutlinedIcon from '@mui/icons-material/BedOutlined';

function NodeLink({ onAddToTimeline, onRemoveFromTimeline, timelineItemIds = new Set(), submittedData }) {
    const nodes = data.options;
    const [links, setLinks] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const { ref: containerRef, width, height } = useResizeObserver();
    const [hoveredInfo, setHoveredInfo] = useState(null);
    

    const categoryX = {
        flight: 200,
        accommodation: 500,
        experience: 800
    };

    // Pre-compute positions for every node so both circles and lines can use them
    const positions = {};
    nodes.forEach(d => {
        const categoryNodes = nodes.filter(o => o.category === d.category);
        const indexInCategory = categoryNodes.indexOf(d);
        positions[d.id] = {
            cx: categoryX[d.category] + (indexInCategory % 3) * 50,
            cy: 100 + Math.floor(indexInCategory / 3) * 60,
        };
    });

    useEffect(() => {
        const computed = [];
        const seen = new Set();

        if (submittedData) {
            const { fromDate, toDate } = submittedData;
            if (fromDate && toDate) {
                nodes.forEach(n1 => {
                    nodes.forEach(n2 => {
                        if (n1.category === n2.category) return;
                        if (n1.dateStart > toDate || n1.dateEnd < fromDate || n2.dateStart > toDate || n2.dateEnd < fromDate) return;

                        // Sort ids so "f1-a1" and "a1-f1" always produce the same key
                        const pairKey = [n1.id, n2.id].sort().join("-");
                        if (seen.has(pairKey)) return;
                        seen.add(pairKey);

                        const experience = n1.category === "experience" ? n1 : n2.category === "experience" ? n2 : null;
                        const other = experience === n1 ? n2 : n1;

                        if (experience) {
                            if (experience.dateStart > other.dateStart && experience.dateEnd < other.dateEnd) {
                                computed.push({ source: n1.id, target: n2.id });
                            }
                        } else {
                            if (n1.dateStart === n2.dateStart && n1.dateEnd === n2.dateEnd) {
                                computed.push({ source: n1.id, target: n2.id });
                            }
                        }
                    });
                });
            }
        }
            setLinks(computed);
        }, [nodes, submittedData]);



    const connectedIds = selectedId
        ? new Set([
            selectedId,
            ...links.filter(l => l.source === selectedId || l.target === selectedId)
                    .flatMap(l => [l.source, l.target])
          ])
        : null;

    const getPos = (id) => {
        if (id === selectedId) return { cx: (width || 500) / 2, cy: (height || 400) / 2 };
        return positions[id];
    };


    const selectedNode = selectedId ? nodes.find(d => d.id === selectedId) : null;
    const alreadyAdded = selectedId ? timelineItemIds.has(selectedId) : false;

    return (
        <div ref={containerRef} style={{ width: "100%", height: "100%", position: "relative" }}>
        {!submittedData && (
            <div style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "8px",
                color: "#888",
                textAlign: "center",
                padding: "24px",
            }}>
                <span style={{ fontSize: "32px" }}>✈️</span>
                <p style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "#555" }}>
                    Plan your trip
                </p>
                <p style={{ margin: 0, fontSize: "13px" }}>
                    Enter where you are travelling from and to,<br />
                    how many travellers, and which dates you want to explore,<br />
                    then press <strong>Submit</strong>.
                </p>
            </div>
        )}
        {submittedData && (<>
            {selectedNode && (
                <button
                    onClick={() => alreadyAdded ? onRemoveFromTimeline(selectedId) : onAddToTimeline(selectedNode)}
                    style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        zIndex: 10,
                        padding: "8px 18px",
                        borderRadius: "20px",
                        border: alreadyAdded ? "#6c0808": "2px solid #2e7d32",
                        backgroundColor: alreadyAdded ? "#e34242" : "#2e7d32",
                        color: "white",
                        cursor: alreadyAdded ? "default" : "pointer",
                        fontWeight: 600,
                        fontSize: "12px",
                    }}
                >
                    {alreadyAdded ? " - Remove from timeline" : `+ Add to timeline`}
                </button>


            )}
            <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
                {/* Lines rendered first so they sit behind the circles */}
                {links.map(l => {
                    const s = getPos(l.source);
                    const t = getPos(l.target);
                    return (
                        <line
                            key={`${l.source}-${l.target}`}
                            x1={s.cx} y1={s.cy}
                            x2={t.cx} y2={t.cy}
                            stroke= { selectedId === l.source || selectedId === l.target ? "#402d21" : "#aaa"}
                            strokeWidth={1}
                        />
                    );
                })}
                {nodes.map(d => {
                    const isSelected = d.id === selectedId;
                    const cx = isSelected ? (width || 500) / 2 : positions[d.id].cx;
                    const cy = isSelected ? (height || 500) / 2 : positions[d.id].cy;
                    const r = isSelected ? 40 : 20;
                    const iconSize = isSelected ? "25" : "14";
                    const opacity = connectedIds ? (connectedIds.has(d.id) ? 1 : 0.15) : 1;
                    return (
                        <g
                            key={d.id}
                            onClick={() => setSelectedId(d.id === selectedId ? null : d.id)}
                            style={{ cursor: "pointer", opacity, transition: "opacity 0.3s ease-in-out" }}
                            onMouseOver={() => setHoveredInfo({ node: d, x: cx, y: cy })}
                            onMouseLeave={() => setHoveredInfo(null)}
                        >
                            <circle
                                cx={cx}
                                cy={cy}
                                r={r}
                                style={{transition: "cx 0.4s ease-in-out, cy 0.4s ease-in-out, r 0.3s ease-in-out"}}
                                fill={d.category === "flight" ? "#045fc0" : d.category === "accommodation" ? "#c7079a" : "#f97d1f"}
                            />
                            <text x={cx} y={cy + 5} textAnchor="middle" fontSize={iconSize} style={{ transition: "font-size 0.4s ease-in-out" }}>
                                {d.category === "accommodation" ? "🏨" : d.category === "flight" ? "✈️" : "⭐"}
                            </text>
                        </g>
                    );
                })}

            </svg>
                {hoveredInfo && (
                    <div style={{
                        position: "fixed",
                        top: hoveredInfo.y + 5,
                        left: hoveredInfo.x + 5,
                        background: "white",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        padding: "8px 12px",
                        pointerEvents: "none",   // so it doesn't interfere with mouse events
                        zIndex: 20,
                        fontSize: "12px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}>
                        <strong>{hoveredInfo.node.name}</strong><br />
                        <em>{hoveredInfo.node.category}</em><br />
                        ${hoveredInfo.node.price}<br />
                        {hoveredInfo.node.dateStart} → {hoveredInfo.node.dateEnd}
                    </div>
                )}
        </>)}
        </div>
    );
}


export default NodeLink;
