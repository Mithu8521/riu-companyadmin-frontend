import { sweetAlert } from '../../../../utils/UniversalFunction';
import axios from "axios";
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Image } from "react-bootstrap";
import { saveAs } from "file-saver";
import Sustainable1 from "../../../../img/E_SDG_PRINT-01.jpg";
import Sustainable2 from "../../../../img/E_SDG_PRINT-02.jpg";
import Sustainable3 from "../../../../img/E_SDG_PRINT-03.jpg";
import Sustainable4 from "../../../../img/E_SDG_PRINT-04.jpg";
import Sustainable5 from "../../../../img/E_SDG_PRINT-05.jpg";
import Sustainable6 from "../../../../img/E_SDG_PRINT-06.jpg";
import Sustainable7 from "../../../../img/E_SDG_PRINT-07.jpg";
import Sustainable8 from "../../../../img/E_SDG_PRINT-08.jpg";
import Sustainable9 from "../../../../img/E_SDG_PRINT-09.jpg";
import Sustainable10 from "../../../../img/E_SDG_PRINT-10.jpg";
import Sustainable11 from "../../../../img/E_SDG_PRINT-11.jpg";
import Sustainable12 from "../../../../img/E_SDG_PRINT-12.jpg";
import Sustainable13 from "../../../../img/E_SDG_PRINT-13.jpg";
import Sustainable14 from "../../../../img/E_SDG_PRINT-14.jpg";
import Sustainable15 from "../../../../img/E_SDG_PRINT-15.jpg";
import Sustainable16 from "../../../../img/E_SDG_PRINT-16.jpg";
import Sustainable17 from "../../../../img/E_SDG_PRINT-17.jpg";
import {
  faLightbulb,
} from "@fortawesome/free-solid-svg-icons";
// import {
//   faAccessibleIcon,
//   faDropbox,
// } from "@fortawesome/free-brands-svg-icons";
import "./sustainable.css";
import config from "../../../../config/config.json";

import { authenticationService } from "../../../../_services/authentication";
import AssignSubAdminComponent from "../SmallComponents/assignSubAdmin";
const currentUser = authenticationService.currentUserValue;

