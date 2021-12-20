import React from "react";
import Spacer from "../components/common/Spacer";
import NewsletterPanel from "../components/contact/NewsletterPanel";
import Slider from "../components/home/Slider";
import CustomerServices from "../components/services/CustomerServices";
import Vehicles from "../components/services/Vehicles";

const HomePage = () => {
  return (
    <>
      <Slider />
      <Spacer />
      <CustomerServices />
      <Spacer />
      <NewsletterPanel />
      <Spacer />
      <Vehicles />
      <Spacer />
    </>
  );
};

export default HomePage;
