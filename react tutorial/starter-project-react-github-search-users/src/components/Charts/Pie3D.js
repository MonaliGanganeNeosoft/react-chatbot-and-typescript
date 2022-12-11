// STEP 1 - Include Dependencies
// Include react
import React from "react";

// Include the react-fusioncharts component
import ReactFC from "react-fusioncharts";

// Include the fusioncharts library
import FusionCharts from "fusioncharts";

// Include the chart type
import Chart from "fusioncharts/fusioncharts.charts";

// Include the theme as fusion
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";

// Adding the chart and theme as dependency to the core fusioncharts
ReactFC.fcRoot(FusionCharts, Chart, FusionTheme);

// // STEP 2 - Chart Data
// const chartData = [
//   {
//     label: "HTML",
//     value: "13",
//   },
//   {
//     label: "CSS",
//     value: "23",
//   },
//   {
//     label: "Javascript",
//     value: "18",
//   },
// ];

// STEP 3 - Creating the JSON object to store the chart configurations
// const chartConfigs = {
//   type: "column2d", // The chart type
//   width: "400", // Width of the chart
//   height: "400", // Height of the chart
//   dataFormat: "json", // Data type
//   dataSource: {
//     // Chart Configuration
//     chart: {
//       //Set the chart caption
//       caption: "Countries With Most Oil Reserves [2017-18]",
//       //Set the chart subcaption
//       subCaption: "In MMbbl = One Million barrels",
//       //Set the x-axis name
//       xAxisName: "Country",
//       //Set the y-axis name
//       yAxisName: "Reserves (MMbbl)",
//       numberSuffix: "K",
//       //Set the theme for your chart
//       theme: "fusion",
//     },
//     // Chart Data
//     data: chartData,
//   },
// };

// STEP 4 - Creating the DOM element to pass the react-fusioncharts component
// class App extends React.Component {
//   render() {
//     return <ReactFC {...chartConfigs} />;
//   }
// }

// export default App;

const ChartComponent = ({ data }) => {
  const chartConfigs = {
    type: "pie3d", // The chart type
    width: "100%", // Width of the chart
    height: "400", // Height of the chart
    dataFormat: "json", // Data type
    dataSource: {
      // Chart Configuration
      chart: {
        caption: "Languages",
        theme: "fusion",
        decimals: 0,
        pieRadius: "35%",
        // //Set the chart caption
        // caption: "Countries With Most Oil Reserves [2017-18]",
        // //Set the chart subcaption
        // subCaption: "In MMbbl = One Million barrels",
        // //Set the x-axis name
        // xAxisName: "Country",
        // //Set the y-axis name
        // yAxisName: "Reserves (MMbbl)",
        // numberSuffix: "K",
        // //Set the theme for your chart
        // theme: "fusion",
      },
      // Chart Data
      // data: chartData,
      data,
    },
  };
  return <ReactFC {...chartConfigs} />;
};
export default ChartComponent;
