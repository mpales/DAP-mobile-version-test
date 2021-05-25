import React, { Component, PropTypes } from 'react'
import { View } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import * as d3scale from 'd3-scale'
import * as d3shape from 'd3-shape'
import Axis from './Axis';;
import Legend from './Legend';

export default class LineChart extends Component {
  static propTypes = {
    // dynamic shape: exerciseObj
    // {
    //     "Barbell Bench Press": [
    //       [date: Date, weight],
    //       [date: Date, weight],
    //       [date: Date, weight],
    //       [date: Date, weight],
    //       [date: Date, weight],
    //     ],
    //     "Dumbbell Bench Press": [
    //       [date: Date, weight],
    //       [date: Date, weight],
    //       [date: Date, weight],
    //       [date: Date, weight],
    //       [date: Date, weight],
    //     ],
    //    ...
    // }
    exObj: PropTypes.object.isRequired,
    colors: PropTypes.arrayOf(PropTypes.string).isRequired,
  }

  constructor(props) {
    super(props)
    this.state = { dimensions: undefined }
    this.startX = 100
    this.viewBoxWidth = 1000
  }

  render() {
    if (this.state.dimensions) {
      var { data, minDate, maxDate, minWeight, maxWeight, dimensions, xScale, yScale } = this.state
      var { width, height, aspectRatio } = dimensions
      var viewBox = { w: this.viewBoxWidth, h: this.viewBoxWidth / aspectRatio }
      var { exObj, colors } = this.props
    }
    return (
      <View style={{ flex: 1, alignSelf: 'stretch' }} onLayout={this.onLayout}>
        {this.state.dimensions && minDate // minDate is set when there is more than 0 exercises
           ? <Svg width={width} height={height} viewBox={`0 0 ${viewBox.w} ${viewBox.h}`}>
             <Axis
               width={viewBox.w - 2 * this.startX}
               x={this.startX}
               y={viewBox.h - this.startX}
               ticks={8}
               startVal={minDate}
               endVal={maxDate}
               scale={xScale}
             />
             <Axis
               width={viewBox.h - 2 * this.startX}
               x={this.startX}
               y={viewBox.h - this.startX}
               ticks={8}
               startVal={minWeight}
               endVal={maxWeight}
               scale={yScale}
               vertical
             />
             {data.map(
                  (pathD, i) => <Path fill="none" stroke={colors[i % colors.length]} strokeWidth="5" d={pathD} key={i} />,
                )}
             <Legend
               x={this.startX + 30}
               y={this.startX}
               names={Object.keys(exObj)}
               colors={colors}
             />
           </Svg>
           : undefined}
      </View>
    )
  }

  onLayout = (event) => {
    if (this.state.dimensions) return // layout was already called once
    const { width, height } = event.nativeEvent.layout
    const aspectRatio = width / height
    const graphData = this.createGraphData(this.props.exObj, aspectRatio)
    this.setState({ dimensions: { width, height, aspectRatio }, ...graphData })
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.dimensions) return
    const aspectRatio = this.state.dimensions.aspectRatio
    this.setState({ ...this.createGraphData(nextProps.exObj, aspectRatio) })
  }

  createGraphData = (exObj, aspectRatio) => {
    const weights = []
    let minDate
    let maxDate
    // find ranges of date and weight by expanding ALL exercises
    Object.keys(exObj).forEach((exName) => {
      const firstWorkout = exObj[exName][0]
      if (firstWorkout) {
        minDate = minDate ? new Date(Math.min(minDate.getTime(), firstWorkout[0].getTime()))
          : new Date(firstWorkout[0].getTime())
        const lastWorkout = exObj[exName][exObj[exName].length - 1]
        maxDate = maxDate ? new Date(Math.max(maxDate.getTime(), lastWorkout[0].getTime()))
          : new Date(lastWorkout[0].getTime())
      }
      weights.push(...exObj[exName].map(arr => arr[1]))
    })
    const minWeight = Math.min(...weights)
    const maxWeight = Math.max(...weights)

    const { xScale, yScale } = this.createScalesDomain(aspectRatio)
    xScale.range([minDate, maxDate])
    yScale.range([minWeight, maxWeight])
    const data = []
    const lineGenerator = d3shape.line()
      .x(d => xScale.invert(d[0]))
      .y(d => yScale.invert(d[1]))
    Object.keys(exObj).forEach((exName) => {
      data.push(lineGenerator(exObj[exName]))
    })
    return { data, minDate, maxDate, minWeight, maxWeight, xScale, yScale }
  }

  createScalesDomain = (aspectRatio) => {
    const viewBoxWidth = this.viewBoxWidth
    const viewBoxHeight = viewBoxWidth / aspectRatio
    const startX = this.startX
    const startY = viewBoxHeight - startX
    const xScale = d3scale.scaleTime()
    xScale.domain([startX, viewBoxWidth - startX])
    const yScale = d3scale.scaleLinear().domain([startY, startX])
    return { xScale, yScale }
  }
}

const styles = {
  text: {
    color: 'black',
  },
}