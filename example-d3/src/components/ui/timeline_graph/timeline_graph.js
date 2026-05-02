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
    return {
        id: d.id,
        content: `${d.name} <span style="
            font-size:10px;
            font-weight:700;
            padding:1px 6px;
            border-radius:8px;
            background:${booked ? "#fff" : "rgba(0,0,0,0.15)"};
            color:${booked ? "#2e7d32" : "inherit"};
            margin-left:6px;
        ">${booked ? "BOOKED" : "OPTION"}</span>`,
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

    return (
        <div
            ref={containerRef}
            style={{ width: "100%", height: "100%", backgroundColor: "#fafafa" }}
        />
    );
}

export default TimelineGraph;
