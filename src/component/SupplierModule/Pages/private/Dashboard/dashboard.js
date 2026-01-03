import React from "react";
import Sidebar from "../../../../sidebar/sidebar";
import Header from "../../../../header/header";
//import { Chart } from "react-google-charts";
import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
// import '../../Common.css';

// interface ApexChartProps {}

// interface TravelDetailsViewProps {
//   options?: any;
//   series?: any;
// }

const TravelDetailsView = () => {

    const chartData = {
        series: [{
            name: 'Website Blog',
            type: 'column',
            data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160]
        }, {
            name: 'Social Media',
            type: 'line',
            data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16]
        }],
        options: {
            chart: {
                height: 350,
                type: 'line',
            },
            stroke: {
                width: [0, 4]
            },
            title: {
                text: 'Traffic Sources'
            },
            dataLabels: {
                enabled: true,
                enabledOnSeries: [1]
            },
            labels: ['01 Jan 2001', '02 Jan 2001', '03 Jan 2001', '04 Jan 2001', '05 Jan 2001', '06 Jan 2001', '07 Jan 2001', '08 Jan 2001', '09 Jan 2001', '10 Jan 2001', '11 Jan 2001', '12 Jan 2001'],
            xaxis: {
                type: 'datetime'
            },
            yaxis: [{
                title: {
                    text: 'Website Blog',
                },

            }, {
                opposite: true,
                title: {
                    text: 'Social Media'
                }
            }]
        },
    };

    return <ReactApexChart options={chartData} series={chartData.series} />;

};


export default function DashboardOr(props) {
    return (
        <div>
            <Sidebar dataFromParent={props.location.pathname} />
            <Header />
            <div className="main_wrapper">
                <div className="inner_wraapper">
                    <div className="container-fluid">
                        <section className="d_text">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="col-sm-12">
                                            <div className="color_div_on framwork_2">
                                                <div className="business_detail">
                                                    <div className="">
                                                        <div className="heading">
                                                            <h4>Dashboard</h4>
                                                        </div>
                                                        <hr className="line"></hr>
                                                        <div className="saved_cards">
                                                            <div className="row">
                                                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                                                    <div className="google_chart">
                                                                        <TravelDetailsView />
                                                                        <h4>Graph 1</h4>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                                                    <div className="google_chart">
                                                                        <TravelDetailsView />
                                                                        <h4>Graph 2</h4>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                                                    <div className="google_chart">
                                                                        <TravelDetailsView />
                                                                        <h4>Graph 3</h4>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                                                    <div className="google_chart">
                                                                        <TravelDetailsView />
                                                                        <h4>Graph 4</h4>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                                                    <div className="google_chart">
                                                                        <TravelDetailsView />
                                                                        <h4>Graph 5</h4>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                                                    <div className="google_chart">
                                                                        <TravelDetailsView />
                                                                        <h4>Graph 6</h4>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                                                    <div className="google_chart">
                                                                        <TravelDetailsView />
                                                                        <h4>Graph 7</h4>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                                                    <div className="google_chart">
                                                                        <TravelDetailsView />
                                                                        <h4>Graph 8</h4>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}