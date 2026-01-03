import React, { useEffect, useState } from "react";
import Select from "react-select";
import "./TrainingModal.css";
import CloseIcon from "../img/Close.png";
import "bootstrap/dist/css/bootstrap.min.css";
import img from "../img/filter.svg";
import TrainingFilterModal from "./TrainingFilterModal";
import { apiCall } from "../../../_services/apiCall";
import config from "../../../config/config.json";
import { Button, Modal, Form, Row, Col, Alert } from "react-bootstrap";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

// Default principles data - same as in TrainingFilterModal
const defaultPrinciplesData = [
  { id: 1, title: "Principle 1 (Ethics, Integrity, and Transparency)" },
  { id: 2, title: "Principle 2 (Product lifecycle sustainability)" },
  { id: 3, title: "Principle 3 (Employee well-being)" },
  { id: 4, title: "Principle 4 (Stakeholder Engagement)" },
  { id: 5, title: "Principle 5 (Human Rights)" },
  { id: 6, title: "Principle 6 (Environment)" },
  { id: 7, title: "Principle 7 (Public Policy Advocacy)" },
  { id: 8, title: "Principle 8 (Inclusive and equitable growth)" },
  { id: 9, title: "Principle 9 (Customer Value)" },
];

const TrainingModal = ({
  show,
  handleClose,
  actionId,
  editData,
  financialYearId,
}) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [topicMapping, setTopicMapping] = useState([]);
  const [trainingTopicData, setTrainingTopicData] = useState([]);

  // New state for training categories
  const [trainingCategories, setTrainingCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [formData, setFormData] = useState({
    trainingTitle: "",
    description: "",
    trainingFacilitator: "",
    trainers: "",
    departmentId: 0,
    fromDate: "",
    toDate: "",
    fromTime: "",
    toTime: "",
    targetAudience: [],
    modeOfTraining: "ONLINE",
    registrationDeadline: "",
    linkOrVenues: "",
    companyId: 0,
    categoryIds: [],
  });

  // Add validation state
  const [errors, setErrors] = useState({});
  const [showValidationAlert, setShowValidationAlert] = useState(false);

  const [showContentModal, setShowContentModal] = useState(false);
  const [contentModalData, setContentModalData] = useState("");
  const [desable, setDesable] = useState(false);
  const [updatedTopics, setUpdatedTopics] = useState(() =>
    Math.floor(Math.random() * 100)
  );

  // Helper function to get principle titles from IDs
  const getPrincipleTitles = (principleIds) => {
    if (!principleIds || !Array.isArray(principleIds)) return [];

    return principleIds.map((id) => {
      const principle = defaultPrinciplesData.find((p) => p.id === id);
      return principle ? principle.title : `Principle ${id}`;
    });
  };

  // Helper function to get all unique principle IDs from selected topics
  const getAllPrincipleIds = () => {
    if (!topicMapping || !topicMapping.length) return [];

    const allPrincipleIds = [];
    topicMapping.forEach((topic) => {
      if (
        topic.trainingPrincipleId &&
        Array.isArray(topic.trainingPrincipleId)
      ) {
        allPrincipleIds.push(...topic.trainingPrincipleId);
      }
    });

    // Remove duplicates
    return [...new Set(allPrincipleIds)];
  };

  // Get display text for KPIs based on selected topics
  const getKPIDisplayText = () => {
    if (!topicMapping || !topicMapping.length) return "select kpi";

    const allPrincipleIds = getAllPrincipleIds();
    const principleTitles = getPrincipleTitles(allPrincipleIds);

    return principleTitles.length > 0
      ? principleTitles.join(", ")
      : "select kpi";
  };

  // New function to fetch training categories
  const getTrainingCategories = async () => {
    try {
      const apiUrl = `${config.POSTLOGIN_API_URL_COMPANY}getTrainingCategory`;

      const { isSuccess, data } = await apiCall(apiUrl, {}, {}, "GET");

      if (isSuccess && data?.data) {
        setTrainingCategories(data.data);
      } else {
        setTrainingCategories([]);
      }
    } catch (error) {
      console.error("Error fetching training categories:", error);
      setTrainingCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Modal content display handler
  const handleShowContent = (content) => {
    setContentModalData(content);
    setShowContentModal(true);
  };

  // Fetch training topic mapping data
  const getTrainingTopicMapping = async () => {
    try {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getTrainingTopicMapping`,
        {},
        {},
        "GET"
      );
      if (isSuccess) {
        setTrainingTopicData(data?.data || []);

        // If editing, filter the topics based on the existing data
        if (editData && editData.trainingTopicID) {
          const topicIds = Array.isArray(editData.trainingTopicID)
            ? editData.trainingTopicID
            : JSON.parse(editData.trainingTopicID || "[]");

          const filteredArray =
            data?.data.filter((obj) => topicIds.includes(obj.id)) || [];

          setTopicMapping(filteredArray);
        }
      }
    } catch (error) {
      console.error("Error fetching training topic mapping:", error);
    }
  };

  // Handle edit data population
  useEffect(() => {
    if (editData) {
      getTrainingTopicMapping();

      // Parse target audience if needed
      let parsedTargetAudience = editData.targetAudience;

      if (
        typeof editData.targetAudience === "string" &&
        editData.targetAudience
      ) {
        try {
          parsedTargetAudience = JSON.parse(editData.targetAudience);
        } catch (e) {
          console.error("Error parsing target audience:", e);
          parsedTargetAudience = [];
        }
      }

      // Handle categoryIds - ensure it's an array
      let parsedCategoryIds = editData.categoryIds;
      if (typeof editData.categoryIds === "string") {
        try {
          parsedCategoryIds = JSON.parse(editData.categoryIds);
        } catch (e) {
          // If it's a single number as string, convert to array
          parsedCategoryIds = [parseInt(editData.categoryIds)];
        }
      } else if (typeof editData.categoryIds === "number") {
        parsedCategoryIds = [editData.categoryIds];
      } else if (!Array.isArray(editData.categoryIds)) {
        parsedCategoryIds = [];
      }

      // Update form data with edit data
      setFormData({
        ...formData,
        ...editData,
        categoryIds: parsedCategoryIds
      });
    }
  }, [editData]);

  // Initial data fetch
  useEffect(() => {
    getTrainingTopicMapping();
    getTrainingCategories(); // Fetch all categories initially
  }, []);

  useEffect(() => {
    getTrainingTopicMapping();
  }, [updatedTopics]);

  // Topic filter modal handlers
  const openFilterModal = () => {
    setIsFilterModalOpen(true);
  };

  const closeFilterModal = () => {
    setIsFilterModalOpen(false);

    // Clear topic mapping error if topics were selected
    if (topicMapping.length > 0 && errors.topicMapping) {
      setErrors({
        ...errors,
        topicMapping: undefined,
      });
    }
  };

  // Get current financial year
  const getFinancialYear = async () => {
    try {
      // Check if data exists in local storage
      const storedData = localStorage.getItem("financialYearData");

      if (storedData) {
        // Data exists in local storage, parse and use it
        const parsedData = JSON.parse(storedData);
        if (parsedData.length) {
          return parsedData[parsedData.length - 1].id;
        }
        return null;
      } else {
        // Data not in local storage, call API
        const { isSuccess, data } = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}getFinancialYear`,
          {},
          {}
        );

        if (isSuccess && data?.data?.length) {
          // Store the response in local storage for future use
          localStorage.setItem("financialYearData", JSON.stringify(data.data));

          // Return the ID of the last entry
          return data.data[data.data.length - 1].id;
        }
        return null;
      }
    } catch (error) {
      console.error("Error fetching financial year:", error);
      return null;
    }
  };

  // Form change handler with error clearing
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear the error for this field when changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }

    // Hide validation alert when user makes changes
    if (showValidationAlert) {
      setShowValidationAlert(false);
    }
  };

  // Location selection handler
  const handleSelect = async (value) => {
    try {
      const results = await geocodeByAddress(value);
      const { lat, lng } = await getLatLng(results[0]);

      const countryComponent = results[0].address_components.find((comp) =>
        comp.types.includes("country")
      );
      const stateComponent = results[0].address_components.find((comp) =>
        comp.types.includes("administrative_area_level_1")
      );
      const cityComponent = results[0].address_components.find((comp) =>
        comp.types.includes("locality")
      );

      const locationString = [
        cityComponent?.long_name || "",
        stateComponent?.long_name || "",
        countryComponent?.long_name || "",
      ]
        .filter(Boolean)
        .join(", ");

      setFormData({
        ...formData,
        linkOrVenues: locationString,
      });

      // Clear location error
      if (errors.linkOrVenues) {
        setErrors({
          ...errors,
          linkOrVenues: undefined,
        });
      }
    } catch (error) {
      console.error("Error fetching location details: ", error);
    }
  };

  const sendInvite = async (trainer, email, phone) => {
    const userId = JSON.parse(localStorage.getItem("user_temp_id"));

    const { isSuccess, data, error } = await apiCall(
      config.POSTLOGIN_API_URL_COMPANY + `inviteSubUser`,
      {},
      {
        firstName: trainer.name.split(" ")[0], // Assuming first name is the first word in the name
        lastName: trainer.name.split(" ")[1] || "", // Assuming last name is the second word
        emailId: email,
        mobileNumber: phone,
        invitedBy: Number(userId),
        designationId: Number(1),
        sourceId: JSON.stringify([1]),
        roleId: Number(30),
        type: "TRAINER",
      },
      "POST"
    );

    if (isSuccess) {
      console.log(data?.data?.userId, data);
      return { userId: data?.userId };
    } else {
      // Handle failure response here (e.g., show an error message)
      console.error("Failed to send invite to:", trainer.name, error);
    }
  };

  const [trainers, setTrainers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [trainerDetails, setTrainerDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (formData.trainers && Array.isArray(formData.trainers)) {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const fullName =
        currentUser.first_name.toLowerCase() +
        " " +
        currentUser.last_name.toLowerCase();

      const trainerObjects = formData.trainers.map((trainer) => {
        const trainerName = trainer.name.trim();
        return {
          name: trainerName,
          isValidated: trainerName.toLowerCase() === fullName,
          isSelected: !trainer.is_external,
          email: "",
          phone: "",
          is_external: trainer.is_external ?? false,
        };
      });

      setTrainers(trainerObjects);

      // Update the raw input string too
      setTrainersInput(formData.trainers.map((t) => t.name).join(", "));

      // Clear trainer errors if trainers exist
      if (trainerObjects.length > 0 && errors.trainers) {
        setErrors({
          ...errors,
          trainers: undefined,
        });
      }
    } else {
      setTrainers([]);
      setTrainersInput("");
    }
  }, [formData.trainers]);

  // Save trainer details from modal
  const saveTrainerDetails = () => {
    if (selectedTrainer) {
      const updatedTrainers = trainers.map((trainer) =>
        trainer.name === selectedTrainer.name
          ? {
              ...trainer,
              email: trainerDetails.email,
              phone: trainerDetails.phone,
            }
          : trainer
      );
      setTrainers(updatedTrainers);
      setShowModal(false);

      // Clear trainer details error if all selected trainers have emails
      const selectedTrainersWithoutEmail = updatedTrainers
        .filter((t) => t.isSelected && !t.isValidated)
        .some((t) => !t.email);

      if (!selectedTrainersWithoutEmail && errors.trainersDetails) {
        setErrors({
          ...errors,
          trainersDetails: undefined,
        });
      }
    }
  };

  const handleCheckboxChange = (index) => {
    const updatedTrainers = [...trainers];
    updatedTrainers[index].isSelected = !updatedTrainers[index].isSelected;
    setTrainers(updatedTrainers);

    // If checked, open modal for details
    if (updatedTrainers[index].isSelected) {
      setSelectedTrainer(updatedTrainers[index]);
      setTrainerDetails({
        name: updatedTrainers[index].name,
        email: updatedTrainers[index].email || "",
        phone: updatedTrainers[index].phone || "",
      });
      setShowModal(true);
    }
  };

  const handleModalInputChange = (e) => {
    const { name, value } = e.target;
    setTrainerDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleShowDetails = (trainer, index) => {
    setSelectedTrainer({ ...trainer, index });
    setTrainerDetails({
      name: trainer.name,
      email: trainer.email || "",
      phone: trainer.phone || "",
    });
    setShowModal(true);
  };

  const [trainersInput, setTrainersInput] = useState("");
  const handleTrainerInputBlur = () => {
    const names = trainersInput
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name);

    const trainerObjects = names.slice(0, 100).map((name) => ({
      name,
      is_external: true,
    }));

    setFormData((prev) => ({
      ...prev,
      trainers: trainerObjects,
    }));

    // Clear trainer errors if trainers were added
    if (names.length > 0 && errors.trainers) {
      setErrors({
        ...errors,
        trainers: undefined,
      });
    }
  };

  // Form validation function
  const validateForm = () => {
    const newErrors = {};

    // Check all required fields
    if (!formData.trainingTitle.trim())
      newErrors.trainingTitle = "Training title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.trainingFacilitator.trim())
      newErrors.trainingFacilitator = "Facilitator is required";

    // Check trainers
    if (!trainers.length) {
      newErrors.trainers = "At least one trainer is required";
    } else {
      // Validate selected trainers have email details
      const selectedTrainers = trainers.filter(
        (t) => t.isSelected && !t.isValidated
      );
      if (selectedTrainers.some((t) => !t.email)) {
        newErrors.trainersDetails =
          "All selected trainers require email details";
      }
    }

    // Check dates and times
    if (!formData.fromDate) newErrors.fromDate = "From date is required";
    if (!formData.toDate) newErrors.toDate = "To date is required";
    if (!formData.fromTime) newErrors.fromTime = "From time is required";
    if (!formData.toTime) newErrors.toTime = "To time is required";

    // Check mode and location
    if (!formData.modeOfTraining)
      newErrors.modeOfTraining = "Training mode is required";
    if (!formData.linkOrVenues || !formData.linkOrVenues.trim()) {
      newErrors.linkOrVenues = "Location is required";
    }

    // Check if topics are selected
    if (!topicMapping.length) {
      newErrors.topicMapping = "At least one training topic must be selected";
    }

    // Check training category selection
    if (!formData.categoryIds || formData.categoryIds.length === 0) {
      newErrors.categoryIds = "At least one training category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form
    const isValid = validateForm();
    if (!isValid) {
      setShowValidationAlert(true);
      // Scroll to top to show the alert
      window.scrollTo(0, 0);
      return;
    }

    setDesable(true);

    try {
      const yearId = financialYearId || (await getFinancialYear());
      const trainingTopicID = topicMapping.map((item) => item.id);

      // Get all unique principle IDs from selected topics
      const principlesId = getAllPrincipleIds();

      let processedTrainers = [];

      processedTrainers = await Promise.all(
        trainers.map(async (trainer) => {
          if (trainer.isSelected && trainer.email) {
            const response = await sendInvite(
              trainer,
              trainer.email,
              trainer.phone
            );
            return {
              name: trainer.name,
              is_external: false,
              ...(response?.userId && { user_id: response.userId }),
            };
          } else {
            return {
              name: trainer.name,
              is_external: true,
            };
          }
        })
      );

      const payload = {
        ...formData,
        targetAudience: formData.targetAudience,
        financialYearId: yearId,
        trainingTopicID,
        principlesId, // This will now be a flattened array of unique principle IDs
        companyId: Number(localStorage.getItem("user_temp_id")),
        trainers: processedTrainers,
        categoryIds: formData.categoryIds, // Include training categories
        ...(actionId ? { trainingId: actionId } : {}),
      };

      const apiUrl = `${config.POSTLOGIN_API_URL_COMPANY}${
        actionId ? "updateTraining" : "createNewTraining"
      }`;

      const { isSuccess, data } = await apiCall(apiUrl, {}, payload, "POST");

      setDesable(false);

      if (isSuccess) {
        handleClose();
      } else {
        console.error("API call returned error:", data);
        setShowValidationAlert(true);
      }
    } catch (error) {
      setDesable(false);
      console.error("API call failed", error);
      setShowValidationAlert(true);
    }
  };

  const [isSameAsFacilitator, setIsSameAsFacilitator] = useState(false);

  const formatDateToInputValue = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ("0" + (d.getMonth() + 1)).slice(-2);
    const day = ("0" + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        centered
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          
        }}
      >
        <Modal.Header>
          <Modal.Title>{actionId ? "Edit" : "Create"} Training</Modal.Title>
          <Button
            variant="link"
            className="close-button p-0"
            onClick={handleClose}
          >
            <img src={CloseIcon} alt="close" />
          </Button>
        </Modal.Header>
        <Modal.Body>
          {showValidationAlert && (
            <Alert
              variant="danger"
              onClose={() => setShowValidationAlert(false)}
              dismissible
            >
              Please fill in all required fields before submitting.
            </Alert>
          )}

          <p className="text-muted mb-3">
            All fields are required<span className="text-danger">*</span>
          </p>

          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    Name Of Training <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="trainingTitle"
                    placeholder="Online mandatory trainings (global)"
                    value={formData.trainingTitle}
                    onChange={handleChange}
                    required
                    isInvalid={!!errors.trainingTitle}
                  />
                  {errors.trainingTitle && (
                    <Form.Control.Feedback type="invalid">
                      {errors.trainingTitle}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    Select Topics <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="d-flex align-items-center">
                    <Form.Control
                      type="text"
                      onDoubleClick={() =>
                        handleShowContent(
                          topicMapping && topicMapping.length
                            ? topicMapping.map((item) => item.topic).join(", ")
                            : "select training topic"
                        )
                      }
                      value={
                        topicMapping && topicMapping.length
                          ? topicMapping.map((item) => item.topic).join(", ")
                          : "select training topic"
                      }
                      readOnly
                      isInvalid={!!errors.topicMapping}
                    />
                    <div
                      className="filter-icon ms-2"
                      style={{ cursor: "pointer" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        openFilterModal();
                      }}
                    >
                      <img src={img} alt="Filter" />
                    </div>
                  </div>
                  {errors.topicMapping && (
                    <Form.Control.Feedback type="invalid">
                      {errors.topicMapping}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    KPI's <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="kpis"
                    placeholder="Automated Response After Selecting The Topic"
                    value={getKPIDisplayText()}
                    onDoubleClick={() => handleShowContent(getKPIDisplayText())}
                    readOnly
                    isInvalid={!!errors.topicMapping}
                  />
                  {errors.topicMapping && (
                    <Form.Control.Feedback type="invalid">
                      Please select at least one training topic
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    Training Categories <span className="text-danger">*</span>
                  </Form.Label>
                  <Select
                    isMulti
                    name="categoryIds"
                    options={trainingCategories.map((category) => ({
                      value: category.id,
                      label: `${category.title}${
                        category.framework
                          ? ` - ${category.framework.title || category.framework.name}`
                          : ""
                      }`,
                    }))}
                    value={trainingCategories
                      .filter((category) =>
                        formData.categoryIds?.includes(category.id)
                      )
                      .map((category) => ({
                        value: category.id,
                        label: `${category.title}${
                          category.framework
                            ? ` - ${category.framework.title || category.framework.name}`
                            : ""
                        }`,
                      }))}
                    onChange={(selectedOptions) => {
                      const selectedIds = selectedOptions
                        ? selectedOptions.map((option) => option.value)
                        : [];
                      setFormData({
                        ...formData,
                        categoryIds: selectedIds,
                      });

                      if (errors.categoryIds && selectedIds.length > 0) {
                        setErrors({
                          ...errors,
                          categoryIds: undefined,
                        });
                      }

                      if (showValidationAlert) {
                        setShowValidationAlert(false);
                      }
                    }}
                    isLoading={loadingCategories}
                    isDisabled={loadingCategories}
                    placeholder="Select training categories..."
                    className={errors.categoryIds ? "is-invalid" : ""}
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        borderColor: errors.categoryIds
                          ? "#dc3545"
                          : state.isFocused
                          ? "#86b7fe"
                          : "#ced4da",
                        boxShadow: state.isFocused
                          ? errors.categoryIds
                            ? "0 0 0 0.25rem rgba(220, 53, 69, 0.25)"
                            : "0 0 0 0.25rem rgba(13, 110, 253, 0.25)"
                          : "none",
                        "&:hover": {
                          borderColor: errors.categoryIds ? "#dc3545" : "#86b7fe",
                        },
                      }),
                      menu: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                    }}
                    noOptionsMessage={() =>
                      trainingCategories.length === 0
                        ? "No categories available"
                        : "No options"
                    }
                  />
                  {errors.categoryIds && (
                    <div
                      className="invalid-feedback"
                      style={{ display: "block" }}
                    >
                      {errors.categoryIds}
                    </div>
                  )}
                </Form.Group>
              </Col>

            </Row>

            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>
                    Training Details <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="description"
                    placeholder="Details of the training"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    isInvalid={!!errors.description}
                  />
                  {errors.description && (
                    <Form.Control.Feedback type="invalid">
                      {errors.description}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
            </Row>

            {/* Rest of the form remains the same... */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    Training Facilitator <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="trainingFacilitator"
                    placeholder="Name"
                    value={formData.trainingFacilitator}
                    onChange={handleChange}
                    required
                    isInvalid={!!errors.trainingFacilitator}
                  />
                  {errors.trainingFacilitator && (
                    <Form.Control.Feedback type="invalid">
                      {errors.trainingFacilitator}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                {/* Checkbox to autofill Trainers */}
                <Form.Check
                  type="checkbox"
                  label="Trainer Same as Training Facilitator"
                  checked={isSameAsFacilitator}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setIsSameAsFacilitator(checked);

                    if (checked) {
                      const facilitatorName = formData.trainingFacilitator;
                      setFormData({
                        ...formData,
                        trainers: facilitatorName
                          ? [{ name: facilitatorName, is_external: true }]
                          : [],
                      });
                    } else {
                      setFormData({
                        ...formData,
                        trainers: [],
                      });
                    }
                  }}
                  className="mt-2"
                />
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    Trainers Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="trainers"
                    placeholder="Add trainers (comma separated)"
                    value={trainersInput}
                    onChange={(e) => {
                      setTrainersInput(e.target.value);

                      // Clear trainer errors when typing
                      if (errors.trainers) {
                        setErrors({
                          ...errors,
                          trainers: undefined,
                        });
                      }
                    }}
                    onBlur={handleTrainerInputBlur}
                    isInvalid={!!errors.trainers}
                  />
                  {errors.trainers && (
                    <Form.Control.Feedback type="invalid">
                      {errors.trainers}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                <Modal
                  show={showModal}
                  onHide={() => setShowModal(false)}
                  centered
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                    
                  }}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Trainer Details</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={trainerDetails.name}
                          readOnly
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Email Address <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="Enter email address"
                          value={trainerDetails.email}
                          onChange={handleModalInputChange}
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          placeholder="Enter phone number"
                          value={trainerDetails.phone}
                          onChange={handleModalInputChange}
                        />
                      </Form.Group>
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={saveTrainerDetails}
                      disabled={!trainerDetails.email}
                    >
                      Save Details
                    </Button>
                  </Modal.Footer>
                </Modal>
              </Col>
              <Col md={12}>
                {trainers.length > 0 && (
                  <div
                    className="mt-2 trainer-validation-section"
                    style={{ marginRight: "10px" }}
                  >
                    <p className="mb-2">Trainer Validation:</p>
                    {errors.trainersDetails && (
                      <div className="text-danger mb-2">
                        {errors.trainersDetails}
                      </div>
                    )}
                    <div className="trainer-list">
                      {trainers.map((trainer, index) => (
                        <div
                          key={index}
                          className="d-flex align-items-center mb-2 p-2"
                          style={{
                            backgroundColor: "#f8f9fa",
                            borderRadius: "8px",
                          }}
                        >
                          <div className="me-3" style={{ width: "24px" }}>
                            {!trainer.isValidated && (
                              <Form.Check
                                type="checkbox"
                                checked={trainer.isSelected}
                                onChange={() => handleCheckboxChange(index)}
                                aria-label={`Select ${trainer.name}`}
                              />
                            )}
                          </div>
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-center">
                              <span className="trainer-name">
                                {trainer.name}
                              </span>
                              <div className="ms-auto d-flex">
                                {" "}
                                {!trainer.isValidated && (
                                  <div className="ms-2">
                                    <Button
                                      variant="outline-primary"
                                      size="sm"
                                      onClick={() =>
                                        handleShowDetails(trainer, index)
                                      }
                                    >
                                      {trainer.email || trainer.phone
                                        ? "View Details"
                                        : "Add Details"}
                                    </Button>
                                  </div>
                                )}
                                <span
                                  className="ms-2"
                                  style={{
                                    backgroundColor: trainer.isValidated
                                      ? "#d1e7dd"
                                      : "#f8d7da",
                                    color: trainer.isValidated
                                      ? "#0f5132"
                                      : "#842029",
                                    padding: "0.24em 0.65em",
                                    borderRadius: "10px",
                                  }}
                                >
                                  {trainer.isValidated
                                    ? "Validated"
                                    : "Needs Account ?"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={3}>
                <Form.Group>
                  <Form.Label>
                    From Date <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="fromDate"
                    value={formatDateToInputValue(formData.fromDate)}
                    onChange={handleChange}
                    required
                    isInvalid={!!errors.fromDate}
                  />
                  {errors.fromDate && (
                    <Form.Control.Feedback type="invalid">
                      {errors.fromDate}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={3} className="mx-0">
                <Form.Group>
                  <Form.Label>
                    To Date <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="toDate"
                    value={formatDateToInputValue(formData.toDate)}
                    onChange={handleChange}
                    min={formatDateToInputValue(formData.fromDate)}
                    required
                    isInvalid={!!errors.toDate}
                  />
                  {errors.toDate && (
                    <Form.Control.Feedback type="invalid">
                      {errors.toDate}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>
                    From Time <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="time"
                    name="fromTime"
                    value={formData.fromTime}
                    onChange={handleChange}
                    required
                    isInvalid={!!errors.fromTime}
                  />
                  {errors.fromTime && (
                    <Form.Control.Feedback type="invalid">
                      {errors.fromTime}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>
                    To Time <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="time"
                    name="toTime"
                    value={formData.toTime}
                    onChange={handleChange}
                    required
                    isInvalid={!!errors.toTime}
                  />
                  {errors.toTime && (
                    <Form.Control.Feedback type="invalid">
                      {errors.toTime}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    Mode Of Training <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="modeOfTraining"
                    value={formData.modeOfTraining}
                    onChange={handleChange}
                    required
                    isInvalid={!!errors.modeOfTraining}
                  >
                    <option value="">Select</option>
                    <option value="ONLINE">Online</option>
                    <option value="OFFLINE">Offline</option>
                  </Form.Select>
                  {errors.modeOfTraining && (
                    <Form.Control.Feedback type="invalid">
                      {errors.modeOfTraining}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    Location <span className="text-danger">*</span>
                  </Form.Label>
                  {formData.modeOfTraining === "ONLINE" && (
                    <Form.Control
                      type="text"
                      name="linkOrVenues"
                      placeholder="Add venue link"
                      value={formData.linkOrVenues}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          linkOrVenues: e.target.value,
                        })
                      }
                      required
                      isInvalid={!!errors.linkOrVenues}
                    />
                  )}

                  {formData.modeOfTraining === "OFFLINE" && (
                    <PlacesAutocomplete
                      value={formData.linkOrVenues}
                      onChange={(address) =>
                        setFormData({ ...formData, linkOrVenues: address })
                      }
                      onSelect={handleSelect}
                    >
                      {({
                        getInputProps,
                        suggestions,
                        getSuggestionItemProps,
                        loading,
                      }) => (
                        <div>
                          <Form.Control
                            {...getInputProps({
                              placeholder: "Search City, State, or Country...",
                              required: true,
                              isInvalid: !!errors.linkOrVenues,
                            })}
                          />
                          {errors.linkOrVenues && (
                            <div
                              className="invalid-feedback"
                              style={{ display: "block" }}
                            >
                              {errors.linkOrVenues}
                            </div>
                          )}
                          <div className="autocomplete-dropdown">
                            {loading && <div>Loading...</div>}
                            {suggestions.map((suggestion) => {
                              const terms = suggestion.terms || [];
                              const locationDetails = terms
                                .slice(0, 3)
                                .map((term) => term.value)
                                .join(", ");

                              const style = {
                                backgroundColor: suggestion.active
                                  ? "#f4f4f4"
                                  : "#ffffff",
                                cursor: "pointer",
                                padding: "10px",
                              };

                              return (
                                <div
                                  {...getSuggestionItemProps(suggestion, {
                                    style,
                                  })}
                                  key={suggestion.placeId}
                                >
                                  {locationDetails}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </PlacesAutocomplete>
                  )}
                  {errors.linkOrVenues &&
                    formData.modeOfTraining !== "OFFLINE" && (
                      <Form.Control.Feedback type="invalid">
                        {errors.linkOrVenues}
                      </Form.Control.Feedback>
                    )}
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={desable}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Topic Filter Modal */}
      {isFilterModalOpen && (
        <TrainingFilterModal
          onClose={closeFilterModal}
          topicMapping={topicMapping}
          setTopicMapping={setTopicMapping}
          trainingTopicData={trainingTopicData}
          show={isFilterModalOpen}
          setUpdatedTopics={setUpdatedTopics}
        />
      )}

      {/* Content Display Modal */}
      <Modal
        show={showContentModal}
        onHide={() => setShowContentModal(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>{contentModalData}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowContentModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TrainingModal;
