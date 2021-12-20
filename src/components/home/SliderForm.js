import React, { useState } from "react";
import {
  Form,
  InputGroup,
  FormControl,
  Button,
  Spinner,
} from "react-bootstrap";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import { useFormik } from "formik";
import * as Yup from "yup";
import CompleteReservationModal from "./CompleteReservationModal";
import { useStore } from "../../store";
import { setReservationState } from "../../store/reservation/reservationActions";
import { toast } from "react-toastify";
import { isVehicleAvailable } from "../../api/reservation-service";
import moment from "moment";
import SearchPlace from "../common/SearchPlace";

const SliderForm = () => {
  const [loading, setLoading] = useState(false);
  const { dispatchReservation, vehiclesState, userState } = useStore();
  const { vehicles } = vehiclesState;
  const { isUserLogin } = userState;
  const [modalShow, setModalShow] = useState(false);

  const initialValues = {
    car: "",
    pickUpLocation: "",
    dropOfLocation: "",
    pickUpDate: "",
    pickUpTime: "",
    dropOffDate: "",
    dropOffTime: "",
    totalPrice: 0,
  };

  const validationSchema = Yup.object({
    car: Yup.string().required("Select a car please."),
    pickUpLocation: Yup.string().required("Enter a pick up place please."),
    dropOfLocation: Yup.string().required("Enter a drop off place please."),
    pickUpDate: Yup.string().required("Select a pick up date please."),
    pickUpTime: Yup.string().required("Select a pick up time please."),
    dropOffDate: Yup.string().required("Select a drop off date please."),
    dropOffTime: Yup.string().required("Select a drop off time please."),
  });

  const onSubmit = (values) => {
    const { car, pickUpDate, pickUpTime, dropOffDate, dropOffTime } = values;

    if (!isUserLogin) {
      toast("Please first log in.");
      return;
    }

    // Aracın belirtilen tarih aralığında müsait olup olmadığı kontrol ediliyor:

    const reservationDto = {
      vehicleId: car,
      pickUpDateTime: moment(`${pickUpDate} ${pickUpTime} `).format(
        "MM/DD/YYYY HH:mm:ss"
      ),
      dropOffDateTime: moment(`${dropOffDate} ${dropOffTime} `).format(
        "MM/DD/YYYY HH:mm:ss"
      ),
    };

    setLoading(true);
    isVehicleAvailable(reservationDto).then((resp) => {
      setLoading(false);
      const { isAvailable, totalPrice } = resp.data;

      if (!isAvailable) {
        toast(
          "The car is not available on the days you have chosen. Please select another date."
        );
        return;
      }

      values.totalPrice = totalPrice;
      dispatchReservation(setReservationState(values));

      setModalShow(true);
    });
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const handleSearch = (e) => {
    const { name, value } = e.target;
    formik.setFieldValue(name, value);
  };

  const handleSelect = (name, value) => {
    formik.setFieldValue(name, value);
  };

  return (
    <Form noValidate onSubmit={formik.handleSubmit}>
      <Form.Select
        size="lg"
        className="mb-3"
        {...formik.getFieldProps("car")}
        isInvalid={!!formik.errors.car}
      >
        <option>Select a car</option>
        {vehicles.map((vehicle) => (
          <option value={vehicle.id} key={vehicle.id}>
            {vehicle.model}
          </option>
        ))}
      </Form.Select>

      <SearchPlace
        name="pickUpLocation"
        placeholder="Type a location"
        title="Pick Up"
        value={formik.values.pickUpLocation}
        isInvalid={!!formik.errors.pickUpLocation}
        onSearch={handleSearch}
        onSelect={handleSelect}
      />

      <SearchPlace
        name="dropOfLocation"
        placeholder="Type a location"
        title="Drop Off"
        value={formik.values.dropOfLocation}
        isInvalid={!!formik.errors.dropOfLocation}
        onSearch={handleSearch}
        onSelect={handleSelect}
      />

      <InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon1" style={{ flex: 1 }}>
          <FiCalendar />
          &nbsp;Pick Up
        </InputGroup.Text>
        <FormControl
          type="date"
          min={moment().format("YYYY-MM-DD")}
          style={{ flex: 2 }}
          {...formik.getFieldProps("pickUpDate")}
          isInvalid={!!formik.errors.pickUpDate}
        />
        <FormControl
          type="time"
          style={{ flex: 1 }}
          {...formik.getFieldProps("pickUpTime")}
          isInvalid={!!formik.errors.pickUpTime}
        />
      </InputGroup>

      <InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon1" style={{ flex: 1 }}>
          <FiCalendar />
          &nbsp;Drop Off
        </InputGroup.Text>
        <FormControl
          type="date"
          min={moment(formik.values.pickUpDate).format("YYYY-MM-DD")}
          style={{ flex: 2 }}
          {...formik.getFieldProps("dropOffDate")}
          isInvalid={!!formik.errors.dropOffDate}
        />
        <FormControl
          type="time"
          style={{ flex: 1 }}
          {...formik.getFieldProps("dropOffTime")}
          isInvalid={!!formik.errors.dropOffTime}
        />
      </InputGroup>

      <Button size="lg" className="w-100" type="submit" disabled={loading}>
        {loading && <Spinner animation="border" size="sm" />}&nbsp;CONTINUE
        RESERVATION
      </Button>

      {modalShow && (
        <CompleteReservationModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          onReset={() => formik.handleReset()}
        />
      )}
    </Form>
  );
};

export default SliderForm;