export default class sustainable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      submitted: false,
      noPoverty: false,
      noPovertyDesc: null,
      zeroHunger: false,
      zeroHungerDesc: null,
      goodHealth: false,
      goodHealthDesc: null,
      qualityEducation: false,
      qualityEducationDesc: null,
      genderEquality: false,
      genderEqualityDesc: null,
      cleanWater: false,
      cleanWaterDesc: null,
      affordable: false,
      affordableDesc: null,
      decentWork: false,
      decentWorkDesc: null,
      industryInnovation: false,
      industryInnovationDesc: null,
      reducedInqualites: false,
      reducedInqualitesDesc: null,
      sustainableCities: false,
      sustainableCitiesDesc: null,
      responsibleConsumption: false,
      responsibleConsumptionDesc: null,
      climateAction: false,
      climateActionDesc: null,

      lifeBelowWater: false,
      lifeBelowWaterDesc: null,
      lifeOnLand: false,
      lifeOnLandDesc: null,
      peace: false,
      peaceDesc: null,
      partnership: false,
      partnershipDesc: null,
      selectedUser: [],
      downloadReport: false,
      isCompanySubAdminSubmit: false,
      isCompanyAdminSubmit: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.serverRequest = this.serverRequest.bind(this);
    this.downloadReport = this.downloadReport.bind(this);

  }



  showAlert = () => {
    sweetAlert('info', "The Report will be uploaded within next 48 hours");
  };

  handleMultiSelect = (event, data) => {
    const { name, checked } = event.target;
    this.setState({ [name]: checked });
    if (checked) {
      this.setState({
        selectedUser: [...this.state.selectedUser, data],
      });
    } else {
      let tempuser = this.state.selectedUser?.filter(
        (item) => Number(item) !== Number(data)
      );
      this.setState({
        selectedUser: tempuser,
      });
    }
  };



  downloadReport(event) {
    event.preventDefault();
    this.setState({ submitted: true });
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    axios
      .post(
        config.API_URL + "downloadReport",
        {
          section_name: 'sustainable',
          sub_section: 'sustainable',
          current_role: localStorage.getItem("role"),
        },
        { headers }
      )
      .then((response) => {
        let url = config.BASE_URL + response?.data?.data?.file;
        if (response?.data?.data?.file) {
          saveAs(
            url,
            url
          );
        } else {
          this.showAlert()
        }
      })
      .catch(function (error) {
        if (error.response) {
          sweetAlert('error', error.response.data.message);
        }
      });

  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }

  removeArray(data) {
    let noPovertyC =
      data.result.noPoverty === undefined
        ? false
        : data.result.noPoverty === 1
          ? true
          : false;
    let zeroHungerC =
      data.result.zeroHunger === undefined
        ? false
        : data.result.zeroHunger === 1
          ? true
          : false;
    let goodHealthC =
      data.result.goodHealth === undefined
        ? false
        : data.result.goodHealth === 1
          ? true
          : false;
    let qualityEducationC =
      data.result.qualityEducation === undefined
        ? false
        : data.result.qualityEducation === 1
          ? true
          : false;
    let genderEqualityC =
      data.result.genderEquality === undefined
        ? false
        : data.result.genderEquality === 1
          ? true
          : false;
    let cleanWaterC =
      data.result.cleanWater === undefined
        ? false
        : data.result.cleanWater === 1
          ? true
          : false;
    let affordableC =
      data.result.affordable === undefined
        ? false
        : data.result.affordable === 1
          ? true
          : false;
    let decentWorkC =
      data.result.decentWork === undefined
        ? false
        : data.result.decentWork === 1
          ? true
          : false;
    let industryInnovationC =
      data.result.industryInnovation === undefined
        ? false
        : data.result.industryInnovation === 1
          ? true
          : false;
    let reducedInqualitesC =
      data.result.reducedInqualites === undefined
        ? false
        : data.result.reducedInqualites === 1
          ? true
          : false;
    let sustainableCitiesC =
      data.result.sustainableCities === undefined
        ? false
        : data.result.sustainableCities === 1
          ? true
          : false;
    let responsibleConsumptionC =
      data.result.responsibleConsumption === undefined
        ? false
        : data.result.responsibleConsumption === 1
          ? true
          : false;
    let climateActionC =
      data.result.climateAction === undefined
        ? false
        : data.result.climateAction === 1
          ? true
          : false;
    let lifeBelowWaterC =
      data.result.lifeBelowWater === undefined
        ? false
        : data.result.lifeBelowWater === 1
          ? true
          : false;
    let lifeOnLandC =
      data.result.lifeOnLand === undefined
        ? false
        : data.result.lifeOnLand === 1
          ? true
          : false;
    let peaceC =
      data.result.peace === undefined
        ? false
        : data.result.peace === 1
          ? true
          : false;
    let partnershipC =
      data.result.partnership === undefined
        ? false
        : data.result.partnership === 1
          ? true
          : false;
    if (noPovertyC === true) {
      this.state.selectedUser.push(1);
    } else {
      this.state.selectedUser.slice(0, 1);
    }
    if (zeroHungerC === true) {
      this.state.selectedUser.push(2);
    } else {
      this.state.selectedUser.slice(1, 1);
    }
    if (goodHealthC === true) {
      this.state.selectedUser.push(3);
    } else {
      this.state.selectedUser.slice(2, 1);
    }
    if (qualityEducationC === true) {
      this.state.selectedUser.push(4);
    } else {
      this.state.selectedUser.slice(3, 1);
    }
    if (genderEqualityC === true) {
      this.state.selectedUser.push(5);
    } else {
      this.state.selectedUser.slice(4, 1);
    }
    if (cleanWaterC === true) {
      this.state.selectedUser.push(6);
    } else {
      this.state.selectedUser.slice(5, 1);
    }
    if (affordableC === true) {
      this.state.selectedUser.push(7);
    } else {
      this.state.selectedUser.slice(6, 1);
    }
    if (decentWorkC === true) {
      this.state.selectedUser.push(8);
    } else {
      this.state.selectedUser.slice(7, 1);
    }
    if (industryInnovationC === true) {
      this.state.selectedUser.push(9);
    } else {
      this.state.selectedUser.slice(8, 1);
    }
    if (reducedInqualitesC === true) {
      this.state.selectedUser.push(10);
    } else {
      this.state.selectedUser.slice(9, 1);
    }
    if (sustainableCitiesC === true) {
      this.state.selectedUser.push(11);
    } else {
      this.state.selectedUser.slice(10, 1);
    }
    if (responsibleConsumptionC === true) {
      this.state.selectedUser.push(12);
    } else {
      this.state.selectedUser.slice(11, 1);
    }
    if (climateActionC === true) {
      this.state.selectedUser.push(13);
    } else {
      this.state.selectedUser.slice(12, 1);
    }
    if (lifeBelowWaterC === true) {
      this.state.selectedUser.push(14);
    } else {
      this.state.selectedUser.slice(13, 1);
    }
    if (lifeOnLandC === true) {
      this.state.selectedUser.push(15);
    } else {
      this.state.selectedUser.slice(14, 1);
    }

    if (peaceC === true) {
      this.state.selectedUser.push(16);
    } else {
      this.state.selectedUser.slice(15, 1);
    }

    if (partnershipC === true) {
      this.state.selectedUser.push(17);
    } else {
      this.state.selectedUser.slice(16, 1);
    }
  }

  serverRequest() {
    this.setState({ submitted: true });
    const {
      noPoverty,
      noPovertyDesc,
      zeroHunger,
      zeroHungerDesc,
      goodHealth,
      goodHealthDesc,
      qualityEducation,
      qualityEducationDesc,
      genderEquality,
      genderEqualityDesc,
      cleanWater,
      cleanWaterDesc,
      affordable,
      affordableDesc,
      decentWork,
      decentWorkDesc,
      industryInnovation,
      industryInnovationDesc,
      reducedInqualites,
      reducedInqualitesDesc,
      sustainableCities,
      sustainableCitiesDesc,
      responsibleConsumption,
      responsibleConsumptionDesc,
      climateAction,
      climateActionDesc,
      lifeBelowWater,
      lifeBelowWaterDesc,
      lifeOnLand,
      lifeOnLandDesc,
      peace,
      peaceDesc,
      partnership,
      partnershipDesc,
    } = this.state;
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    axios
      .post(
        config.OLD_API_URL + "sustainableManagement",
        {
          noPoverty: noPoverty,
          noPovertyDesc: noPovertyDesc,
          zeroHunger: zeroHunger,
          zeroHungerDesc: zeroHungerDesc,
          goodHealth: goodHealth,
          goodHealthDesc: goodHealthDesc,
          qualityEducation: qualityEducation,
          qualityEducationDesc: qualityEducationDesc,
          genderEquality: genderEquality,
          genderEqualityDesc: genderEqualityDesc,
          cleanWater: cleanWater,
          cleanWaterDesc: cleanWaterDesc,
          affordable: affordable,
          affordableDesc: affordableDesc,
          decentWork: decentWork,
          decentWorkDesc: decentWorkDesc,
          industryInnovation: industryInnovation,
          industryInnovationDesc: industryInnovationDesc,
          reducedInqualites: reducedInqualites,
          reducedInqualitesDesc: reducedInqualitesDesc,
          sustainableCities: sustainableCities,
          sustainableCitiesDesc: sustainableCitiesDesc,
          responsibleConsumption: responsibleConsumption,
          responsibleConsumptionDesc: responsibleConsumptionDesc,
          climateAction: climateAction,
          climateActionDesc: climateActionDesc,
          lifeBelowWater: lifeBelowWater,
          lifeBelowWaterDesc: lifeBelowWaterDesc,
          lifeOnLand: lifeOnLand,
          lifeOnLandDesc: lifeOnLandDesc,
          peace: peace,
          peaceDesc: peaceDesc,
          partnership: partnership,
          partnershipDesc: partnershipDesc,
          current_role: localStorage.getItem("role"),
        },
        { headers }
      )
      .then((response) => { })
      .catch(function (error) {
        if (error.response) {
          sweetAlert('error', error.response.data.message);
        }
      });
  }
  handleSubmit(event) {
    event.preventDefault();
    this.setState({ submitted: true });
    const {
      noPoverty,
      noPovertyDesc,
      zeroHunger,
      zeroHungerDesc,
      goodHealth,
      goodHealthDesc,
      qualityEducation,
      qualityEducationDesc,
      genderEquality,
      genderEqualityDesc,
      cleanWater,
      cleanWaterDesc,
      affordable,
      affordableDesc,
      decentWork,
      decentWorkDesc,
      industryInnovation,
      industryInnovationDesc,
      reducedInqualites,
      reducedInqualitesDesc,
      sustainableCities,
      sustainableCitiesDesc,
      responsibleConsumption,
      responsibleConsumptionDesc,
      climateAction,
      climateActionDesc,
      lifeBelowWater,
      lifeBelowWaterDesc,
      lifeOnLand,
      lifeOnLandDesc,
      peace,
      peaceDesc,
      partnership,
      partnershipDesc,
    } = this.state;
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    axios
      .post(
        config.OLD_API_URL + "sustainableManagement",
        {
          noPoverty: noPoverty,
          noPovertyDesc: noPovertyDesc,
          zeroHunger: zeroHunger,
          zeroHungerDesc: zeroHungerDesc,
          goodHealth: goodHealth,
          goodHealthDesc: goodHealthDesc,
          qualityEducation: qualityEducation,
          qualityEducationDesc: qualityEducationDesc,
          genderEquality: genderEquality,
          genderEqualityDesc: genderEqualityDesc,
          cleanWater: cleanWater,
          cleanWaterDesc: cleanWaterDesc,
          affordable: affordable,
          affordableDesc: affordableDesc,
          decentWork: decentWork,
          decentWorkDesc: decentWorkDesc,
          industryInnovation: industryInnovation,
          industryInnovationDesc: industryInnovationDesc,
          reducedInqualites: reducedInqualites,
          reducedInqualitesDesc: reducedInqualitesDesc,
          sustainableCities: sustainableCities,
          sustainableCitiesDesc: sustainableCitiesDesc,
          responsibleConsumption: responsibleConsumption,
          responsibleConsumptionDesc: responsibleConsumptionDesc,
          climateAction: climateAction,
          climateActionDesc: climateActionDesc,
          lifeBelowWater: lifeBelowWater,
          lifeBelowWaterDesc: lifeBelowWaterDesc,
          lifeOnLand: lifeOnLand,
          lifeOnLandDesc: lifeOnLandDesc,
          peace: peace,
          peaceDesc: peaceDesc,
          partnership: partnership,
          partnershipDesc: partnershipDesc,
          current_role: localStorage.getItem("role"),
        },
        { headers }
      )
      .then((response) => {
        sweetAlert('success', response.data.message);
        this.setState({
          downloadReport: true,
        });
      })
      .catch(function (error) {
        if (error.response) {
          sweetAlert('error', error.response.data.message);
        }
      });
  }

  // componentDidMount() {
  //   // window.scrollTo(0, 0);
  //   window.scrollTo({
  //     top: 400,
  //     behavior: "smooth",
  //   });
  //   const headers = {
  //     Authorization: `Bearer ${localStorage.getItem("token")}`,
  //     Accept: "application/json",
  //   };
  //   fetch(config.API_URL + `sustainableAnswersApi`, { headers })
  //     .then((res) => res.json())
  //     .then(
  //       (result) => {
  //         this.removeArray(result);
  //         if (result.result.length === undefined) {
  //           this.setState({
  //             downloadReport: true,
  //           });
  //         }
  //         let role = JSON.parse(localStorage.getItem("currentUser")).data.role;
  //         if (role === "company_sub_admin") {
  //           let getTempId = JSON.parse(localStorage.getItem("user_temp_id"));
  //           if (getTempId === result.result.assigned_user_id) {
  //             this.setState({
  //               isCompanySubAdminSubmit: true,
  //             });
  //           }
  //         } else {
  //           this.setState({
  //             isCompanyAdminSubmit: true,
  //           });
  //         }

  //         this.setState({
  //           isLoaded: true,
  //           noPoverty:
  //             result.result.noPoverty === undefined
  //               ? false
  //               : result.result.noPoverty === 1
  //               ? true
  //               : false,
  //           noPovertyDesc:
  //             result.result.noPovertyDesc === undefined
  //               ? null
  //               : result.result.noPovertyDesc == null
  //               ? null
  //               : result.result.noPovertyDesc,

  //           zeroHunger:
  //             result.result.zeroHunger === undefined
  //               ? false
  //               : result.result.zeroHunger === 1
  //               ? true
  //               : false,
  //           zeroHungerDesc:
  //             result.result.zeroHungerDesc === undefined
  //               ? null
  //               : result.result.zeroHungerDesc == null
  //               ? null
  //               : result.result.zeroHungerDesc,

  //           goodHealth:
  //             result.result.goodHealth === undefined
  //               ? false
  //               : result.result.goodHealth === 1
  //               ? true
  //               : false,
  //           goodHealthDesc:
  //             result.result.goodHealthDesc === undefined
  //               ? null
  //               : result.result.goodHealthDesc == null
  //               ? null
  //               : result.result.goodHealthDesc,

  //           qualityEducation:
  //             result.result.qualityEducation === undefined
  //               ? false
  //               : result.result.qualityEducation === 1
  //               ? true
  //               : false,
  //           qualityEducationDesc:
  //             result.result.qualityEducationDesc === undefined
  //               ? null
  //               : result.result.qualityEducationDesc == null
  //               ? null
  //               : result.result.qualityEducationDesc,

  //           genderEquality:
  //             result.result.genderEquality === undefined
  //               ? false
  //               : result.result.genderEquality === 1
  //               ? true
  //               : false,
  //           genderEqualityDesc:
  //             result.result.genderEqualityDesc === undefined
  //               ? null
  //               : result.result.genderEqualityDesc == null
  //               ? null
  //               : result.result.genderEqualityDesc,

  //           cleanWater:
  //             result.result.cleanWater === undefined
  //               ? false
  //               : result.result.cleanWater === 1
  //               ? true
  //               : false,
  //           cleanWaterDesc:
  //             result.result.cleanWaterDesc === undefined
  //               ? null
  //               : result.result.cleanWaterDesc == null
  //               ? null
  //               : result.result.cleanWaterDesc,

  //           affordable:
  //             result.result.affordable === undefined
  //               ? false
  //               : result.result.affordable === 1
  //               ? true
  //               : false,
  //           affordableDesc:
  //             result.result.affordableDesc === undefined
  //               ? null
  //               : result.result.affordableDesc == null
  //               ? null
  //               : result.result.affordableDesc,

  //           decentWork:
  //             result.result.decentWork === undefined
  //               ? false
  //               : result.result.decentWork === 1
  //               ? true
  //               : false,
  //           decentWorkDesc:
  //             result.result.decentWorkDesc === undefined
  //               ? null
  //               : result.result.decentWorkDesc == null
  //               ? null
  //               : result.result.decentWorkDesc,

  //           industryInnovation:
  //             result.result.industryInnovation === undefined
  //               ? false
  //               : result.result.industryInnovation === 1
  //               ? true
  //               : false,
  //           industryInnovationDesc:
  //             result.result.industryInnovationDesc === undefined
  //               ? null
  //               : result.result.industryInnovationDesc == null
  //               ? null
  //               : result.result.industryInnovationDesc,

  //           reducedInqualites:
  //             result.result.reducedInqualites === undefined
  //               ? false
  //               : result.result.reducedInqualites === 1
  //               ? true
  //               : false,
  //           reducedInqualitesDesc:
  //             result.result.reducedInqualitesDesc === undefined
  //               ? null
  //               : result.result.reducedInqualitesDesc == null
  //               ? null
  //               : result.result.reducedInqualitesDesc,

  //           sustainableCities:
  //             result.result.sustainableCities === undefined
  //               ? false
  //               : result.result.sustainableCities === 1
  //               ? true
  //               : false,
  //           sustainableCitiesDesc:
  //             result.result.sustainableCitiesDesc === undefined
  //               ? null
  //               : result.result.sustainableCitiesDesc == null
  //               ? null
  //               : result.result.sustainableCitiesDesc,

  //           responsibleConsumption:
  //             result.result.responsibleConsumption === undefined
  //               ? false
  //               : result.result.responsibleConsumption === 1
  //               ? true
  //               : false,
  //           responsibleConsumptionDesc:
  //             result.result.responsibleConsumptionDesc === undefined
  //               ? null
  //               : result.result.responsibleConsumptionDesc == null
  //               ? null
  //               : result.result.responsibleConsumptionDesc,

  //           climateAction:
  //             result.result.climateAction === undefined
  //               ? false
  //               : result.result.climateAction === 1
  //               ? true
  //               : false,
  //           climateActionDesc:
  //             result.result.climateActionDesc === undefined
  //               ? null
  //               : result.result.climateActionDesc == null
  //               ? null
  //               : result.result.climateActionDesc,

  //           lifeBelowWater:
  //             result.result.lifeBelowWater === undefined
  //               ? false
  //               : result.result.lifeBelowWater === 1
  //               ? true
  //               : false,
  //           lifeBelowWaterDesc:
  //             result.result.lifeBelowWaterDesc === undefined
  //               ? null
  //               : result.result.lifeBelowWaterDesc == null
  //               ? null
  //               : result.result.lifeBelowWaterDesc,

  //           lifeOnLand:
  //             result.result.lifeOnLand === undefined
  //               ? false
  //               : result.result.lifeOnLand === 1
  //               ? true
  //               : false,
  //           lifeOnLandDesc:
  //             result.result.lifeOnLandDesc === undefined
  //               ? null
  //               : result.result.lifeOnLandDesc == null
  //               ? null
  //               : result.result.lifeOnLandDesc,

  //           peace:
  //             result.result.peace === undefined
  //               ? false
  //               : result.result.peace === 1
  //               ? true
  //               : false,
  //           peaceDesc:
  //             result.result.peaceDesc === undefined
  //               ? null
  //               : result.result.peaceDesc == null
  //               ? null
  //               : result.result.peaceDesc,

  //           partnership:
  //             result.result.partnership === undefined
  //               ? false
  //               : result.result.partnership === 1
  //               ? true
  //               : false,
  //           partnershipDesc:
  //             result.result.partnershipDesc === undefined
  //               ? null
  //               : result.result.partnershipDesc == null
  //               ? null
  //               : result.result.partnershipDesc,
  //         });
  //       },
  //       (error) => {
  //         this.setState({
  //           isLoaded: true,
  //           error,
  //         });
  //       }
  //     );
  // }

  componentDidMount() {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    fetch(config.API_URL + `sustainableAnswersApi?current_role=${localStorage.getItem("role")}`, { headers })
      .then((res) => res.json())
      .then(
        (result) => {
          this.removeArray(result);
          if (result.result.length === undefined) {
            this.setState({
              downloadReport: false,
            });
          }
          this.setState({
            isLoaded: true,
            noPoverty:
              result.result.noPoverty === undefined
                ? false
                : result.result.noPoverty === 1
                  ? true
                  : false,
            noPovertyDesc:
              result.result.noPovertyDesc === undefined
                ? null
                : result.result.noPovertyDesc == null
                  ? null
                  : result.result.noPovertyDesc,

            zeroHunger:
              result.result.zeroHunger === undefined
                ? false
                : result.result.zeroHunger === 1
                  ? true
                  : false,
            zeroHungerDesc:
              result.result.zeroHungerDesc === undefined
                ? null
                : result.result.zeroHungerDesc == null
                  ? null
                  : result.result.zeroHungerDesc,

            goodHealth:
              result.result.goodHealth === undefined
                ? false
                : result.result.goodHealth === 1
                  ? true
                  : false,
            goodHealthDesc:
              result.result.goodHealthDesc === undefined
                ? null
                : result.result.goodHealthDesc == null
                  ? null
                  : result.result.goodHealthDesc,

            qualityEducation:
              result.result.qualityEducation === undefined
                ? false
                : result.result.qualityEducation === 1
                  ? true
                  : false,
            qualityEducationDesc:
              result.result.qualityEducationDesc === undefined
                ? null
                : result.result.qualityEducationDesc == null
                  ? null
                  : result.result.qualityEducationDesc,

            genderEquality:
              result.result.genderEquality === undefined
                ? false
                : result.result.genderEquality === 1
                  ? true
                  : false,
            genderEqualityDesc:
              result.result.genderEqualityDesc === undefined
                ? null
                : result.result.genderEqualityDesc == null
                  ? null
                  : result.result.genderEqualityDesc,

            cleanWater:
              result.result.cleanWater === undefined
                ? false
                : result.result.cleanWater === 1
                  ? true
                  : false,
            cleanWaterDesc:
              result.result.cleanWaterDesc === undefined
                ? null
                : result.result.cleanWaterDesc == null
                  ? null
                  : result.result.cleanWaterDesc,

            affordable:
              result.result.affordable === undefined
                ? false
                : result.result.affordable === 1
                  ? true
                  : false,
            affordableDesc:
              result.result.affordableDesc === undefined
                ? null
                : result.result.affordableDesc == null
                  ? null
                  : result.result.affordableDesc,

            decentWork:
              result.result.decentWork === undefined
                ? false
                : result.result.decentWork === 1
                  ? true
                  : false,
            decentWorkDesc:
              result.result.decentWorkDesc === undefined
                ? null
                : result.result.decentWorkDesc == null
                  ? null
                  : result.result.decentWorkDesc,

            industryInnovation:
              result.result.industryInnovation === undefined
                ? false
                : result.result.industryInnovation === 1
                  ? true
                  : false,
            industryInnovationDesc:
              result.result.industryInnovationDesc === undefined
                ? null
                : result.result.industryInnovationDesc == null
                  ? null
                  : result.result.industryInnovationDesc,

            reducedInqualites:
              result.result.reducedInqualites === undefined
                ? false
                : result.result.reducedInqualites === 1
                  ? true
                  : false,
            reducedInqualitesDesc:
              result.result.reducedInqualitesDesc === undefined
                ? null
                : result.result.reducedInqualitesDesc == null
                  ? null
                  : result.result.reducedInqualitesDesc,

            sustainableCities:
              result.result.sustainableCities === undefined
                ? false
                : result.result.sustainableCities === 1
                  ? true
                  : false,
            sustainableCitiesDesc:
              result.result.sustainableCitiesDesc === undefined
                ? null
                : result.result.sustainableCitiesDesc == null
                  ? null
                  : result.result.sustainableCitiesDesc,

            responsibleConsumption:
              result.result.responsibleConsumption === undefined
                ? false
                : result.result.responsibleConsumption === 1
                  ? true
                  : false,
            responsibleConsumptionDesc:
              result.result.responsibleConsumptionDesc === undefined
                ? null
                : result.result.responsibleConsumptionDesc == null
                  ? null
                  : result.result.responsibleConsumptionDesc,

            climateAction:
              result.result.climateAction === undefined
                ? false
                : result.result.climateAction === 1
                  ? true
                  : false,
            climateActionDesc:
              result.result.climateActionDesc === undefined
                ? null
                : result.result.climateActionDesc == null
                  ? null
                  : result.result.climateActionDesc,

            lifeBelowWater:
              result.result.lifeBelowWater === undefined
                ? false
                : result.result.lifeBelowWater === 1
                  ? true
                  : false,
            lifeBelowWaterDesc:
              result.result.lifeBelowWaterDesc === undefined
                ? null
                : result.result.lifeBelowWaterDesc == null
                  ? null
                  : result.result.lifeBelowWaterDesc,

            lifeOnLand:
              result.result.lifeOnLand === undefined
                ? false
                : result.result.lifeOnLand === 1
                  ? true
                  : false,
            lifeOnLandDesc:
              result.result.lifeOnLandDesc === undefined
                ? null
                : result.result.lifeOnLandDesc == null
                  ? null
                  : result.result.lifeOnLandDesc,

            peace:
              result.result.peace === undefined
                ? false
                : result.result.peace === 1
                  ? true
                  : false,
            peaceDesc:
              result.result.peaceDesc === undefined
                ? null
                : result.result.peaceDesc == null
                  ? null
                  : result.result.peaceDesc,

            partnership:
              result.result.partnership === undefined
                ? false
                : result.result.partnership === 1
                  ? true
                  : false,
            partnershipDesc:
              result.result.partnershipDesc === undefined
                ? null
                : result.result.partnershipDesc == null
                  ? null
                  : result.result.partnershipDesc,
            isEditableOrNot: result?.insertOrUpdate,
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }
  render() {
    const {
      selectedUser,
    } = this.state;
    return (
      <div>
        <Sidebar dataFromParent={this.props.location.pathname} />
        <Header />
        <div className="main_wrapper">
          <div className="inner_wraapper">
            <div className="container-fluid">
              <section className="d_text">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="requirem">
                        <div className="text_Parts">
                          <div className="d-flex justify-content-between">
                            <h5 className="motor">Introduction</h5>
                            <div className="form_x mb-3">
                              {currentUser.data.role === "company_admin" && (
                                <AssignSubAdminComponent tableName="sustainable" />
                              )}
                            </div>
                          </div>

                          <div className="text_interlinked">
                            <p className="interlinked">

                              The <strong>
                                Sustainable Development Goals
                              </strong>
                              (SDGs) are a collection of 17 interlinked global
                              goals designed to be a "blueprint to achieve a
                              better and more sustainable future for all”. The
                              SDGs were set up in 2015 by the United Nations
                              General Assembly and are intended to be achieved
                              by the year 2030. They are included in a UN
                              Resolution called the
                              &nbsp;<strong>2030 Agenda.</strong>
                            </p>
                            <p className="towards my-3">
                              Not all of the Goals require a response - Only the
                              ones which you feel your business can have a
                              positive impact towards…
                            </p>
                          </div>
                          <div className="addres border_box p-5">
                            <p className="addres_p font-increase mt-3">
                              <span className="finan">
                                <i className="fas fa-quote-left"></i>
                              </span>
                              As CEOs, we want to create long term value to
                              shareholders by delivering solid returns for
                              shareholders AND by operating a sustainable
                              business model that addresses the long term goals
                              of (the) society, as provided for in the SDG
                              roadmap. At the same time, data on responsible
                              business and sustainability is proliferating,
                              enabling companies to better understand their
                              impact and implement responsible strategies. What
                              we seek is a general framework for companies to
                              demonstrate their long term sustainability; a
                              framework that integrates financial metrics along
                              with relevant non financial criteria such as ESG
                              considerations, gender equality, compensation
                              practices, supply chain management, and other
                              activities..
                            </p>
                            <p className="Brian fw-bold">
                              - Brian Moynihan, Chairman and CEO Bank of America
                            </p>
                            <div className="text_Parts">
                              <div className="text_ntroion">
                                {/* {items.map((item, key) => ( */}

                                <button
                                  onClick={this.downloadReport}
                                  className="next_page_one"
                                  title="The Report will be uploaded within next 48 hours"
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  type="button"
                                >
                                  <span className="Download_r">
                                    <i className="fa fa-download"></i>
                                  </span>
                                  Download Report
                                </button>
                                <NavLink className="" to="/sustainable">
                                  <button
                                    className="re-submit1 mx-3"
                                    type="button"
                                  >
                                    Re-submit responses
                                  </button>
                                </NavLink>
                              </div>
                            </div>
                          </div>
                          <form name="form" onSubmit={this.handleSubmit}>
                            <div className="my-5">
                              <div className="of_America">
                                <div className="row">
                                  <div className="col-xxl-4 col-lg-4 col-md-12 col-12">
                                    <div className="chairamw">
                                      <div className="image_icon">
                                        <p className="demons">
                                          <FontAwesomeIcon
                                            className="far"
                                            icon={faLightbulb}
                                          />
                                        </p>
                                        <p className="demons_te">
                                          Sustainable Development Goal
                                        </p>
                                      </div>
                                      <div className="image_text">
                                        <p className="Developme">
                                          Sustainable <br />
                                          Development Goal
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-xxl-2 col-lg-6 col-md-12 col-12">
                                    <div className="impa">
                                      <p className="can_bus text-center">
                                        Can your business <br />
                                        make a positive impact?
                                      </p>
                                    </div>
                                  </div>
                                  <div className="col-xxl-6 col-lg-2 col-md-12 col-12">
                                    <div className="chairam">
                                      <p className="omne impa">Response</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="of_Americat">
                                <div className="row">
                                  <div className="col-xxl-4 col-lg-10 col-md-12 col-12">
                                    <div className="chairamw">
                                      <div className="image_icon_red">
                                        <p className="demons">
                                          <Image
                                            className="img-fluid"
                                            src={Sustainable1}
                                          />
                                        </p>
                                      </div>
                                      <div className="image_text">
                                        <h5 className="Pove_rty">No Poverty</h5>
                                        <p className="Developme">
                                          Access to basic human needs of health, education and sanitation
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-xxl-2 col-lg-2 col-md-12 col-12">
                                    <div className="impa">
                                      <label className="switch">
                                        <input
                                          name="noPoverty"
                                          type="checkbox"
                                          onChange={(e) =>
                                            this.handleMultiSelect(e, 1)
                                          }
                                          checked={selectedUser?.some(
                                            (eenvironment) =>
                                              Number(eenvironment) === 1
                                          )}
                                        />
                                        <span className="slider round"></span>
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                    <div className="chairam">
                                      <div className="omne">
                                        <div className="input-group">
                                          <textarea
                                            className="form-control nopel"
                                            rows="6"
                                            disabled={(this.state.noPoverty === false) ? true : false}
                                            name="noPovertyDesc"
                                            onChange={this.handleChange}
                                            defaultValue={
                                              this.state.noPovertyDesc
                                            }
                                          ></textarea>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <hr className="human" />
                              </div>
                              <div className="of_Americat">
                                <div className="row">
                                  <div className="col-xxl-4 col-lg-10 col-md-12 col-12">
                                    <div className="chairamw">
                                      <div className="image_icon_red">
                                        <p className="demons1">
                                          <Image
                                            className="img-fluid"
                                            src={Sustainable2}
                                          />
                                        </p>
                                      </div>
                                      <div className="image_text">
                                        <h5 className="Pove_rty">
                                          Zero Hunger
                                        </h5>
                                        <p className="Developme">
                                          Providing food and humanitarian relief, establishing sustainable food production
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-xxl-2 col-lg-2 col-md-12 col-12">
                                    <div className="impa">
                                      <label className="switch">
                                        <input
                                          type="checkbox"
                                          onChange={(e) =>
                                            this.handleMultiSelect(e, 2)
                                          }
                                          checked={selectedUser?.some(
                                            (eenvironment) =>
                                              Number(eenvironment) === 2
                                          )}
                                          name="zeroHunger"
                                        />
                                        <span className="slider round"></span>
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                    <div className="chairam">
                                      <div className="omne">
                                        <div className="input-group">
                                          <textarea
                                            className="form-control nopel"
                                            rows="6"
                                            disabled={(this.state.zeroHunger === false) ? true : false}
                                            name="zeroHungerDesc"
                                            onChange={this.handleChange}
                                            defaultValue={
                                              this.state.zeroHungerDesc
                                            }
                                          ></textarea>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <hr className="human" />
                              </div>
                              <div className="of_Americat">
                                <div className="row">
                                  <div className="col-xxl-4 col-lg-10 col-md-12 col-12">
                                    <div className="chairamw">
                                      <div className="image_icon_red">
                                        <p className="demons">
                                          <Image
                                            className="img-fluid"
                                            src={Sustainable3}
                                          />
                                        </p>
                                      </div>
                                      <div className="image_text">
                                        <h5 className="Pove_rty">
                                          Good Health and Well-being
                                        </h5>
                                        <p className="Developme">
                                          Better, more accessible health systems to increase life-expectancy
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-xxl-2 col-lg-2 col-md-12 col-12">
                                    <div className="impa">
                                      <label className="switch">
                                        <input
                                          type="checkbox"
                                          onChange={(e) =>
                                            this.handleMultiSelect(e, 3)
                                          }
                                          checked={selectedUser?.some(
                                            (eenvironment) =>
                                              Number(eenvironment) === 3
                                          )}
                                          name="goodHealth"
                                        />
                                        <span className="slider round"></span>
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                    <div className="chairam">
                                      <div className="omne">
                                        <div className="input-group">
                                          <textarea
                                            className="form-control nopel"
                                            rows="6"
                                            disabled={(this.state.goodHealth === false) ? true : false}
                                            name="goodHealthDesc"
                                            onChange={this.handleChange}
                                            defaultValue={
                                              this.state.goodHealthDesc
                                            }
                                          ></textarea>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <hr className="human" />
                              </div>
                              <div className="of_Americat">
                                <div className="row">
                                  <div className="col-xxl-4 col-lg-10 col-md-12 col-12">
                                    <div className="chairamw">
                                      <div className="image_icon_red">
                                        <p className="demons">
                                          <Image
                                            className="img-fluid"
                                            src={Sustainable4}
                                          />
                                        </p>
                                      </div>
                                      <div className="image_text">
                                        <h5 className="Pove_rty">
                                          Quality Education
                                        </h5>
                                        <p className="Developme">
                                          Inclusive education to enable upward social mobility and end poverty
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-xxl-2 col-lg-2 col-md-12 col-12">
                                    <div className="impa">
                                      <label className="switch">
                                        <input
                                          type="checkbox"
                                          onChange={(e) =>
                                            this.handleMultiSelect(e, 4)
                                          }
                                          checked={selectedUser?.some(
                                            (eenvironment) =>
                                              Number(eenvironment) === 4
                                          )}
                                          name="qualityEducation"
                                        />
                                        <span className="slider round"></span>
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                    <div className="chairam">
                                      <div className="omne">
                                        <div className="input-group">
                                          <textarea
                                            className="form-control nopel"
                                            rows="6"
                                            disabled={(this.state.qualityEducation === false) ? true : false}
                                            name="qualityEducationDesc"
                                            onChange={this.handleChange}
                                            defaultValue={
                                              this.state.qualityEducationDesc
                                            }
                                          ></textarea>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <hr className="human" />
                              </div>
                              <div className="of_Americat">
                                <div className="row">
                                  <div className="col-xxl-4 col-lg-10 col-md-12 col-12">
                                    <div className="chairamw">
                                      <div className="image_icon_red">
                                        <p className="demons">
                                          <Image
                                            className="img-fluid"
                                            src={Sustainable5}
                                          />
                                        </p>
                                      </div>
                                      <div className="image_text">
                                        <h5 className="Pove_rty">
                                          Gender Equality
                                        </h5>
                                        <p className="Developme">
                                          Education regardless of gender, advancement of equality laws and fairer representation of women
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-xxl-2 col-lg-2 col-md-12 col-12">
                                    <div className="impa">
                                      <label className="switch">
                                        <input
                                          type="checkbox"
                                          onChange={(e) =>
                                            this.handleMultiSelect(e, 5)
                                          }
                                          checked={selectedUser?.some(
                                            (eenvironment) =>
                                              Number(eenvironment) === 5
                                          )}
                                          name="genderEquality"
                                        />
                                        <span className="slider round"></span>
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                    <div className="chairam">
                                      <div className="omne">
                                        <div className="input-group">
                                          <textarea
                                            className="form-control nopel"
                                            rows="6"
                                            name="genderEqualityDesc"
                                            disabled={(this.state.genderEquality === false) ? true : false}
                                            onChange={this.handleChange}
                                            defaultValue={
                                              this.state.genderEqualityDesc
                                            }
                                          ></textarea>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <hr className="human" />
                              </div>
                              <div className="of_Americat">
                                <div className="row">
                                  <div className="col-xxl-4 col-lg-10 col-md-12 col-12">
                                    <div className="chairamw">
                                      <div className="image_icon_red">
                                        <p className="demons">
                                          <Image
                                            className="img-fluid"
                                            src={Sustainable6}
                                          />
                                        </p>
                                      </div>
                                      <div className="image_text">
                                        <h5 className="Pove_rty">
                                          Clean Water and Sanitation
                                        </h5>
                                        <p className="Developme">
                                          Improving access for billions of people who lack these basic facilities
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-xxl-2 col-lg-2 col-md-12 col-12">
                                    <div className="impa">
                                      <label className="switch">
                                        <input
                                          type="checkbox"
                                          onChange={(e) =>
                                            this.handleMultiSelect(e, 6)
                                          }
                                          checked={selectedUser?.some(
                                            (eenvironment) =>
                                              Number(eenvironment) === 6
                                          )}
                                          name="cleanWater"
                                        />
                                        <span className="slider round"></span>
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                    <div className="chairam">
                                      <div className="omne">
                                        <div className="input-group">
                                          <textarea
                                            className="form-control nopel"
                                            rows="6"
                                            name="cleanWaterDesc"
                                            disabled={(this.state.cleanWater === false) ? true : false}
                                            onChange={this.handleChange}
                                            defaultValue={
                                              this.state.cleanWaterDesc
                                            }
                                          ></textarea>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <hr className="human" />
                              </div>
                              <div className="of_Americat">
                                <div className="row">
                                  <div className="col-xxl-4 col-lg-10 col-md-12 col-12">
                                    <div className="chairamw">
                                      <div className="image_icon_red">
                                        <p className="demons">
                                          <Image
                                            className="img-fluid"
                                            src={Sustainable7}
                                          />
                                        </p>

                                      </div>
                                      <div className="image_text">
                                        <h5 className="Pove_rty">
                                          Affordable and Clean Energy
                                        </h5>
                                        <p className="Developme">
                                          Access to renewable, safe and widely available energy sources for all
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-xxl-2 col-lg-2 col-md-12 col-12">
                                    <div className="impa">
                                      <label className="switch">
                                        <input
                                          type="checkbox"
                                          onChange={(e) =>
                                            this.handleMultiSelect(e, 7)
                                          }
                                          checked={selectedUser?.some(
                                            (eenvironment) =>
                                              Number(eenvironment) === 7
                                          )}
                                          name="affordable"
                                        />
                                        <span className="slider round"></span>
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                    <div className="chairam">
                                      <div className="omne">
                                        <div className="input-group">
                                          <textarea
                                            className="form-control nopel"
                                            rows="6"
                                            name="affordableDesc"
                                            disabled={(this.state.affordable === false) ? true : false}
                                            onChange={this.handleChange}
                                            defaultValue={
                                              this.state.affordableDesc
                                            }
                                          ></textarea>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <hr className="human" />
                              </div>
                              <div className="of_Americat">
                                <div className="row">
                                  <div className="col-xxl-4 col-lg-10 col-md-12 col-12">
                                    <div className="chairamw">
                                      <div className="image_icon_red">
                                        <p className="demons">
                                          <Image
                                            className="img-fluid"
                                            src={Sustainable8}
                                          />
                                        </p>

                                      </div>
                                      <div className="image_text">
                                        <h5 className="Pove_rty">
                                          Decent Work and Economic Growth
                                        </h5>
                                        <p className="Developme">
                                          Creating jobs for all to improve living standards, providing sustainable economic growth
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-xxl-2 col-lg-2 col-md-12 col-12">
                                    <div className="impa">
                                      <label className="switch">
                                        <input
                                          type="checkbox"
                                          onChange={(e) =>
                                            this.handleMultiSelect(e, 8)
                                          }
                                          checked={selectedUser?.some(
                                            (eenvironment) =>
                                              Number(eenvironment) === 8
                                          )}
                                          name="decentWork"
                                        />
                                        <span className="slider round"></span>
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                    <div className="chairam">
                                      <div className="omne">
                                        <div className="input-group">
                                          <textarea
                                            className="form-control nopel"
                                            rows="6"
                                            name="decentWorkDesc"
                                            disabled={(this.state.decentWork === false) ? true : false}
                                            onChange={this.handleChange}
                                            defaultValue={
                                              this.state.decentWorkDesc
                                            }
                                          ></textarea>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <hr className="human" />
                              </div>
                              <div className="of_Americat">
                                <div className="row">
                                  <div className="col-xxl-4 col-lg-10 col-md-12 col-12">
                                    <div className="chairamw">
                                      <div className="image_icon_red">
                                        <p className="demons">
                                          <Image
                                            className="img-fluid"
                                            src={Sustainable9}
                                          />
                                        </p>
                                      </div>
                                      <div className="image_text">
                                        <h5 className="Pove_rty">
                                          Industry, Innovation and Infrastructure
                                        </h5>
                                        <p className="Developme">
                                          Generating employment &amp; income through innovation
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-xxl-2 col-lg-2 col-md-12 col-12">
                                    <div className="impa">
                                      <label className="switch">
                                        <input
                                          type="checkbox"
                                          onChange={(e) =>
                                            this.handleMultiSelect(e, 9)
                                          }
                                          checked={selectedUser?.some(
                                            (eenvironment) =>
                                              Number(eenvironment) === 9
                                          )}
                                          name="industryInnovation"
                                        />
                                        <span className="slider round"></span>
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                    <div className="chairam">
                                      <div className="omne">
                                        <div className="input-group">
                                          <textarea
                                            className="form-control nopel"
                                            rows="6"
                                            name="industryInnovationDesc"
                                            disabled={(this.state.industryInnovation === false) ? true : false}
                                            onChange={this.handleChange}
                                            defaultValue={
                                              this.state.industryInnovationDesc
                                            }
                                          ></textarea>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <hr className="human" />
                              </div>
                              <div className="of_Americat">
                                <div className="row">
                                  <div className="col-xxl-4 col-lg-10 col-md-12 col-12">
                                    <div className="chairamw">
                                      <div className="image_icon_red">
                                        <p className="demons">
                                          <Image
                                            className="img-fluid"
                                            src={Sustainable10}
                                          />
                                        </p>
                                      </div>
                                      <div className="image_text">
                                        <h5 className="Pove_rty">
                                          Reduced Inequalities
                                        </h5>
                                        <p className="Developme">
                                          Reducing income and other inequalities within and between countries
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-xxl-2 col-lg-2 col-md-12 col-12">
                                    <div className="impa">
                                      <label className="switch">
                                        <input
                                          type="checkbox"
                                          onChange={(e) =>
                                            this.handleMultiSelect(e, 10)
                                          }
                                          checked={selectedUser?.some(
                                            (eenvironment) =>
                                              Number(eenvironment) === 10
                                          )}
                                          name="reducedInqualites"
                                        />
                                        <span className="slider round"></span>
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                    <div className="chairam">
                                      <div className="omne">
                                        <div className="input-group">
                                          <textarea
                                            className="form-control nopel"
                                            rows="6"
                                            name="reducedInqualitesDesc"
                                            disabled={(this.state.reducedInqualites === false) ? true : false}
                                            onChange={this.handleChange}
                                            defaultValue={
                                              this.state.reducedInqualitesDesc
                                            }
                                          ></textarea>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <hr className="human" />
                              </div>
                              <div className="of_Americat">
                                <div className="row">
                                  <div className="col-xxl-4 col-lg-10 col-md-12 col-12">
                                    <div className="chairamw">
                                      <div className="image_icon_red">
                                        <p className="demons">
                                          <Image
                                            className="img-fluid"
                                            src={Sustainable11}
                                          />
                                        </p>
                                      </div>
                                      <div className="image_text">
                                        <h5 className="Pove_rty">
                                          Sustainable Cities and Communities
                                        </h5>
                                        <p className="Developme">
                                          Making cities safe, inclusive, resilient and sustainable
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-xxl-2 col-lg-2 col-md-12 col-12">
                                    <div className="impa">
                                      <label className="switch">
                                        <input
                                          type="checkbox"
                                          onChange={(e) =>
                                            this.handleMultiSelect(e, 11)
                                          }
                                          checked={selectedUser?.some(
                                            (eenvironment) =>
                                              Number(eenvironment) === 11
                                          )}
                                          name="sustainableCities"
                                        />
                                        <span className="slider round"></span>
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                    <div className="chairam">
                                      <div className="omne">
                                        <div className="input-group">
                                          <textarea
                                            className="form-control nopel"
                                            rows="6"
                                            name="sustainableCitiesDesc"
                                            disabled={(this.state.sustainableCities === false) ? true : false}
                                            onChange={this.handleChange}
                                            defaultValue={
                                              this.state.sustainableCitiesDesc
                                            }
                                          ></textarea>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <hr className="human" />
                              </div>
                              <div className="of_Americat">
                                <div className="row">
                                  <div className="col-xxl-4 col-lg-10 col-md-12 col-12">
                                    <div className="chairamw">
                                      <div className="image_icon_red">
                                        <p className="demons">
                                          <Image
                                            className="img-fluid"
                                            src={Sustainable12}
                                          />
                                        </p>

                                      </div>
                                      <div className="image_text">
                                        <h5 className="Pove_rty">
                                          Responsible Consumption Production
                                        </h5>
                                        <p className="Developme">
                                          Reversing current consumption trends and promoting a more sustainable future
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-xxl-2 col-lg-2 col-md-12 col-12">
                                    <div className="impa">
                                      <label className="switch">
                                        <input
                                          type="checkbox"
                                          onChange={(e) =>
                                            this.handleMultiSelect(e, 12)
                                          }
                                          checked={selectedUser?.some(
                                            (eenvironment) =>
                                              Number(eenvironment) === 12
                                          )}
                                          name="responsibleConsumption"
                                        />
                                        <span className="slider round"></span>
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                    <div className="chairam">
                                      <div className="omne">
                                        <div className="input-group">
                                          <textarea
                                            className="form-control nopel"
                                            rows="6"
                                            name="responsibleConsumptionDesc"
                                            disabled={(this.state.responsibleConsumption === false) ? true : false}
                                            onChange={this.handleChange}
                                            defaultValue={
                                              this.state
                                                .responsibleConsumptionDesc
                                            }
                                          ></textarea>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <hr className="human" />
                              </div>
                              <div className="of_Americat">
                                <div className="row">
                                  <div className="col-xxl-4 col-lg-10 col-md-12 col-12">
                                    <div className="chairamw">
                                      <div className="image_icon_red">
                                        <p className="demons">
                                          <Image
                                            className="img-fluid"
                                            src={Sustainable13}
                                          />
                                        </p>

                                      </div>
                                      <div className="image_text">
                                        <h5 className="Pove_rty">
                                          Climate Action
                                        </h5>
                                        <p className="Developme">
                                          Regulating and reducing emissions and promoting renewable energy
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-xxl-2 col-lg-2 col-md-12 col-12">
                                    <div className="impa">
                                      <label className="switch">
                                        <input
                                          type="checkbox"
                                          onChange={(e) =>
                                            this.handleMultiSelect(e, 13)
                                          }
                                          checked={selectedUser?.some(
                                            (eenvironment) =>
                                              Number(eenvironment) === 13
                                          )}
                                          name="climateAction"
                                        />
                                        <span className="slider round"></span>
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                    <div className="chairam">
                                      <div className="omne">
                                        <div className="input-group">
                                          <textarea
                                            className="form-control nopel"
                                            rows="6"
                                            disabled={(this.state.climateAction === false) ? true : false}
                                            name="climateActionDesc"
                                            onChange={this.handleChange}
                                            defaultValue={
                                              this.state.climateActionDesc
                                            }
                                          ></textarea>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <hr className="human" />
                              </div>
                              <div className="of_Americat">
                                <div className="row">
                                  <div className="col-xxl-4 col-lg-10 col-md-12 col-12">
                                    <div className="chairamw">
                                      <div className="image_icon_red">
                                        <p className="demons">
                                          <Image
                                            className="img-fluid"
                                            src={Sustainable14}
                                          />
                                        </p>

                                      </div>
                                      <div className="image_text">
                                        <h5 className="Pove_rty">
                                          Life Below Water
                                        </h5>
                                        <p className="Developme">
                                          Conservation, promoting marine diversity and regulating fishing practices
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-xxl-2 col-lg-2 col-md-12 col-12">
                                    <div className="impa">
                                      <label className="switch">
                                        <input
                                          type="checkbox"
                                          onChange={(e) =>
                                            this.handleMultiSelect(e, 14)
                                          }
                                          checked={selectedUser?.some(
                                            (eenvironment) =>
                                              Number(eenvironment) === 14
                                          )}
                                          name="lifeBelowWater"
                                        />
                                        <span className="slider round"></span>
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                    <div className="chairam">
                                      <div className="omne">
                                        <div className="input-group">
                                          <textarea
                                            className="form-control nopel"
                                            rows="6"
                                            name="lifeBelowWaterDesc"
                                            disabled={(this.state.lifeBelowWater === false) ? true : false}
                                            onChange={this.handleChange}
                                            defaultValue={
                                              this.state.lifeBelowWaterDesc
                                            }
                                          ></textarea>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <hr className="human" />
                              </div>
                              <div className="of_Americat">
                                <div className="row">
                                  <div className="col-xxl-4 col-lg-10 col-md-12 col-12">
                                    <div className="chairamw">
                                      <div className="image_icon_red">
                                        <p className="demons">
                                          <Image
                                            className="img-fluid"
                                            src={Sustainable15}
                                          />
                                        </p>
                                      </div>
                                      <div className="image_text">
                                        <h5 className="Pove_rty">
                                          Life on Land
                                        </h5>
                                        <p className="Developme">
                                          Reversing human-made deforestation and desertification to sustain all life on earth
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-xxl-2 col-lg-2 col-md-12 col-12">
                                    <div className="impa">
                                      <label className="switch">
                                        <input
                                          type="checkbox"
                                          onChange={(e) =>
                                            this.handleMultiSelect(e, 15)
                                          }
                                          checked={selectedUser?.some(
                                            (eenvironment) =>
                                              Number(eenvironment) === 15
                                          )}
                                          name="lifeOnLand"
                                        />
                                        <span className="slider round"></span>
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                    <div className="chairam">
                                      <div className="omne">
                                        <div className="input-group">
                                          <textarea
                                            className="form-control nopel"
                                            rows="6"
                                            name="lifeOnLandDesc"
                                            disabled={(this.state.lifeOnLand === false) ? true : false}
                                            onChange={this.handleChange}
                                            defaultValue={
                                              this.state.lifeOnLandDesc
                                            }
                                          ></textarea>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <hr className="human" />
                              </div>
                              <div className="of_Americat">
                                <div className="row">
                                  <div className="col-xxl-4 col-lg-10 col-md-12 col-12">
                                    <div className="chairamw">
                                      <div className="image_icon_red">
                                        <p className="demons">
                                          <Image
                                            className="img-fluid"
                                            src={Sustainable16}
                                          />
                                        </p>
                                      </div>
                                      <div className="image_text">
                                        <h5 className="Pove_rty">
                                          Peace, Justice and Strong Institutions
                                        </h5>
                                        <p className="Developme">
                                          Inclusive societies, robust institutions and equal access to justice
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-xxl-2 col-lg-2 col-md-12 col-12">
                                    <div className="impa">
                                      <label className="switch">
                                        <input
                                          type="checkbox"
                                          onChange={(e) =>
                                            this.handleMultiSelect(e, 16)
                                          }
                                          checked={selectedUser?.some(
                                            (eenvironment) =>
                                              Number(eenvironment) === 16
                                          )}
                                          name="peace"
                                        />
                                        <span className="slider round"></span>
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                    <div className="chairam">
                                      <div className="omne">
                                        <div className="input-group">
                                          <textarea
                                            className="form-control nopel"
                                            rows="6"
                                            name="peaceDesc"
                                            onChange={this.handleChange}
                                            disabled={(this.state.peace === false) ? true : false}
                                            defaultValue={this.state.peaceDesc}
                                          ></textarea>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <hr className="human" />
                              </div>
                              <div className="of_Americat">
                                <div className="row">
                                  <div className="col-xxl-4 col-lg-10 col-md-12 col-12">
                                    <div className="chairamw">
                                      <div className="image_icon_red">
                                        <p className="demons">
                                          <Image
                                            className="img-fluid"
                                            src={Sustainable17}
                                          />
                                        </p>

                                      </div>
                                      <div className="image_text">
                                        <h5 className="Pove_rty">
                                          Partnerships for the Goals
                                        </h5>
                                        <p className="Developme">
                                          Revitalise strong global partnerships for sustainable development
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-xxl-2 col-lg-2 col-md-12 col-12">
                                    <div className="impa">
                                      <label className="switch">
                                        <input
                                          type="checkbox"
                                          onChange={(e) =>
                                            this.handleMultiSelect(e, 17)
                                          }
                                          checked={selectedUser?.some(
                                            (eenvironment) =>
                                              Number(eenvironment) === 17
                                          )}
                                          name="partnership"
                                        />
                                        <span className="slider round"></span>
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                    <div className="chairam">
                                      <div className="omne">
                                        <div className="input-group">
                                          <textarea
                                            className="form-control nopel"
                                            rows="6"
                                            name="partnershipDesc"
                                            disabled={(this.state.partnership === false) ? true : false}
                                            onChange={this.handleChange}
                                            defaultValue={
                                              this.state.partnershipDesc
                                            }
                                          ></textarea>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <hr className="human" />
                              </div>
                            </div>
                          </form>
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
}
