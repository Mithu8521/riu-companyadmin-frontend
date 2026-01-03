import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";


export const DetailModal = ({ isModalOpen, setIsModalOpen, data }) => {
  const [show, setShow] = useState();
  useEffect(() => {
    if (data !== "") {
      setShow(data);
    }
  }, [data]);

  return (
    <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Data</Modal.Title>
      </Modal.Header>
      <Modal.Body>{show}</Modal.Body>

    </Modal>
  );
};
