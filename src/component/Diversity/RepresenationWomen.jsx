import React from 'react';
import Chart from 'react-apexcharts';

const RepresentationOfWomen = ({ diversity }) => {
  // Aggregate the data for board members and key personnel
  const aggregatedData = diversity.reduce(
    (acc, item) => {
      const [boardMembers, keyPersonnel] = item.answer || [[], []];

      acc.boardMembers.male += parseInt(boardMembers[0], 10) || 0;
      acc.boardMembers.female += parseInt(boardMembers[1], 10) || 0;
      acc.boardMembers.others += parseInt(boardMembers[2], 10) || 0;

      // Add male, female, others for key personnel
      acc.keyPersonnel.male += parseInt(keyPersonnel[0], 10) || 0;
      acc.keyPersonnel.female += parseInt(keyPersonnel[1], 10) || 0;
      acc.keyPersonnel.others += parseInt(keyPersonnel[2], 10) || 0;
      return acc;
    },
    {
      boardMembers: { male: 0, female: 0, others: 0 },
      keyPersonnel: { male: 0, female: 0, others: 0 }
    }
  );

  const series = [
    {
      name: 'Male',
      data: [aggregatedData.boardMembers.male, aggregatedData.keyPersonnel.male]
    },
    {
      name: 'Female',
      data: [aggregatedData.boardMembers.female, aggregatedData.keyPersonnel.female]
    },
    {
      name: 'Others',
      data: [aggregatedData.boardMembers.others, aggregatedData.keyPersonnel.others]
    }
  ];

  const colors = ["#11564f", "#6fa8dc", "#9CDFE3"];

  const options = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: true, // Enable stacking
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '8%',
        borderRadius: 8,
        endingShape: 'rounded',
      },
    },
    xaxis: {
      categories: ['Board Members', 'Key Personnel'], // X-axis labels
      labels: {
        style: {
          fontSize: '12px',
          fontWeight: 'bold',
          colors: 'grey',
        }
      }
    },
    yaxis: {
      title: {
        show: false,
        text: 'Number of Positions',
        style: {
          fontSize: '12px',
          fontWeight: 'bold',
          color: 'grey',
        }
      }
    },
    colors: colors, // Colors for Male, Female, Others
    legend: {
      show: false,
      enabled: false,
      position: 'bottom',
      horizontalAlign: 'center'
    },
    fill: {
      opacity: 1 // Ensures the bars are filled
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="title">Representation of Women</div>
      </div>
      <div className="chart-container">
        <Chart options={options} series={series} type="bar" height={"100%"} />
      </div>
      <div
        className="custom-legend"
        style={{
          marginTop: "20px",
          width: "100%",
          display: "flex",
          gap: "20px",
        }}
      >
        <div style={{ width: "10%", display: "flex", gap: "10px", alignContent: "center", justifyContent: "center", alignItems: "center" }}>
          <div
            style={{
              backgroundColor: colors[0],
              padding: "5px",
              borderRadius: "50%",
              width: "10%",
              height: "50%"
            }}
          ></div>{" "}
          <div>
            Males

          </div>

        </div>
        <div style={{ width: "10%", display: "flex", alignContent: "center", justifyContent: "center", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              backgroundColor: colors[1],
              padding: "5px",
              borderRadius: "50%",
              width: "10%",
              height: "50%"
            }}
          ></div>{" "}
          <div>
            Females

          </div>
        </div>
        <div style={{ width: "10%", display: "flex", alignContent: "center", justifyContent: "center", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              backgroundColor: colors[2],
              padding: "5px",
              borderRadius: "50%",
              width: "10%",
              height: "50%"
            }}
          ></div>{" "}
          <div>
            Others

          </div>
        </div>
      </div>
    </div>
  );
};

export default RepresentationOfWomen;
