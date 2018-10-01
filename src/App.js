import React, { Component } from "react";

import LargeCanvas from "./containers/LargeCanvas";
import Score from "./containers/Score";

import "./App.css";

class App extends Component {
  componentDidMount() {}

  render() {
    return (
      <div className="app-container">
        <Score />
        <LargeCanvas />
      </div>
    );
  }
}

export default App;
