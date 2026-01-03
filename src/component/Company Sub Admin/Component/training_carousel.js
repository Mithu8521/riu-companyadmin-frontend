import React, { Component } from "react";
import image4 from "../../../img/image 4.png";
import image5 from "../../../img/image 5.png";
import image6 from "../../../img/image 6.png";
import { Carousel } from "react-bootstrap";
import "./training_carousel.css";
// import { authenticationService } from "../../../_services/authentication";
// import config from "../../../config/config.json";
// const currentUser = authenticationService.currentUserValue;
export default class training_carousel extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     isLoaded: true,
  //     items: [],
  //   };
  // }

  componentDidMount() {
    // const headers = {
    //   Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   Accept: "application/json",
    // };

    // fetch(config.API_URL + "blogs", { headers })
    //   .then((res) => res.json())
    //   .then(
    //     (result) => {
    //       this.setState({
    //         isLoaded2: false,
    //         items: result.result,
    //       });
    //     },
    //     (error) => {
    //       this.setState({
    //         isLoaded2: true,
    //         error,
    //       });
    //     }
    //   );
  }
  render() {
    return (
      <div>
        <div className="carousel_slide_training">
          <Carousel>
            <Carousel.Item>
              <div className="car_d">
                <div className="row">
                  <div className="col-sm-4">
                    <div className="rwlp">
                      <div className="iamge_car">
                        <img className="im_k" src={image4} alt="" />
                      </div>
                      <div className="iamge_car_text">
                        <h4 className="serhelp">
                          Xchainge launches advisory service to help businesses
                          reap financial benefits...
                        </h4>
                        <p className="fx_fin">ESG</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="rwlp">
                      <div className="iamge_car">
                        <img className="im_k" src={image5} alt="" />
                      </div>
                      <div className="iamge_car_text">
                        <h4 className="serhelp">
                          The Covid Insolvency Challenge for Australian <br />
                          SMEs
                        </h4>
                        <p className="fx_fin">Sustainable Finance</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="rwlp">
                      <div className="iamge_car">
                        <img className="im_k" src={image6} alt="" />
                      </div>
                      <div className="iamge_car_text">
                        <h4 className="serhelp">
                          Better pricing on FX forwards using ESG & sustainable
                          finance targets
                        </h4>
                        <p className="fx_fin">Sustainable Finance</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className="car_d">
                <div className="row">
                  <div className="col-sm-4">
                    <div className="rwlp">
                      <div className="iamge_car">
                        <img className="im_k" src={image4} alt="" />
                      </div>
                      <div className="iamge_car_text">
                        <h4 className="serhelp">
                          Xchainge launches advisory service to help businesses
                          reap financial benefits...
                        </h4>
                        <p className="fx_fin">ESG</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="rwlp">
                      <div className="iamge_car">
                        <img className="im_k" src={image5} alt="" />
                      </div>
                      <div className="iamge_car_text">
                        <h4 className="serhelp">
                          The Covid Insolvency Challenge for Australian <br />
                          SMEs
                        </h4>
                        <p className="fx_fin">Sustainable Finance</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="rwlp">
                      <div className="iamge_car">
                        <img className="im_k" src={image6} alt="" />
                      </div>
                      <div className="iamge_car_text">
                        <h4 className="serhelp">
                          Better pricing on FX forwards using ESG & sustainable
                          finance targets
                        </h4>
                        <p className="fx_fin">Sustainable Finance</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className="car_d">
                <div className="row">
                  <div className="col-sm-4">
                    <div className="rwlp">
                      <div className="iamge_car">
                        <img className="im_k" src={image4} alt="" />
                      </div>
                      <div className="iamge_car_text">
                        <h4 className="serhelp">
                          Xchainge launches advisory service to help businesses
                          reap financial benefits...
                        </h4>
                        <p className="fx_fin">ESG</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="rwlp">
                      <div className="iamge_car">
                        <img className="im_k" src={image5} alt="" />
                      </div>
                      <div className="iamge_car_text">
                        <h4 className="serhelp">
                          The Covid Insolvency Challenge for Australian <br />
                          SMEs
                        </h4>
                        <p className="fx_fin">Sustainable Finance</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="rwlp">
                      <div className="iamge_car">
                        <img className="im_k" src={image6} alt="" />
                      </div>
                      <div className="iamge_car_text">
                        <h4 className="serhelp">
                          Better pricing on FX forwards using ESG & sustainable
                          finance targets
                        </h4>
                        <p className="fx_fin">Sustainable Finance</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Carousel.Item>
          </Carousel>
        </div>
      </div>
    );
  }
}
