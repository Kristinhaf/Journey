import { useEffect, useRef } from "react";
import { Timeline } from "vis-timeline/peer";
import { DataSet } from "vis-data/peer";
import "vis-timeline/styles/vis-timeline-graph2d.css";

const items = new DataSet([
    { id: 1, content: "Flight out",     start: "2026-07-01", end: "2026-07-01" },
    { id: 2, content: "Hotel",          start: "2026-07-01", end: "2026-07-08" },
    { id: 3, content: "Football match", start: "2026-07-02", end: "2026-07-02" },
]);

const options = {
    start: "2026-07-01",
    end:   "2026-07-08",
    stack: false,
    showMajorLabels: true,
    showMinorLabels: true,
    moveable: true,
    zoomable: true,
};

function TimelineGraph() {
    const containerRef = useRef(null);
    const timelineRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;
        timelineRef.current = new Timeline(containerRef.current, items, options);
        return () => {
            timelineRef.current?.destroy();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{ width: "100%", height: "100%", backgroundColor: "#fafafa" }}
        />
    );
}

export default TimelineGraph;
