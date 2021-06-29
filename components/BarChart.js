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
  // TODO add right padding for legend
  const padding = { left: 32, bottom: 24 }

  useEffect(() => {
    if (!dimensions) return

    const svg = select(svgRef.current)
    const xScale = scaleBand()
      .domain(data.map((_, index) => index))
      .range([0, dimensions.width - padding.left])
      .padding(0.5)

    const yScale = scaleLinear()
      .domain([0, Math.max(...data)])
      .range([dimensions.height - padding.bottom, 0])

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
      .selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('class', 'bar')
      .style('transform', 'scale(1, -1)')
      .attr('x', (_, index) => xScale(index) + padding.left)
      .attr('y', -dimensions.height + padding.bottom)
      .attr('width', xScale.bandwidth())
      .transition()
      .attr('fill', colorScale)
      .attr('height', (value) => dimensions.height - padding.bottom - yScale(value))

    const xAxis = axisBottom(xScale).ticks(data.length)
    let xAxisGroup = select('.x-axis')
    if (!xAxisGroup['_groups'][0][0]) xAxisGroup = svg.append('g').attr('class', 'x-axis')
    xAxisGroup
      .style('transform', `translate(${padding.left}px, ${dimensions.height - padding.bottom}px)`)
      .call(xAxis)

    const yAxis = axisLeft(yScale)
    let yAxisGroup = select('.y-axis')
    if (!yAxisGroup['_groups'][0][0]) yAxisGroup = svg.append('g').attr('class', 'y-axis')
    yAxisGroup.style('transform', `translateX(${padding.left}px)`).call(yAxis)
  }, [data, dimensions])

  return (
    <div className="grid gap-2">
      {title && <h3 className="text-lg font-medium text-center">{title}</h3>}
      <div ref={wrapperRef} className="chart bar-chart">
        <svg ref={svgRef}></svg>
      </div>
    </div>
  )
}
