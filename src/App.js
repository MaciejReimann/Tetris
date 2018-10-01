import React, { Component } from "react";

import LargeCanvas from "./components/LargeCanvas";

import "./App.css";

class App extends Component {
  componentDidMount() {}

  render() {
    return (
      <div className="app-container">
        <LargeCanvas />
      </div>
    );
  }
}

export default App;
