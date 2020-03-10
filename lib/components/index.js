import React from "react";
import { render, hydrate } from "react-dom";
import App from "./app";

hydrate(<App />, document.getElementById("reactele"));