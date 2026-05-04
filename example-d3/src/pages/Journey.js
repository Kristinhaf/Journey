import React from "react";
import { Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import DateRangePicker from "../components/ui/datepicker/datepicker";
import NumberInputBasic from "../components/ui/number_input/number_input";
// import Menu from "../components/ui/menu/Menu";
import TimelineGraph from "../components/ui/timeline_graph/timeline_graph";
import NodeLink from "../components/ui/node_link/node_link";
// import TagButtons from "../components/ui/tag_buttons/TagButtons";

function Journey() {
    const [destination, setDestination] = React.useState("Barcelona");
    const [capacity, setCapacity] = React.useState(0);
    const [outbound, setOutbound] = React.useState("Stockholm");
    const [fromDate, setFromDate] = React.useState(null);
    const [toDate, setToDate] = React.useState(null);
    const [submittedData, setSubmittedData] = React.useState(null);
    const [activeCategories, setActiveCategories] = React.useState(["flight", "stay", "experience"]);
    const [timelineItems, setTimelineItems] = React.useState([]);

    const addToTimeline = (node) => {
        setTimelineItems(prev => prev.some(i => i.id === node.id) ? prev : [...prev, { ...node, status: "option" }]);
    };

    const removeFromTimeline = (nodeId) => {
        setTimelineItems(prev => prev.filter(i => i.id !== nodeId));
    };

    const toggleStatus = (nodeId) => {
        setTimelineItems(prev => prev.map(i =>
            i.id === nodeId ? { ...i, status: i.status === "option" ? "booked" : "option" } : i
        ));
    };

    const handleSubmit = () => {
        setSubmittedData({ outbound, destination, capacity, fromDate, toDate });
    };

    return (
        <div style={{ display: "flex", flexDirection: "row", height: "100%", backgroundColor: "#f8eade" }} >
            {/* <div style={{ backgroundColor: "#1b3197", width: "20%", padding: "16px"}}>
                filter
            </div> */}
            <div style={{ backgroundColor: "#f8eade", flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", flexDirection: "row",  backgroundColor: "#dde6ed", height: "10%", padding: "16px", alignItems: "center", gap: "16px" }}>
                    <FormControl style={{ minWidth: 200 }}>
                        <InputLabel id="from-label">Travelling from</InputLabel>
                        <Select
                            labelId="from-label"
                            value={outbound}
                            label="Travelling from"
                            onChange={(e) => setOutbound(e.target.value)}
                        >
                            <MenuItem value={"stockholm"}>Stockholm</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl style={{ minWidth: 200 }}>
                        <InputLabel id="to-label">Travelling to</InputLabel>
                        <Select
                            labelId="to-label"
                            value={destination}
                            label="Travelling to"
                            onChange={(e) => setDestination(e.target.value)}
                        >
                            <MenuItem value={"barcelona"}>Barcelona</MenuItem>
                         </Select>
                    </FormControl>
                    <NumberInputBasic value={capacity} onChange={setCapacity} />
                    <DateRangePicker fromDate={fromDate} setFromDate={setFromDate} toDate={toDate} setToDate={setToDate} />
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Submit
                    </Button>
                </div>
                <div style={{ backgroundColor: "#dde6ed", flex: 1, tabSize: "0", position: "relative" }}>
                    <NodeLink
                        onAddToTimeline={addToTimeline}
                        onRemoveFromTimeline={removeFromTimeline}
                        timelineItemIds={new Set(timelineItems.map(i => i.id))}
                        submittedData={submittedData}
                    />
                </div>
                <div style={{ backgroundColor: "#cfb59e", border: "1px solid #ccc", height: "auto", padding: "16px", display: "flex", flexDirection: "column"}}>
                    <p style={{ fontFamily: "Palatino, serif", fontWeight: "bold" }}>Timeline</p>
                    <TimelineGraph timelineItems={timelineItems} fromDate={fromDate} toDate={toDate} onToggleStatus={toggleStatus} />
                </div>
            </div>
            
        </div>
    );
}

export default Journey;
