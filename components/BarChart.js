import { axisBottom, axisLeft, scaleBand, scaleLinear, schemeBlues, select } from 'd3'
import { useEffect, useRef, useState } from 'react'
import { useRecoilValue } from 'recoil'

import useResizeObserver from '../lib/useResizeObserver'

// TODO refactor how color is passed in
export default function BarChart({ title, state, scheme = schemeBlues }) {
  // TODO move data to recoil atom, pass as prop
  const [data, setData] = useState([25, 30, 45, 60, 10, 65, 75])
  // TODO add legend
  const svgRef = useRef()
  const wrapperRef = useRef()
  const dimensions = useResizeObserver(wrapperRef)
  // TODO add right margin for legend
  const margin = { left: 32, bottom: 24 }

  useEffect(() => {
    if (!dimensions) return

    const svg = select(svgRef.current)
    const xScale = scaleBand()
      .domain(data.map((_, index) => index))
      .range([0, dimensions.width - margin.left])
      .padding(0.5)

    const yScale = scaleLinear()
      .domain([0, 150])
      .range([dimensions.height - margin.bottom, 0])

    const colorScale = scaleLinear()
      .domain([75, 100, 150])
      .range(['green', 'orange', 'red'])
      .clamp(true)

    const xAxis = axisBottom(xScale).ticks(data.length)

    svg
      .select('.x-axis')
      .style('transform', `translate(${margin.left}px, ${dimensions.height - margin.bottom}px)`)
      .call(xAxis)

    const yAxis = axisLeft(yScale)
    svg.select('.y-axis').style('transform', `translateX(${margin.left}px)`).call(yAxis)

    const svgStyles = {
      height: `${dimensions.width}px`,
      'max-height': '300px',
    }
    Object.entries(svgStyles).forEach(([prop, val]) => svg.style(prop, val))

    svg
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
  }, [data, dimensions])

  return (
    <div className="grid gap-2">
      {title && <h3 className="text-lg font-medium text-center">{title}</h3>}
      <div ref={wrapperRef} className="chart bar-chart">
        <svg ref={svgRef}>
          <g className="x-axis" />
          <g className="y-axis" />
        </svg>
      </div>
    </div>
  )
}
