import { Modal, Button, Row } from "react-bootstrap";
import { FiX, FiPlus } from "react-icons/fi";
import EmissionEntryForm from "./EmissionEntryForm";


const EmissionEntryModal = ({
  show,
  onHide,
  onSubmit,
  locationOptions,
  timePeriodOptions,
  emissionEntries,
  categories,
  financialYearOptions,
  selectedFinancialYear,
  setSelectedFinancialYear,
  scopeData, 
  ghgProtocol,
  selectedScope,
  protocol,
  scope3Categories,
  identifier
}) => {


  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      centered
      backdrop="static"
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <Modal.Header
        className="border-0 pb-0"
        style={{
          background: "linear-gradient(135deg, #3c8dbb, #7494a7)",
          color: "white",
        }}
      >
        <div className="d-flex align-items-center">
          <div
            className="me-3 d-flex align-items-center justify-content-center"
            style={{
              width: "48px",
              height: "48px",
              background: "rgba(255, 255, 255, 0.2)",
              borderRadius: "12px",
              
            }}
          >
            <FiPlus size={24} style={{ color: "white" }} />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <Modal.Title
              style={{
                fontWeight: "700",
                fontSize: "1.75rem",
                color: "white",
                letterSpacing: "-0.025em",
              }}
            >
              Add Emission Entry - {protocol}
            </Modal.Title>
            <p
              style={{
                margin: 0,
                fontSize: "1rem",
                color: "rgba(255, 255, 255, 0.8)",
                fontWeight: "400",
              }}
            >
              Track your carbon footprint data
            </p>
          </div>
        </div>
        <Button
          variant="link"
          onClick={onHide}
          className="p-2 border-0"
          style={{
            color: "rgba(255, 255, 255, 0.8)",
            fontSize: "1.5rem",
            textDecoration: "none",
            transition: "all 0.2s ease",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "8px",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = "white";
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)";
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
          }}
        >
          <FiX />
        </Button>
      </Modal.Header>

      <Modal.Body
        style={{
          padding: "2rem",
          background: "linear-gradient(to bottom, #f8fafc, #ffffff)",
          minHeight: "400px",
          maxHeight: "70vh",
          overflowY: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "#cbd5e1 #f1f5f9",
        }}
      >
      <EmissionEntryForm
        emissionEntries={emissionEntries}
        financialYearOptions={financialYearOptions}
        handleSubmitData={onSubmit}
        locationOptions={locationOptions}
        timePeriodOptions={timePeriodOptions}
        categories={categories}
        setSelectedFinancialYear={setSelectedFinancialYear}
        selectedFinancialYear={selectedFinancialYear}
        scopeData={scopeData}
        scope3Categories={scope3Categories}
        ghgProtocol={ghgProtocol}
        selectedScope={selectedScope}
        identifier={identifier}
      />
      </Modal.Body>
    </Modal>
  );
};

export default EmissionEntryModal;
