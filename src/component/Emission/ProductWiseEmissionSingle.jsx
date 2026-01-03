import React, { useState } from 'react';
import Chart from 'react-apexcharts';

const ProductWiseEmissionSingle = () => {
  const [selectedProducts, setSelectedProducts] = useState(['Bituminous coal']);

  const dataOptions = {
    'Bituminous coal': [44, 55, 41, 17],
    'PNG': [13, 23, 20, 8],
    'CNG': [11, 17, 15, 7],
    'Range 13': [25, 27, 22, 15],
  };

  const options = {
    chart: {
      type: 'donut',
    },
    labels: selectedProducts,
    colors: ['#1E90FF', '#FF6347', '#32CD32', '#00CED1'],
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  const handleProductChange = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedProducts(selectedOptions);
  };

  // Aggregate the series data based on selected products
  const aggregatedSeries = selectedProducts.reduce((acc, product) => {
    const data = dataOptions[product];
    return acc.map((value, index) => value + (data[index] || 0));
  }, [0, 0, 0, 0]); // Initialize with zeros based on data length

  return (
    <div className="container">
      <div className="header">
        <div className="title">Product-Wise Emission For Scope 1</div>
        <div className="filter">
          <select multiple onChange={handleProductChange} value={selectedProducts}>
            <option value="Bituminous coal">Bituminous coal</option>
            <option value="PNG">PNG</option>
            <option value="CNG">CNG</option>
            <option value="Range 13">Range 13</option>
          </select>
        </div>
      </div>
      <div className="chart-container">
        <Chart options={options} series={aggregatedSeries} type="donut" height="350" />
      </div>
    </div>
  );
};

export default ProductWiseEmissionSingle;
