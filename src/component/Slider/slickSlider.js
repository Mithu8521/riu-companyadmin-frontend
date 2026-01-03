import React from "react";
import Carousel from "react-multi-carousel";
import { Image } from "semantic-ui-react";
// import "semantic-ui-css/semantic.min.css";
import "react-multi-carousel/lib/styles.css";
import "./sli.css";
// import supplyimg from "../../../../img/supply chain mgmt.webp";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    paritialVisibilityGutter: 60,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    paritialVisibilityGutter: 50,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    paritialVisibilityGutter: 30,
  },
};

// Because this is an inframe, so the SSR mode doesn't not do well here.
// It will work on real devices.
const SlickSlider = (props) => {
  return (
    <Carousel
      ssr
      partialVisbile
      deviceType={"desktop"}
      itemClass="image-item"
      responsive={responsive}
    >
      {props.itemss.slice(0, 1).map(() => {
        return (
          <div
          // key={key}
          >
            {/* <a target="_blank" rel="noreferrer" href="#"> */}
            <Image
              draggable={false}
              style={{
                width: "100%",
                height: "230px",
                borderRadius: "25px",
                objectFit: "cover",
              }}
              src="https://assets.bizclikmedia.net/1800/6056d5cb265e4dc2118f71283c1a3ace:929954ae4a10164e5384044df08a05d1/what-2520is-2520sc-jpeg.webp"
            />
            {/* </a> */}
            <div className="iamge_car_text">
              {/* <a target="_blank"  rel="noreferrer" href="#"> */}
              <h4 className="serhelp my-2">
                Real-Time Supply Chain ESG management
              </h4>
              {/* </a> */}
              <p className="fx_fin image-text">RIU Admin</p>
            </div>
          </div>
        );
      })}
    </Carousel>
  );
};

export default SlickSlider;
