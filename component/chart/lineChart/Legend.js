import React, { Component, PropTypes } from 'react'
import { G, Rect, Text } from 'react-native-svg'

export default class Legend extends Component {
  static propTypes = {
    names: PropTypes.arrayOf(PropTypes.string).isRequired,
    colors: PropTypes.arrayOf(PropTypes.string).isRequired,
    x: PropTypes.number,
    y: PropTypes.number
  }

  render () {
    let {names, colors, x, y} = this.props
    return (
      <G fill='none'>
         {names.map(
             (name, i) => <Text
                            key={name}
                            fill={colors[i % colors.length]}
                            stroke={colors[i % colors.length]}
                            fontSize='30'
                            x={x}
                            y={y + i * 30}>
                            {name}
                          </Text>
           )}
      </G>
    )
  }
}