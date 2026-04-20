import * as d3 from 'd3';

export const formatNumber = d3.format(',');
export const formatPercent = d3.format('.1%');
export const formatDate = d3.timeFormat('%b %d, %Y');
