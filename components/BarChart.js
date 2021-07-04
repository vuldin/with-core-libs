import {
  axisBottom,
  axisLeft,
  extent,
  scaleBand,
  scaleLinear,
  scaleUtc,
  schemeBlues,
  select,
} from 'd3'
import { useEffect, useRef, useState } from 'react'
import { useRecoilValue } from 'recoil'

import useResizeObserver from '../lib/useResizeObserver'

// TODO refactor how color is passed in
// TODO ensure options is optional
export default function BarChart({ options: { title, color = 'blue' }, state }) {
  // TODO move data to recoil atom, pass as prop
  const [data, setData] = useState([25, 30, 45, 60, 10, 65, 75])
  // TODO add legend
  const svgRef = useRef()
  const wrapperRef = useRef()
  const dimensions = useResizeObserver(wrapperRef)
  // TODO add right margin for legend
  const margin = {
    top: 0,
    right: 0,
    bottom: 24,
    left: 32,
  }

  useEffect(() => {
    if (!dimensions) return

    const svg = select(svgRef.current)
    const xScale = scaleBand()
      .domain(data.map((_, index) => index))
      .range([0, dimensions.width - margin.left])
      .padding(0.5)

    const yScale = scaleLinear()
      .domain([0, Math.max(...data)])
      .range([dimensions.height - margin.bottom, 0])

    const colorScale = scaleLinear()
      .domain([75, 100, 150])
      .range(['green', 'orange', 'red'])
      .clamp(true)

    const svgStyles = {
      height: `${dimensions.width}px`,
      'max-height': '300px',
    }
    Object.entries(svgStyles).forEach(([prop, val]) => svg.style(prop, val))

    svg
      .select('.data')
      .selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('class', 'bar')
      .style('transform', 'scale(1, -1)')
      .attr('x', (_, index) => xScale(index) + margin.left)
      .attr('y', -dimensions.height + margin.bottom)
      .attr('width', xScale.bandwidth())
      .transition()
      .attr('fill', colorScale)
      .attr('height', (value) => dimensions.height - margin.bottom - yScale(value))

    const xAxis = axisBottom(xScale).ticks(data.length)
    select('.x-axis')
      .style('transform', `translate(${margin.left}px, ${dimensions.height - margin.bottom}px)`)
      .call(xAxis)

    const yAxis = axisLeft(yScale)
    select('.y-axis').style('transform', `translateX(${margin.left}px)`).call(yAxis)
  }, [data, dimensions])

  return (
    <div className="grid gap-2">
      {title && <h3 className="text-lg font-medium text-center">{title}</h3>}
      <div ref={wrapperRef} className="chart bar-chart">
        <svg ref={svgRef}>
          <g className="x-axis-grid" />
          <g className="y-axis-grid" />
          <g className="data" />
          <g className="x-axis" />
          <g className="y-axis" />
        </svg>
      </div>
    </div>
  )
}
