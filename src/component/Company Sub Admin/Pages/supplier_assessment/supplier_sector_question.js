import React, { Component, useEffect, useState } from "react";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
// import Loader from "../../../loader/Loader";
import AssignQuestions from "./ AssignQuestions";
import axios from "axios";
import NumericInput from "react-numeric-input";
import "./supplier_assessment.css";
import config from "../../../../config/config.json";
import { Form, Accordion } from "react-bootstrap";
import SectorQuestionTab from "./SectorQuestionTab";
import QuestionTypeTabSection from "./QuestionTypeTabSection";
import TebularInputCard from "./TebularInputCard";
import TrandsInputCard from "./TrandsInputCard";
import swal from "sweetalert";
import AssignQuestions from './../../Component/Sector Questions/AssignQuestions';

export default function supplier_sector_question(props) {
  return (
    <div>supplier_sector_question</div>
  )
}
