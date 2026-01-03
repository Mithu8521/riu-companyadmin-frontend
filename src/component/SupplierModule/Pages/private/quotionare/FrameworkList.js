// import React from "react";
// import { NavLink } from "react-router-dom";
// import Sidebar from "../../../../sidebar/sidebar";
// import Header from "../../../../header/header";
// import Table from "react-bootstrap/Table";
// // import Moment from "react-moment";
// import swal from "sweetalert";

// export default function FrameworkList() {
//     const deleteQuestion = () => {
//         swal({
//           title: "Are you sure?",
//           text: "You want to delete this Question?",
//           icon: "warning",
//           buttons: true,
//           dangerMode: true,
//         }).then((willDelete) => {
//           if (willDelete) {
//             swal("Question has been deleted!", {
//               icon: "success",
//             });
//           } else {
//             swal("Question is safe!");
//           }
//         });
//       };

//   return (
//     <div>
//     <Sidebar dataFromParent="Framework List"/>
//     <Header />
//     <div className="main_wrapper">
//       <div className="inner_wraapper">
//         <div className="container-fluid">
//           <section className="d_text">
//             <div className="container-fluid">
//               <div className="row">
//                 <div className="col-sm-12">
//                   <div className="col-sm-12">
//                     <div className="color_div_on framwork_2">
//                       <div className="business_detail">
//                         <div className="">
//                           <div className="heading">
//                             <h4>Company</h4>
//                           </div>
//                           <hr className="line"></hr>
//                           <div className="saved_cards">
//                             <div className="business_detail mb-4">
//                               <div className="heading">
//                                 <div className="heading_wth_text">
//                                   <div className="d-flex">
//                                     <span className="global_link mx-0">
//                                       <NavLink
//                                         className="non_underline_link bold"
//                                         to="/add_question"
//                                       >
//                                         <button
//                                           className="new_button_style"
//                                           variant="none"
//                                           to="/add_question"
//                                         >
//                                           ADD Questions
//                                         </button>
//                                       </NavLink>
//                                     </span>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="table_f">
//                               <Table striped bordered hover size="sm">
//                                 <thead>
//                                   <tr className="heading_color">
//                                     <th style={{ width: "5%" }}>Sr.</th>
//                                     <th>Framework</th>
//                                     <th style={{ width: "5%" }}>View </th>
//                                   </tr>
//                                 </thead>
//                                 <tbody>
//                                   <tr>
//                                     <td>1</td>
//                                     <td>question List 1</td>
//                                     <td>
//                                       <NavLink
//                                         className="non_underline_link bold view_c"
//                                         to="/question-list"
//                                       >
//                                         non_underline_link bold view_c
//                                       </NavLink>
//                                     </td>
//                                   </tr>
//                                   <tr>
//                                     <td>2</td>
//                                     <td>question List 2</td>
//                                     <td>
//                                       <NavLink
//                                         className="non_underline_link bold view_c"
//                                         to="/question-list"
//                                       >
//                                         non_underline_link bold view_c
//                                       </NavLink>
//                                     </td>
//                                   </tr>
//                                   <tr>
//                                     <td>3</td>
//                                     <td>question List 3</td>
//                                     <td>
//                                       <NavLink
//                                         className="non_underline_link bold view_c"
//                                         to="/question-list"
//                                       >
//                                         non_underline_link bold view_c
//                                       </NavLink>
//                                     </td>
//                                   </tr>
//                                 </tbody>
//                               </Table>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </section>
//         </div>
//       </div>
//     </div>
//   </div>
// );
//                                 }

export { };