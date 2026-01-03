import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";



const ChartComponent = () => {
  const [chartData, setChartData] = useState([
    // { id: "line-chart", component: <LineChart /> },
    // { id: "area-chart", component: <AreaChart /> },
    // { id: "column-chart", component: <ColumnChart /> },
    // { id: "bar-chart", component: <BarChart /> },
    // { id: "mixed-chart", component: <MixedChart /> },
    // { id: "range-area-chart", component: <RangeAreaChart /> },
    // { id: "time-line-chart", component: <TimeLineChart /> },
    // { id: "funnel-chart", component: <FunnelChart /> },
    // { id: "candlestick-charts", component: <CandlestickCharts /> },
    // { id: "radio-bar-chart", component: <RadioBarChart /> },
    // { id: "radar-charts", component: <RadarCharts /> },
    // { id: "polar-area-charts", component: <PolarAreaCharts /> },
  ]);

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(chartData);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setChartData(items);
  };
  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="chartList" direction="horizontal">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <Row className="drag__swap__widget">
                {chartData.map((chart, index) => (
                  <Draggable
                    key={chart.id}
                    draggableId={chart.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Row className="mt-3">
                          <Col md={12}>
                            <div className="color_div_Current">
                              <div className="color_rent mb-0">
                                <h6 className="home_text font-heading m-0">
                                  {chart.component}
                                </h6>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Row>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};

export default ChartComponent;
