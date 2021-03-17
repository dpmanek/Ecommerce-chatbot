import axios from "axios";
import api from "../../axios";

import React, { Component } from "react";

export default class Cancellation extends Component {
  state = {
    arrData: [],
  };
  componentDidMount() {
    axios
      .post(`${api}getAllCancellationDetails`)
      .then((res) => {
        console.log(res);
        this.setState({ arrData: res.data });
      })
      .catch((err) => console.log(err));
  }

  componentDidUpdate() {
    axios
      .post(`${api}getAllCancellationDetails`)
      .then((res) => {
        console.log(res);
        this.setState({ arrData: res.data });
      })
      .catch((err) => console.log(err));
  }
  render() {
    if (this.state.arrData.length > 0) {
      return (
        <>
          <p class="h3 well">Cancellation</p>

          <table class="table table-hover ">
            <tr>
              <th>
                <center>OrderId</center>
              </th>
              <th>
                <center>Product name</center>
              </th>
              <th>
                <center>Status</center>
              </th>
              <th>
                <center>Reason</center>
              </th>
            </tr>
            <tbody>
              {this.state.arrData.map((res) => (
                <tr>
                  <td>
                    {res.order_id}
                  </td>
                  <td>
                    {res.product_name}
                  </td>
                  <td>
                    {res.status}
                  </td>

                  <td>
                    {res.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      );
    } else {
      return (
        <>
          <p class="h3 well text-danger">
            <center>
              <i>Status : No orders cancelled</i>
            </center>
          </p>
        </>
      );
    }
  }
}
