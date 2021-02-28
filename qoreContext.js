import { QoreClient } from "@feedloop/qore-client";
import createQoreContext from "@feedloop/qore-react";
import config from "./qore.config.json";
import schema from "./qore.schema.json";
import Cookies from "js-cookie";

const client = new QoreClient({
  ...config,
  getToken: () => Cookies.get("token"),
  onError: (error) => {
    switch (error.message) {
      case "Request failed with status code 401":
        return "ERROR 500 - INTERNAL SERVER ERROR";
        break;
      case "401":
        return "ERROR 401 - UNAUTHORIZED";
        break;
    }
  },
});
client.init(schema);

const qoreContext = createQoreContext(client);
export default qoreContext;
