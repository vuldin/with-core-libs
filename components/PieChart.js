import { useEffect, useRef } from 'react'
import { arc, interpolate, pie, scaleOrdinal, schemeOranges, select } from 'd3'
import { useRecoilValue } from 'recoil'
import useResizeObserver from '../lib/useResizeObserver'

export default function PieChart({ title, state, scheme = schemeOranges }) {
  const svgRef = useRef()
  const wrapperRef = useRef()
  const dimensions = useResizeObserver(wrapperRef)
  const data = useRecoilValue(state)

  useEffect(() => {
    if (!dimensions) return

    const svg = select(svgRef.current)
    const arcGenerator = arc()
      .innerRadius(0)
      .outerRadius(Math.min(dimensions.width, dimensions.height) / 2)
    const pieGenerator = pie()
      .value((d) => d.value)
      .sort(null)
    const instructions = pieGenerator(data)
    const colorScale = scaleOrdinal(scheme[3])

    const svgStyles = {
      height: `${dimensions.width}px`,
      'max-height': '300px',
    }
    Object.entries(svgStyles).forEach(([prop, val]) => svg.style(prop, val))

    svg
      .selectAll('.slice')
      .data(instructions)
      .join('path')
      .attr('class', 'slice')
      .attr('fill', (d, i) => colorScale(i))
      .style('transform', `translate(${dimensions.width / 2}px, ${dimensions.height / 2}px)`)
      .transition()
      .attrTween('d', function (nextInstruction) {
        const interpolator = interpolate(this.lastInstruction, nextInstruction)
        this.lastInstruction = interpolator(1)

        return function (t) {
          return arcGenerator(interpolator(t))
        }
      })
  }, [data, dimensions])

  return (
    <div className="grid gap-2">
      {title && <h3 className="text-lg font-medium text-center">{title}</h3>}
      <div ref={wrapperRef} className="chart pie-chart">
        <svg ref={svgRef}></svg>
      </div>
    </div>
  )
}
