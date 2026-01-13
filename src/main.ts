import "./sass/layouts/_global.scss";
import "./sass/layouts/_app.scss";
import "./sass/layouts/_form.scss";
import "./sass/layouts/_errorMessage.scss";
import "./sass/layouts/_projectList.scss";
import "./sass/layouts/_popup.scss";
import "./sass/layouts/_login.scss";
import "./sass/layouts/_register.scss";
import "./sass/layouts/_addList.scss";
import "./sass/layouts/_updateProjects.scss";

import { listenToAuthChanges } from "./scripts/auth/listenToAuthChanges ";

listenToAuthChanges();
