import {
  axisBottom,
  axisLeft,
  curveStep,
  extent,
  line,
  scaleBand,
  scaleLinear,
  scaleOrdinal,
  scaleUtc,
  schemeBlues,
  schemeCategory10,
  select,
} from 'd3'
import { useEffect, useRef, useState } from 'react'
import { useRecoilValue } from 'recoil'

import useResizeObserver from '../lib/useResizeObserver'
import uid from '../lib/uid'

/*
let count = 0
function uid(name) {
  function Id(id) {
    this.id = id
    this.href = new URL(`#${id}`, window.location) + ''
  }
  Id.prototype.toString = function () {
    return 'url(' + this.href + ')'
  }
  return new Id('O-' + (name == null ? '' : name + '-') + ++count)
}
*/

// TODO refactor how color is passed in
// TODO ensure options is optional
export default function ChangeFailRateChart({ title }) {
  // TODO move data to recoil atom, pass as prop
  const [data, setData] = useState(() => {
    return Object.assign(
      [
        { date: '2019-11-10T00:53:00.000Z', value: 36, condition: 'SCT' },
        { date: '2019-11-10T01:19:00.000Z', value: 36, condition: 'BKN' },
        { date: '2019-11-10T01:42:00.000Z', value: 36, condition: 'SCT' },
        { date: '2019-11-10T01:53:00.000Z', value: 35.1, condition: 'FEW' },
        { date: '2019-11-10T02:53:00.000Z', value: 35.1, condition: 'OVC' },
        { date: '2019-11-10T03:53:00.000Z', value: 35.1, condition: 'OVC' },
        { date: '2019-11-10T04:53:00.000Z', value: 33.1, condition: 'FEW' },
        { date: '2019-11-10T05:06:00.000Z', value: 34, condition: 'BKN' },
        { date: '2019-11-10T05:53:00.000Z', value: 33.1, condition: 'BKN' },
        { date: '2019-11-10T05:58:00.000Z', value: 33.1, condition: 'SCT' },
        { date: '2019-11-10T06:53:00.000Z', value: 30.9, condition: 'FEW' },
        { date: '2019-11-10T07:53:00.000Z', value: 32, condition: 'FEW' },
        { date: '2019-11-10T08:53:00.000Z', value: 30.9, condition: 'CLR' },
        { date: '2019-11-10T09:53:00.000Z', value: 30.9, condition: 'CLR' },
        { date: '2019-11-10T10:27:00.000Z', value: 30.9, condition: 'BKN' },
        { date: '2019-11-10T10:53:00.000Z', value: 30.9, condition: 'OVC' },
        { date: '2019-11-10T11:53:00.000Z', value: 30, condition: 'OVC' },
        { date: '2019-11-10T12:53:00.000Z', value: 30, condition: 'OVC' },
        { date: '2019-11-10T13:23:00.000Z', value: 30, condition: 'OVC' },
        { date: '2019-11-10T13:53:00.000Z', value: 30, condition: 'OVC' },
        { date: '2019-11-10T14:53:00.000Z', value: 28.9, condition: 'OVC' },
        { date: '2019-11-10T15:53:00.000Z', value: 30, condition: 'OVC' },
        { date: '2019-11-10T16:23:00.000Z', value: 30, condition: 'BKN' },
        { date: '2019-11-10T16:53:00.000Z', value: 28.9, condition: 'OVC' },
        { date: '2019-11-10T17:53:00.000Z', value: 30, condition: 'BKN' },
        { date: '2019-11-10T18:53:00.000Z', value: 28.9, condition: 'SCT' },
        { date: '2019-11-10T19:53:00.000Z', value: 28, condition: 'FEW' },
        { date: '2019-11-10T20:53:00.000Z', value: 27, condition: 'FEW' },
        { date: '2019-11-10T21:53:00.000Z', value: 25, condition: 'FEW' },
        { date: '2019-11-10T22:13:00.000Z', value: 24.1, condition: 'BKN' },
      ].map((d) => ({ date: new Date(d.date), value: d.value, condition: d.condition })),
      {
        y: ' °F',
        conditions: ['CLR', 'FEW', 'SCT', 'BKN', 'OVC', 'VV '],
        labels: [
          'Clear',
          'Few clouds',
          'Scattered clouds',
          'Broken clouds',
          'Overcast',
          'Indefinite ceiling (vertical visibility)',
        ],
        colors: ['deepskyblue', 'lightskyblue', 'lightblue', '#aaaaaa', '#666666', '#666666'],
      }
    )
  })

  const svgRef = useRef()
  const wrapperRef = useRef()
  const dimensions = useResizeObserver(wrapperRef)
  const margin = { top: 0, right: 0, bottom: 24, left: 32 }

  const color = scaleOrdinal(
    data.conditions === undefined ? data.map((d) => d.condition) : data.conditions,
    data.colors === undefined ? schemeCategory10 : data.colors
  ).unknown('black')

  // TODO add legend
  function Legend() {
    return (
      <div className="flex" style={{ minHeight: '33px', marginLeft: `${margin.left}px` }}>
        {color.domain().map((name, i) => (
          <div
            key={`legend-${i}`}
            className="flex items-center w-16 pb-px"
            title={(data.labels[i] + '').replace(/"/g, '&quot;')}
          >
            <div className="w-5 h-5 mt-1" style={{ background: `${color(name)}` }} />
            {name}
          </div>
        ))}
      </div>
    )
  }

  useEffect(() => {
    if (!dimensions) return
    const { height, width } = dimensions

    const svg = select(svgRef.current)

    const svgStyles = {
      height: `${dimensions.width}px`,
      'max-height': '300px',
    }
    Object.entries(svgStyles).forEach(([prop, val]) => svg.style(prop, val))

    const x = scaleUtc()
      .domain(extent(data, (d) => d.date))
      .rangeRound([margin.left, width - margin.right])

    const y = scaleLinear()
      .domain(extent(data, (d) => d.value))
      .nice()
      .rangeRound([height - margin.bottom, margin.top])

    const xAxis = (g) =>
      g
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(
          axisBottom(x)
            .ticks(width / 80)
            .tickSizeOuter(0)
        )
        .call((g) => g.select('.domain').remove())

    const yAxis = (g) =>
      g
        .attr('transform', `translate(${margin.left},0)`)
        .call(axisLeft(y))
        .call((g) => g.select('.domain').remove())
        .call((g) => g.select('.tick:last-of-type text').append('tspan').text(data.y))

    const xAxisGrid = (g) =>
      g
        .attr('stroke', 'currentColor')
        .attr('stroke-opacity', 0.1)
        .call((g) =>
          g
            .selectAll('line')
            .data(x.ticks())
            .join('line')
            .attr('x1', (d) => x(d))
            .attr('x2', (d) => x(d))
            .attr('y1', margin.top)
            .attr('y2', height - margin.bottom)
        )
    const yAxisGrid = (g) =>
      g
        .attr('stroke', 'currentColor')
        .attr('stroke-opacity', 0.1)
        .call((g) =>
          g
            .selectAll('line')
            .data(y.ticks())
            .join('line')
            .attr('y1', (d) => 0.5 + y(d))
            .attr('y2', (d) => 0.5 + y(d))
            .attr('x1', margin.left)
            .attr('x2', width - margin.right)
        )

    const dataLine = line()
      .curve(curveStep)
      .x((d) => x(d.date))
      .y((d) => y(d.value))

    svg.select('.x-axis').call(xAxis)

    svg.select('.y-axis').call(yAxis)

    svg.select('.x-axis-grid').call(xAxisGrid)

    svg.select('.y-axis-grid').call(yAxisGrid)

    const colorId = uid(window.location)

    svg
      .select('.data linearGradient')
      .attr('id', colorId.id)
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0)
      .attr('x2', width)
      .selectAll('stop')
      .data(data)
      .join('stop')
      .attr('offset', (d) => x(d.date) / width)
      .attr('stop-color', (d) => color(d.condition))

    svg
      .select('.data path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', colorId)
      .attr('stroke-width', 2)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('d', dataLine)
  }, [data, dimensions])

  return (
    <div className="grid gap-2">
      {title && <h3 className="text-lg font-medium text-center">{title}</h3>}
      <Legend />
      <div ref={wrapperRef} className="chart bar-chart">
        <svg ref={svgRef}>
          <g className="x-axis-grid" />
          <g className="y-axis-grid" />
          <g className="data">
            <linearGradient />
            <path />
          </g>
          <g className="x-axis" />
          <g className="y-axis" />
        </svg>
      </div>
    </div>
  )
}
