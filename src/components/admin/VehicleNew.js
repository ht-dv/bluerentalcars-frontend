import React, { useState, useRef } from "react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useFormik } from "formik";

import {
  Form,
  Button,
  Spinner,
  Row,
  Col,
  ButtonGroup,
  Image,
  Badge,
} from "react-bootstrap";
import {
  createVehicle,
  uploadVehicleImage,
} from "../../api/admin-vehicle-service";
import { Link, useNavigate } from "react-router-dom";

const VehicleNew = () => {
  const [loading, setLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const navigate = useNavigate();
  const fileImageRef = useRef();

  const initialValues = {
    model: "",
    doors: "",
    seats: "",
    luggage: "",
    transmission: "",
    airConditioning: true,
    fuelType: "",
    age: "",
    pricePerHour: "",
    image: "",
  };

  const validationSchema = Yup.object({
    model: Yup.string().required("Please enter the model"),
    doors: Yup.number().required("Please enter number of doors"),
    seats: Yup.number().required("Please enter number of seats"),
    luggage: Yup.number().required("Please enter luggage capacity"),
    transmission: Yup.string().required("Please enter type of transmission"),
    airConditioning: Yup.boolean().required(
      "Please enter whether air conditioning exists or not"
    ),
    fuelType: Yup.string().required("Please enter type of fuel"),
    age: Yup.number().required("Please enter age"),
    pricePerHour: Yup.number().required("Please enter price per hour"),
    image: Yup.mixed().required("Please select an image"),
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", values.image);
      const respUpload = await uploadVehicleImage(formData);
      if (respUpload.status !== 200)
        throw "An error occurred while uploading the image.";

      const imageId = respUpload.data.imageId;

      delete values["image"];

      const respVehicle = await createVehicle(values, imageId);
      if (respVehicle.status !== 200)
        throw "An error occurred while creating the vehicle.";

      setLoading(false);
      toast("Vehicle has been created successfully.");
      navigate("/admin/vehicles");
    } catch (error) {
      toast(error);
      setLoading(false);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit,
  });

  const handleImageChange = () => {
    const file = fileImageRef.current.files[0];
    if (!file) return;

    formik.setFieldValue("image", file);
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = (e) => {
      setImageSrc(reader.result);
    };
  };

  const handleSelectImage = () => {
    fileImageRef.current.click();
  };

  return (
    <Form noValidate onSubmit={formik.handleSubmit}>
      <Row>
        <Col lg={3} className="image-area">
          <Form.Control
            type="file"
            ref={fileImageRef}
            name="image"
            onChange={handleImageChange}
            className="d-none"
          />
          <Image src={imageSrc} className="img-fluid" />
          {formik.errors.image && (
            <Badge bg="danger" className="image-area-error">
              Please select an image
            </Badge>
          )}
          <Button
            onClick={handleSelectImage}
            variant={formik.errors.image ? "danger" : "primary"}
          >
            Select an Image
          </Button>
        </Col>

        <Col lg={9}>
          <Row>
            <Form.Group as={Col} md={4} lg={3} className="mb-3">
              <Form.Label>Model</Form.Label>
              <Form.Control
                type="text"
                {...formik.getFieldProps("model")}
                isInvalid={!!formik.errors.model}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.model}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md={4} lg={3} className="mb-3">
              <Form.Label>Doors</Form.Label>
              <Form.Control
                type="number"
                {...formik.getFieldProps("doors")}
                isInvalid={!!formik.errors.doors}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.doors}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md={4} lg={3} className="mb-3">
              <Form.Label>Seats</Form.Label>
              <Form.Control
                type="number"
                {...formik.getFieldProps("seats")}
                isInvalid={!!formik.errors.seats}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.seats}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md={4} lg={3} className="mb-3">
              <Form.Label>Luggage</Form.Label>
              <Form.Control
                type="number"
                {...formik.getFieldProps("luggage")}
                isInvalid={!!formik.errors.luggage}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.luggage}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md={4} lg={3} className="mb-3">
              <Form.Label>Transmission</Form.Label>
              <Form.Select
                {...formik.getFieldProps("transmission")}
                isInvalid={!!formik.errors.transmission}
              >
                <option>Select</option>
                <option value="Automatic">Automatic</option>
                <option value="Manuel">Manuel</option>
                <option value="Tiptronic">Tiptronic</option>
              </Form.Select>

              <Form.Control.Feedback type="invalid">
                {formik.errors.transmission}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md={4} lg={3} className="mb-3">
              <Form.Label>Air Conditioning</Form.Label>
              <Form.Select
                {...formik.getFieldProps("airConditioning")}
                isInvalid={!!formik.errors.airConditioning}
              >
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </Form.Select>

              <Form.Control.Feedback type="invalid">
                {formik.errors.airConditioning}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md={4} lg={3} className="mb-3">
              <Form.Label>Fuel Type</Form.Label>
              <Form.Select
                {...formik.getFieldProps("fuelType")}
                isInvalid={!!formik.errors.fuelType}
              >
                <option>Select</option>
                <option value="Electricity">Electricity</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Gasoline">Gasoline</option>
                <option value="Diesel">Diesel</option>
                <option value="Hydrogen">Hydrogen</option>
                <option value="LPG">LPG</option>
                <option value="CNG">CNG</option>
              </Form.Select>

              <Form.Control.Feedback type="invalid">
                {formik.errors.fuelType}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md={4} lg={3} className="mb-3">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                {...formik.getFieldProps("age")}
                isInvalid={!!formik.errors.age}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.age}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md={4} lg={3} className="mb-3">
              <Form.Label>Price per hour</Form.Label>
              <Form.Control
                type="number"
                {...formik.getFieldProps("pricePerHour")}
                isInvalid={!!formik.errors.pricePerHour}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.pricePerHour}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
        </Col>
      </Row>
      <div className="text-end">
        <ButtonGroup aria-label="Basic example">
          <Button variant="primary" type="submit" disabled={loading}>
            {loading && (
              <Spinner animation="border" variant="light" size="sm" />
            )}{" "}
            Create
          </Button>
          <Button
            variant="secondary"
            type="button"
            variant="secondary"
            as={Link}
            to="/admin/vehicles"
          >
            Cancel
          </Button>
        </ButtonGroup>
      </div>
    </Form>
  );
};

export default VehicleNew;
