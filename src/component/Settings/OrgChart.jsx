// import React, { useEffect, useRef, useState } from 'react';
// import OrgChart from 'orgchart';
// import 'orgchart/dist/css/jquery.orgchart.css';

// const datascource = [
//   [
//     { 'id': '8', 'name': 'Lao Ye', 'title': 'Grandfather', 'gender': 'male' },
//     { 
//       'id': '1', 'name': 'Lao Lao', 'title': 'Grandmother', 'gender': 'female', 'outsider': true,
//       'children': [
//         [
//           { 'id': '2', 'name': 'Bo miao', 'title': 'Aunt', 'gender': 'female'}
//         ],
//         [
//           { 'id': '3', 'name': 'Su Miao', 'title': 'Mother', 'gender': 'female',
//             'children': [
//               [
//                 { 'id': '12', 'name': 'Pang Pang', 'title': 'Wife', 'gender': 'female', 'outsider': true,
//                   'children': [
//                     [{ 'id': '7', 'name': 'Dan Dan', 'title': 'Daughter', 'gender': 'female' }],
//                     [{ 'id': '6', 'name': 'Er Dan', 'title': 'Daughter', 'gender': 'female' }],
//                   ]
//                 },
//                 { 'id': '5', 'name': 'Hei Hei', 'title': 'Me', 'gender': 'male' },
//               ]
//             ]
//           },
//           { 'id': '9', 'name': 'Tie Hua', 'title': 'Father', 'gender': 'male', 'outsider': true }
//         ],
//         [
//           { 'id': '10', 'name': 'Hong miao', 'title': 'Aunt', 'gender': 'female'}
//         ]
//       ]
//     }
//   ]
// ];

// // Flatten the datasource into a flat structure with parent-child relationships
// const flattenData = (data, parentId = null) => {
//   let flatData = [];
//   data.forEach(item => {
//     const { children, ...rest } = item;
//     flatData.push({
//       ...rest,
//       parent_id: parentId, // Set the parent_id based on the parent's ID
//     });

//     if (children) {
//       children.forEach(child => {
//         flatData = flatData.concat(flattenData(child, item.id)); // Recursively flatten child nodes
//       });
//     }
//   });
//   return flatData;
// };

// function OrgChartComponent() {
//   const [chartData, setChartData] = useState(flattenData(datasource[0])); // Flatten data when component mounts

//   const chartContainer = useRef(null);

//   useEffect(() => {
//     // Initialize OrgChart after the component is mounted
//     const chart = new OrgChart(chartContainer.current, {
//       template: 'laptop',
//       nodeContent: 'name',
//       nodes: chartData,
//     });

//     // Update the OrgChart whenever the chartData changes
//     chart.updateData(chartData);
//   }, [chartData]);

//   return (
//     <div>
//       <div ref={chartContainer}></div>
//     </div>
//   );
// }

// export default OrgChartComponent;
