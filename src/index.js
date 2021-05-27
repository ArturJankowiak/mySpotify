import { message, messageDOM } from "./utils/messege";
import "./components/footer";
import "./sass/index.scss";
import addImage from "./utils/add-image";
import { requestAuthorization } from "./utils/authorization";

message("it works");
messageDOM("działaaa");

addImage("h1");
requestAuthorization();
