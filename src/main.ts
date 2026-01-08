import "./sass/layouts/_global.scss";
import "./sass/layouts/_app.scss";
import "./sass/layouts/_form.scss";
import "./sass/layouts/_projectList.scss";
import { Fields } from "./scripts/components/Fields";
import { ProjectList } from "./scripts/components/ProjectList";
new Fields();

new ProjectList({ status: "Initial" });
new ProjectList({ status: "Active" });
new ProjectList({ status: "Finished" });
