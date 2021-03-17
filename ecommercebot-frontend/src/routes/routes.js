import { Switch, Route as Routing } from "react-router-dom";
import Delivery from "../components/content/delivery";
import Cancellation from "../components/content/cancellations";
import Layout from "../components/layout/layout";
import orders from "../components/content/orders";

const Routes = () => {
  return (
    <>
      <Layout>
        <Switch>
          <Routing exact path="/" component={orders} />
          <Routing exact path="/orders" component={orders} />
          <Routing path="/delivery" component={Delivery} />
          <Routing path="/cancellation" component={Cancellation} />
        </Switch>
      </Layout>
    </>
  );
};

export default Routes;
