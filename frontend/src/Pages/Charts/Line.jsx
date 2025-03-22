import React from 'react'
import { ChartsHeader,LineChart } from '../../Components'

const Line = () => {
  return (
    <div className="m-4 md:m-10 mt-14 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
      <ChartsHeader category="Chart" title="Inflation Rate"/>
      <div className="w-full">
        <LineChart/>
      </div>
    </div>
  )
}

export default Line
