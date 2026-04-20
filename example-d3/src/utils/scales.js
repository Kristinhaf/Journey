import * as d3 from 'd3';

// Creates a linear x-scale mapped to a pixel range.
export function createXScale(domain, rangeMax, padding = 0.1) {
  return d3.scaleLinear().domain(domain).range([0, rangeMax]).nice();
}

// Creates a linear y-scale mapped to a pixel range (inverted for SVG).
export function createYScale(domain, rangeMax, padding = 0.1) {
  return d3.scaleLinear().domain(domain).range([rangeMax, 0]).nice();
}
