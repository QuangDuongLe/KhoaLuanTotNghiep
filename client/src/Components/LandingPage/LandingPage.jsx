import React from "react";
import Home from "./Home";
import About from "./About";
import Contact from "./Contact";
import Footer from "./Footer";

const LandingPage = () => {
    return (
        <div className="App">
          <Home />
          <About/>
          <Contact/>
          <Footer/>
        </div>
    );
};

export default LandingPage
