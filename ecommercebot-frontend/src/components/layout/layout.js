import React, { Component } from "react";
import Header from "../header/header";

class Layout extends Component {
  render() {
    return (
      <>
        <Header />
        <div class="row">
          <div class="col-md-4">{/* Azure Bot */}</div>
          <div class="col-md-4">{this.props.children}</div>

          <div class="col-md-4">
            {/* Google DialogFlow Bot */}
            <df-messenger
              intent="WELCOME"
              chat-title="Norma (Dialogflow Bot)"
              chat-icon="https://raw.githubusercontent.com/dpmanek/images/main/botlogo.png"
              agent-id="1be3da83-4afe-46c5-9fd9-7dad08e96c9c"
              language-code="en"
            ></df-messenger>
          </div>
        </div>
      </>
    );
  }
}

export default Layout;
