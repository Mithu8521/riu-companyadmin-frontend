import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "./billing.css";
import config from "../../config/config.json";
import { apiCall } from "../../_services/apiCall";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Loader from "../loader/Loader";

const Billing = ({ tab, userPermissionList }) => {
  const [authValue, setAuthValue] = useState(null);
  const [error, setError] = useState();
  const [currentPlan, setCurrentPlan] = useState("");
  const [updradePlanShow, setUpdradePlanShow] = useState(false);
  const [updradePrice, setUpdradePrice] = useState();
  const [items, setItems] = useState([]);
  const userId = JSON.parse(localStorage.getItem("user_temp_id"));
  const [showSkelton, setshowSkelton] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const closeDeletePopup = () => setDeletePopup(false);

  useEffect(() => {
    const authValue = JSON.parse(localStorage.getItem("currentUser"));
    setAuthValue(authValue);
    getGlobalSubscriptionPlan();
  }, [tab]);
  const changeDateFormat = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    const day = date.getDate();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const formattedDate = `${day < 10 ? "0" + day : day}-${month}-${year}`;
    return formattedDate;
  };
  const paymentDone = async (id) => {
    {
      const { isSuccess, data, error } = await apiCall(
        config.API_URL + `paymentDone`,
        {},
        { orderId: id },
        "POST"
      );
      if (isSuccess) {
        getGlobalSubscriptionPlan();
      }
    }
  };
  const cancelPlane = async () => {
    {
      const { isSuccess, data, error } = await apiCall(
        config.POSTLOGIN_API_URL_COMPANY + `cancelPlan`,
        {},
        {},
        "POST"
      );
      if (isSuccess) {
        closeDeletePopup();
        getGlobalSubscriptionPlan();
      }
    }
  };
  const upgradePlanPaymentDone = async (id) => {
    {
      const { isSuccess, data, error } = await apiCall(
        config.API_URL + `upgradePlanPaymentDone`,
        {},
        { orderId: id },
        "POST"
      );
      if (isSuccess) {
        getGlobalSubscriptionPlan();
      }
    }
  };
  const handleClose = () => {
    {
      setUpdradePlanShow(false);
    }
  };
  const upgradePlan = async () => {
    {
      const { isSuccess, data, error } = await apiCall(
        config.API_URL + `upgradePlan`,
        {},
        "GET"
      );
      let id;
      if (isSuccess) {
        {
          setUpdradePlanShow(false);
        }
        const options = {
          key: "rzp_test_hCHVIASrXD6OsD",
          amount: "80",
          currency: "INR",
          name: "Acme Corp",
          description: "Test Transaction",
          image: "https://example.com/your_logo",
          order_id: data.data.orderId,
          handler: (response) => {
            upgradePlanPaymentDone(response.razorpay_order_id);
          },
          // prefill: {
          //   name: "Gaurav Kumar",
          //   email: "gaurav.kumar@example.com",
          //   contact: "9000090000",
          // },
          notes: {
            address: "Razorpay Corporate Office",
          },
          theme: {
            color: "#3399cc",
          },
        };
        const rzp1 = new window.Razorpay(options);
        rzp1.on("payment.failed", function (response) {
          alert(response.error.code);
          alert(response.error.description);
          alert(response.error.source);
          alert(response.error.step);
          alert(response.error.reason);
          alert(response.error.metadata.order_id);
          alert(response.error.metadata.payment_id);
        });
        rzp1.open();
      }
    }
  };
  const paymentHandler = async (item, e) => {
    {
      const { isSuccess, data, error } = await apiCall(
        config.API_URL + `generateOrderId`,
        {},
        { plan_id: item.id },
        "GET"
      );
      let id;
      if (isSuccess) {
        const options = {
          key: "rzp_test_hCHVIASrXD6OsD",
          amount: "80",
          currency: "INR",
          name: "Acme Corp",
          description: "Test Transaction",
          image: "https://example.com/your_logo",
          order_id: data.data.orderId,
          handler: (response) => {
            paymentDone(response.razorpay_order_id);
          },
          // prefill: {
          //   name: "Gaurav Kumar",
          //   email: "gaurav.kumar@example.com",
          //   contact: "9000090000",
          // },
          notes: {
            address: "Razorpay Corporate Office",
          },
          theme: {
            color: "#3399cc",
          },
        };
        const rzp1 = new window.Razorpay(options);
        rzp1.on("payment.failed", function (response) {
          alert(response.error.code);
          alert(response.error.description);
          alert(response.error.source);
          alert(response.error.step);
          alert(response.error.reason);
          alert(response.error.metadata.order_id);
          alert(response.error.metadata.payment_id);
        });
        rzp1.open();
      }
    }
  };
  const upgradePlanPayment = (item) => {
    setUpdradePlanShow(true);
    setUpdradePrice(item?.price);
    setCurrentPlan(item?.id);
  };
  const getGlobalSubscriptionPlan = async () => {
    setshowSkelton(true);
    const { isSuccess, data, error } = await apiCall(
      config.POSTLOGIN_API_URL_COMPANY + `getSubcriptionPlane`,
      {},
      { userId: userId },
      "GET"
    );
    if (isSuccess) {
      setshowSkelton(false);
      if (data?.data) {
        for (let i = 0; i < data?.data.length; i++) {
          const item = data?.data[i];
          if (item?.status === "PAYMENT_DONE") {
            setCurrentPlan(item?.price);
            break;
          }
        }
      }
      setItems(data?.data);
    } else {
      setError(error);
    }
  };

  const specialCompanies = [338];

  const rowStyle = {
    display: "flex",
    alignItems: "center",
    fontSize: "16px",
    color: "#11546f",
    fontWeight: 500,
    gap: "10px",
    padding: "10px 12px",
    borderRadius: "8px",
    background: "#f8fcff",
    border: "1px solid #e2f1fb",
  };

  const iconStyle = {
    fontSize: "20px",
  };

  if (authValue && specialCompanies.includes(authValue.company_id)) {
    return (
      <div
        className="upgrade-info-box"
        style={{
          padding: "25px",
          background: "#ffffff",
          borderRadius: "12px",
          marginBottom: "35px",
          border: "1px solid #d8eefe",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)"
        }}
      >

        {/* Highlighted Message */}
        <div
          style={{
            background: "#e9f7ff",
            border: "1px solid #bfe6ff",
            borderRadius: "10px",
            padding: "15px 20px",
            marginBottom: "20px",
            fontSize: "18px",
            fontWeight: "600",
            color: "#0d6c9b",
            textAlign: "center",
            lineHeight: "1.5"
          }}
        >
          Unlock unlimited features and take your experience to the next level!
        </div>

        {/* Contact Header */}
        <h3
          style={{
            color: "#11546f",
            fontWeight: "700",
            marginBottom: "15px",
            fontSize: "22px",
            borderBottom: "2px solid #d9edf7",
            paddingBottom: "8px"
          }}
        >
          Contact Information
        </h3>

        <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>

          <div style={rowStyle}>
            <span style={iconStyle}>👤</span>
            <span><strong>Name:</strong> Sharique Zia</span>
          </div>

          <div style={rowStyle}>
            <span style={iconStyle}>📧</span>
            <span><strong>Email:</strong> sharique@riu.ai</span>
          </div>

          <div style={rowStyle}>
            <span style={iconStyle}>📱</span>
            <span><strong>Contact:</strong> +91-9738757221</span>
          </div>

        </div>

      </div>
    );
  }



  return (
    <div className="Introduction framwork_2 plan_height" style={{ background: "white", height: "110vh", borderRadius: "15px", padding: "3em" }}>
      <div className="d-flex w-100 justify-content-between" style={{ marginBottom: "50px" }}>
        <button className="btn " style={{ color: "#3F88A5", borderRadius: "10px", border: "1px solid #3F88A5", fontWeight: 600, padding: "8px 50px" }}>Subscribe New Framework</button>
        <button className="btn " style={{ color: "#3F88A5", borderRadius: "10px", border: "1px solid #3F88A5", fontWeight: 600, padding: "8px 50px" }}>Upgrade</button>
      </div>
      <section className="forms">
        <div className="w-100" style={{ display: "flex", justifyContent: "space-around", }}>
          {userPermissionList.some(
            (permission) =>
              permission.permissionCode === "VIEW_SUBSCRIPTION_PLAN" &&
              permission.checked
          ) &&
            (!showSkelton ? (
              items &&
              items?.map((item, key) => (
                <div style={{ position: "relative", width: 360 }}>
                  <div className="pricing-table turquoise">
                    {item?.price !== item?.payment_amount && (
                      <div className="badge-overlay">
                        <span className="top-right badge">
                          {(Number(item?.price - item?.payment_amount) * 100) /
                            Number(item?.price)}
                          % OFF
                        </span>
                      </div>
                    )}
                    <div style={{ textAlign: "left", fontSize: "24px", fontWeight: "bold", color: "#11546f" }}>{item?.title}</div>
                    <div className="d-flex align-items-baseline ">
                      <div style={{ fontSize: 25, color: "red" }}>
                        {item?.price !== item?.payment_amount && (
                          <span className="symbol">₹</span>
                        )}
                        {item?.price !== item?.payment_amount && (
                          <span>{Number(item?.price).toLocaleString('en-IN')}</span>
                        )}
                      </div>

                      <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", marginBottom: "10px" }}>
                        <span className="symbol" style={{ fontSize: "22px", fontWeight: 500, color: "#11546f" }}>₹</span>
                        <span className="amount" style={{ fontSize: "22px", fontWeight: 500, color: "#11546f" }}>
                          {Number(item?.payment_amount).toLocaleString('en-IN')}
                        </span>
                        <span className="after" style={{ fontSize: "18px", fontWeight: 500, color: "#11546f" }}>/ {" "}{item?.renewal_type}</span>
                      </div>
                    </div>
                    <hr style={{ margin: "0", color: "#11546f" }} />
                    <div className="d-flex align-items-center justify-content-between">
                      {console.log(key, "keykeykey")}
                      <span style={{ fontSize: "18px", fontWeight: 500, color: "#11546f" }}>Financial Year</span>
                      <span style={{ fontSize: "18px", fontWeight: 700, color: "#11546f" }}>{item?.plan_data?.FINANCIAL_YEAR}</span>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <span style={{ fontSize: "18px", fontWeight: 500, color: "#11546f" }}>Year</span>
                      <span style={{ fontSize: "18px", fontWeight: 700, color: "#11546f" }}>{item?.year}</span>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <span style={{ fontSize: "18px", fontWeight: 500, color: "#11546f" }}>No. of Users</span>
                      <span style={{ fontSize: "18px", fontWeight: 700, color: "#11546f" }}>{item?.plan_data?.NO_USERS}</span>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <span style={{ fontSize: "18px", fontWeight: 500, color: "#11546f" }}>No. of Framework</span>
                      <span style={{ fontSize: "18px", fontWeight: 700, color: "#11546f" }}>{item?.plan_data?.NO_FRAMEWORK}</span>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <span style={{ fontSize: "18px", fontWeight: 500, color: "#11546f" }}>No. of Supplier</span>
                      <span style={{ fontSize: "18px", fontWeight: 700, color: "#11546f" }}>{item?.plan_data?.NO_SUPPLIER}</span>
                    </div>
                    <hr style={{ margin: "0" }} />
                    <div className="pricing-features">
                      <div className="feature" style={{ fontSize: "18px", fontWeight: 700, color: "#11546f" }}>Framework Features :</div>
                      <div className="framework_feature">
                        <ul>
                          {item?.plan_data?.MAPPED_FRAMEWORK?.map((menu) => (
                            <li key={menu.id} style={{ fontSize: "15px", fontWeight: 500, color: "#11546f" }}>{menu.title}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="feature" style={{ fontSize: "18px", fontWeight: 700, color: "#11546f" }}>Menu Features :</div>
                      <div className="framework_feature">
                        <ul>
                          {item?.plan_data?.MAPPED_MENUS?.map((menu) => (
                            <li key={menu.id} style={{ fontSize: "15px", fontWeight: 500, color: "#11546f" }}>{menu.title}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {key === 0 && item?.auto_renewal == "0" &&
                      item?.status == "PAYMENT_DONE" && (
                        <p className="fw-bold">
                          This cancellation is applicable from{" "}
                          {changeDateFormat(item?.valid_till)}
                        </p>
                      )}
                    {userPermissionList.some(
                      (permission) =>
                        permission.permissionCode === "CANCEL_PLAN" &&
                        permission.checked
                    ) &&
                      key !== 1 && item?.auto_renewal == "1" &&
                      item?.status == "PAYMENT_DONE" ? (
                      <a
                        id="checkout-and-portal-button"
                        onClick={(e) => setDeletePopup(true)}
                        className="price-button price-button-concel"
                      >
                        CANCEL
                      </a>
                    ) : (
                      userPermissionList.some(
                        (permission) =>
                          permission.permissionCode === "UPGRADE_PLAN" &&
                          permission.checked
                      ) &&
                      currentPlan &&
                      item?.price > currentPlan && (
                        <a
                          id="checkout-and-portal-button"
                          onClick={(e) => upgradePlanPayment(item)}
                          className="price-button"
                        >
                          Upgrad Plan
                        </a>
                      )
                    )}

                    {currentPlan?.length == 0 &&
                      (item?.is_invitable == 1 || item?.is_invitable == 0) && (
                        <a
                          className="price-button"
                          onClick={(e) => paymentHandler(item, e)}
                        >
                          Get Started
                        </a>
                      )}
                  </div>
                  <Modal show={updradePlanShow} onHide={() => handleClose()}>
                    <Modal.Header closeButton>
                      <Modal.Title>Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>You need to pay ${updradePrice}</Modal.Body>
                    <Modal.Footer>
                      <Button variant="primary" onClick={() => upgradePlan()}>
                        Pay
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </div>
              ))
            ) : (
              <Loader />
            ))}
          {/* <div className="cards">
            <div className="row justify-content-center">
              <div className="col-lg-12 col-xs-12 subscription_box">
                {items &&
                  items?.map((item, key) => (
                    <div key={key} className="mx-4">
                      {item ? (
                        <div className="global_link w-100 btn-d subbutton"></div>
                      ) : (
                        false
                      )}
                      <>
                        <Modal
                          show={updradePlanShow}
                          onHide={() => handleClose()}
                        >
                          <Modal.Header closeButton>
                            <Modal.Title>Confirmation</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            You need to pay ${updradePrice}
                          </Modal.Body>
                          <Modal.Footer>
                            <Button
                              variant="primary"
                              onClick={() => upgradePlan()}
                            >
                              Pay
                            </Button>
                          </Modal.Footer>
                        </Modal>
                      </>
                    </div>
                  ))}
              </div>
            </div>
          </div> */}
          <Modal show={deletePopup} onHide={closeDeletePopup}>
            <Modal.Header closeButton>
              <Modal.Title>Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h5>Are you certain you want to cancel your plan?</h5>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="outline-danger"
                type="submit"
                onClick={() => cancelPlane()}
              >
                Cancel Plan
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </section>
    </div>
  );
};

export default Billing;
