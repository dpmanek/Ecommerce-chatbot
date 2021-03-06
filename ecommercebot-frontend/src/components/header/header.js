import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <div>
      <nav class="navbar navbar-inverse">
        <div class="container">
          <div class="navbar-header">
            <button
              type="button"
              class="navbar-toggle collapsed"
              data-toggle="collapse"
              data-target="#bs-example-navbar-collapse-1"
              aria-expanded="false"
            >
              <span class="sr-only">Toggle navigation</span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
            <Link class="navbar-brand" to="/orders">
              Ecommerce Bot
            </Link>
          </div>

          <div
            class="collapse navbar-collapse"
            id="bs-example-navbar-collapse-1"
          >
            <ul class="nav navbar-nav navbar-right">
              <li>
                <Link to="/orders">Orders</Link>
              </li>
              <li>
                <Link to="/delivery">Delivery</Link>
              </li>
              <li>
                <Link to="/cancellation">Cancellation</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;
