import React, { Component } from "react";
import axios from "axios";
import { fabric } from "fabric";
import { history } from "helpers/history";
import { AuthService } from "services/AuthenticationService";
import { Config } from "config/Config";

class Devices extends Component {
  constructor(props) {
    super(props);

    this.state = {
      count: "",
      token: "",
    };
  }

  componentDidMount() {
    let auth = AuthService.currentUserValue;
    this.setState({ token: auth });
    this.getDevices();
    //get devices every 5 seconds
    this.interval = setInterval(() => {
      this.getDevices();
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getDevices = () => {
    axios.get(`${Config.API_URL}/devices`).then((response) => {
      let { devices } = response.data;
      this.setState({ count: Object.keys(devices).length }, () => {
        this.initCanvas(this.state.count);
      });
    });
  };

  initCanvas = (numberOfDevices) => {
    let canvas = new fabric.Canvas("canvas", {
      backgroundColor: "#f36e40",
      selection: false,
    });
    this.setCanvasSize(canvas);

    this.drawCircles(canvas, numberOfDevices);

    return canvas;
  };

  setCanvasSize = (canvas) => {
    // set canvas size based on the its container
    let canvasSize = {
      width: 1200,
      height: 700,
    };
    let containerSize = {
      width: document.getElementById("canvas-container").offsetWidth,
      height: document.getElementById("canvas-container").offsetHeight,
    };
    let scaleRatio = Math.min(
      containerSize.width / canvasSize.width,
      containerSize.height / canvasSize.height
    );
    canvas.setWidth(containerSize.width);
    canvas.setHeight(containerSize.height);
    //set zoom to center canvas
    canvas.setZoom(scaleRatio);
  };

  drawCircles = (canvas, numberOfDevices) => {
    let maxTries = 0;
    let circles = [];
    let center = { x: canvas.width / 2, y: canvas.height / 2 };

    //set rectangle to avoid overlapping the label
    let rect = new fabric.Rect({
      width: 200,
      height: 200,
      left: center.x,
      top: center.y,
      selectable: false,
    });

    let count = new fabric.Text(numberOfDevices.toString(), {
      fill: "white",
      fontFamily: "Verdana",
      fontSize: 50,
      originX: "Center",
      originY: "Center",
    });

    let label = numberOfDevices === 1 ? "DEVICE ONLINE" : "DEVICES ONLINE";

    let text = new fabric.Text(label, {
      fill: "white",
      fontFamily: "Tahoma, sans-serif",
      fontSize: 20,
      originX: "Center",
      originY: "Center",
      top: 50,
    });

    let group = new fabric.Group([count, text], {
      selectable: false,
    });

    group.set({
      left: center.x + 20,
      top: (rect.top + rect.height) / 2 + 100,
      stroke: "#00f",
      strokeWidth: 2,
      hoverCursor: "default",
    });

    canvas.add(group);

    while (circles.length < numberOfDevices) {
      let circle = new fabric.Circle({
        originX: "center",
        originY: "center",
        top: this.getRandomNumber(700),
        left: this.getRandomNumber(1600),
        strokeWidth: 2,
        radius: 30,
        fill: "white",
        stroke: "#fff",
        selectable: false,
        hoverCursor: "default",
      });

      let overlapping = false;

      //detect if the circle will overlap the label
      if (circle.intersectsWithObject(rect)) {
        overlapping = true;
      }

      for (let j = 0; j < circles.length; j++) {
        let previousCircle = circles[j];

        //compute distance of the circles to find out if they overlap
        let distance = Math.hypot(
          circle.left - previousCircle.left,
          circle.top - previousCircle.top
        );

        if (distance < circle.radius + previousCircle.radius) {
          overlapping = true;
          break;
        }
      }
      if (!overlapping) {
        canvas.add(circle);
        circles.push(circle);
      }
      //set maximum number of tries to avoid crashing if no circle with no overlap can be placed
      maxTries++;
      if (maxTries > 1000) {
        break;
      }
    }
  };

  getRandomNumber = (value) => {
    //get random number for placing points
    let result = Math.floor(Math.random() * value);
    return result;
  };

  notify = () => {
    let headers = { Authorization: "Bearer " + this.state.token };
    let params = {
      name: "Shaira S. Pagcaliwagan",
      email: "shaira.pagcaliwagan@gmail.com",
      repoUrl: "https://github.com/sspagcaliwagan/meldcx-frontend-test",
      message:
        "What function is always not ready? Asynchronous functions, because they always say 'Ah! Wait'",
    };
    axios.post(`${Config.API_URL}/notify`, params, headers).catch((error) => {
      if (error.response) {
        console.log(error);
      }
    });
  };

  logout = () => {
    AuthService.logout();
    history.push("/login");
  };

  render() {
    return (
      <div className="container-fluid devices">
        <div className="row">
          <div className="col-12">
            <div id="canvas-container">
              <canvas id="canvas" />
            </div>
            <div className="footer text-center py-3">
              <button
                type="button"
                className="btn btn-light me-3"
                onClick={() => this.notify()}
              >
                NOTIFY
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => this.logout()}
              >
                LOG OUT
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Devices;
