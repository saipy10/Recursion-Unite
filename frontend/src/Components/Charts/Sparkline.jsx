import React from 'react'
import { SparklineComponent, Inject, SparklineTooltip } from '@syncfusion/ej2-react-charts';

const Sparkline = ({ id, height, width, color, data, type, currentColor }) => {
  return (
    <SparklineComponent
      id={id}
      height={height}
      width={width}
      lineWidth={1}
      valueType="Numeric"
      fill={color}
      border={{ color: currentColor, width: 2 }}
      dataSource={data}
      xName="x"
      yName="y"
      type={type}
      tooltipSettings={{
        visible: true,
        format: '${x}: data ${y}', 
        trackLineSettingsz:{
            visible: true
        }
      }}
    >
      <Inject services={[SparklineTooltip]} />
    </SparklineComponent>
  )
};
export default Sparkline;
