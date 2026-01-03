import React, { useEffect, useState } from "react";
import { apiCall } from "../../_services/apiCall";
import config from "../../config/config.json";

const Payment = (props) => {
  const { dataResult, companyId } = props;
  const [planData, setPlanData] = useState([]);
  const [planError, setPlanError] = useState([]);

  const getGlobalSubscriptionPlan = async () => {
    const { isSuccess, data, error } = await apiCall(
      config.AUTH_API_URL + `getAllSubscription`,
      {},
      {
        subscription_type: "All",
        current_role: "COMPANY",
        company_id: companyId,
      },
      "GET"
    );
    if (isSuccess) {
      setPlanData(data?.data);
    } else {
      setPlanError(error);
    }
  };

  const paymentHandler = async (item, e) => {
    {
      const { isSuccess, data, error } = await apiCall(
        config.AUTH_API_URL + `generateOrderId`,
        {},
        { plan_id: item.id, company_id: companyId },
        "GET"
      );
      let id;
      if (isSuccess) {
        if (data.data === "Subscription Done!") {
          const pushToRoute = "/#/verify_message";
          setTimeout(() => {
            window.location.href = pushToRoute;
          }, 2000);
        } else {
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
    }
  };

  const paymentDone = async (id) => {
    {
      const { isSuccess, data, error } = await apiCall(
        config.AUTH_API_URL + `paymentDone`,
        {},
        { orderId: id, company_id: companyId, password: dataResult },
        "POST"
      );
      if (isSuccess) {
        const pushToRoute = "/#/verify_message";

        setTimeout(() => {
          window.location.href = pushToRoute;
        }, 2000);

        getGlobalSubscriptionPlan();
      }
    }
  };

  useEffect(() => {
    getGlobalSubscriptionPlan();
  }, []);

  return (
    <div>
      {planData &&
        planData?.map((item) => (
          <div className="pricing-table turquoise h-100">
            {item?.price !== item?.payment_amount && (
              <div className="badge-overlay">
                <span className="top-right badge">
                  {(Number(item?.price - item?.payment_amount) * 100) /
                    Number(item?.price)}
                  % OFF
                </span>
              </div>
            )}
            {item?.title && <h2>{item?.title}</h2>}
            <div className="d-flex justify-content-center align-items-baseline gap-2">
              <div style={{ fontSize: 30, color: "red" }}>
                {item?.price !== item?.payment_amount && (
                  <span className="symbol">₹</span>
                )}
                {item?.price !== item?.payment_amount && <s>{item?.price}</s>}
              </div>
              <div className="price-tag">
                <span className="symbol">₹</span>
                <span className="amount">{item?.payment_amount}</span>
                <span className="after">/{item?.renewal_type}</span>
              </div>
            </div>

            {item?.year && (
              <>
                <div className="mt-0 mb-1 border-bottom"></div>
                <div className="d-flex align-items-center justify-content-between">
                  <span>Financial Year</span>
                  <span>{item?.year}</span>
                </div>
              </>
            )}
            {item?.plan_data?.ALLOW_GLOBAL_FRAMEWORK && (
              <div className="d-flex align-items-center justify-content-between">
                <span>Global Framework for Supplier</span>
                <span>
                  {item?.plan_data?.ALLOW_GLOBAL_FRAMEWORK == "1"
                    ? "Yes"
                    : "No"}
                </span>
              </div>
            )}
            {item?.plan_data?.NO_USERS && (
              <div className="d-flex align-items-center justify-content-between">
                <span>No. of Users</span>
                <span>{item?.plan_data?.NO_USERS}</span>
              </div>
            )}
            {item?.plan_data?.NO_FRAMEWORK && (
              <div className="d-flex align-items-center justify-content-between">
                <span>No. of Framework (Can be create)</span>
                <span>{item?.plan_data?.NO_FRAMEWORK}</span>
              </div>
            )}
            {item?.plan_data?.NO_SUPPLIER && (
              <>
                <div className="d-flex align-items-center justify-content-between">
                  <span>No. of Suppliers (Can be create)</span>
                  <span>{item?.plan_data?.NO_SUPPLIER}</span>
                </div>
                <div className="mt-2 mb-1 border-bottom"></div>
              </>
            )}
            <div className="pricing-features h-100">
              {item?.plan_data.MAPPED_FRAMEWORK && (
                <>
                  <div className="feature">Framework Features :</div>
                  <div className="framework_feature">
                    <ul>
                      {item?.plan_data.MAPPED_FRAMEWORK &&
                        item?.plan_data.MAPPED_FRAMEWORK?.map((item) => (
                          <>
                            <li key={item.id}>{item.title}</li>
                          </>
                        ))}
                    </ul>
                  </div>
                </>
              )}
              {item?.plan_data.MAPPED_MENUS && (
                <>
                  <div className="feature">Menu Features :</div>
                  <div className="framework_feature">
                    <ul>
                      {item?.plan_data.MAPPED_MENUS &&
                        item?.plan_data.MAPPED_MENUS?.map((item) => (
                          <>
                            <li key={item.id}>{item.title}</li>
                          </>
                        ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
            <a
              className="price-button"
              onClick={(e) => paymentHandler(item, e)}
            >
              Get Started
            </a>
          </div>
        ))}
    </div>
  );
};

export default Payment;
