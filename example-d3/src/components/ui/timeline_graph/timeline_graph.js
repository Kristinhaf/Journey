import { useEffect, useRef } from "react";
import { Timeline } from "vis-timeline/peer";
import { DataSet } from "vis-data/peer";
import "vis-timeline/styles/vis-timeline-graph2d.css";

const FALLBACK_START = "2026-07-01";
const FALLBACK_END   = "2026-07-08";

const baseOptions = {
    stack: true,
    showMajorLabels: true,
    showMinorLabels: true,
    moveable: true,
    zoomable: true,
};

function toVisItem(d) {
    const booked = d.status === "booked";
    const btnColor = booked ? "#2e7d32" : "#f9a825";

    const wrap = document.createElement("span");
    wrap.style.cssText = "display:inline-flex;align-items:center;gap:6px;overflow:hidden;max-width:100%;";

    const name = document.createElement("span");
    name.style.cssText = "overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px;flex-shrink:1;";
    name.textContent = d.name;

    const pill = document.createElement("span");
    pill.style.cssText = `display:inline-flex;align-items:center;border-radius:10px;overflow:hidden;border:1.5px solid ${btnColor};flex-shrink:0;font-size:9px;font-weight:700;cursor:pointer;white-space:nowrap;`;

    const optSide = document.createElement("span");
    optSide.style.cssText = `padding:2px 7px;background:${booked ? "transparent" : btnColor};color:${booked ? btnColor : "white"};`;
    optSide.textContent = "OPTION";

    const bkdSide = document.createElement("span");
    bkdSide.style.cssText = `padding:2px 7px;background:${booked ? btnColor : "transparent"};color:${booked ? "white" : btnColor};`;
    bkdSide.textContent = "BOOKED";

    pill.appendChild(optSide);
    pill.appendChild(bkdSide);
    wrap.appendChild(name);
    wrap.appendChild(pill);

    return {
        id: d.id,
        content: wrap,
        style: booked
            ? "background:#c8e6c9; border-color:#2e7d32; color:#1b5e20;"
            : "background:#fff8e1; border-color:#f9a825; border-style:dashed; color:#5d4037;",
        start: d.startTime ? `${d.dateStart}T${d.startTime}:00` : d.dateStart,
        end:   d.endTime   ? `${d.dateEnd}T${d.endTime}:00`     : d.dateEnd,
    };
}

function TimelineGraph({ timelineItems = [], fromDate = null, toDate = null, onToggleStatus }) {
    const containerRef = useRef(null);
    const timelineRef = useRef(null);
    const datasetRef = useRef(new DataSet([]));
    const onToggleStatusRef = useRef(onToggleStatus);
    onToggleStatusRef.current = onToggleStatus;

    useEffect(() => {
        if (!containerRef.current) return;
        const start = fromDate ? fromDate.format("YYYY-MM-DD") : FALLBACK_START;
        const end   = toDate   ? toDate.format("YYYY-MM-DD")   : FALLBACK_END;
        timelineRef.current = new Timeline(containerRef.current, datasetRef.current, {
            ...baseOptions,
            start,
            end,
            min: start,
            max: end,
        });

        timelineRef.current.on("click", (props) => {
            if (props.item) onToggleStatusRef.current?.(props.item);
        });

        return () => {
            timelineRef.current?.destroy();
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!timelineRef.current) return;
        const start = fromDate ? fromDate.format("YYYY-MM-DD") : FALLBACK_START;
        const end   = toDate   ? toDate.format("YYYY-MM-DD")   : FALLBACK_END;
        timelineRef.current.setOptions({ min: start, max: end });
        timelineRef.current.setWindow(start, end, { animation: true });
    }, [fromDate, toDate]);

    useEffect(() => {
        const dataset = datasetRef.current;
        const incoming = timelineItems.map(toVisItem);
        const incomingIds = new Set(incoming.map(i => i.id));
        const existingIds = new Set(dataset.getIds());

        incoming.forEach(item => {
            if (existingIds.has(item.id)) {
                dataset.update(item);
            } else {
                dataset.add(item);
            }
        });
        existingIds.forEach(id => {
            if (!incomingIds.has(id)) dataset.remove(id);
        });
    }, [timelineItems]);

    const showPlaceholder = !fromDate || !toDate;
    const totalPrice = timelineItems.reduce((sum, item) => sum + (item.price || 0), 0);

    return (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
            <div style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                padding: "4px 16px",
                borderBottom: "1px solid #e0e0e0",
                backgroundColor: "#f5f5f5",
                flexShrink: 0,
            }}>
                <span style={{ fontSize: "13px", color: "#555" }}>
                    Total: <strong style={{ fontSize: "15px", color: "#1b3197" }}>${totalPrice.toLocaleString()}</strong>
                </span>
            </div>
            <div ref={containerRef} style={{ flex: 1, backgroundColor: "#fafafa", position: "relative" }}>
                {showPlaceholder && (
                    <div style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        color: "#888",
                        fontSize: "13px",
                        pointerEvents: "none",
                    }}>
                        📅 Add a from and to date to see the timeline
                    </div>
                )}
            </div>
        </div>
    );
}

export default TimelineGraph;
