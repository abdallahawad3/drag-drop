import "./sass/layouts/_global.scss";
import "./sass/layouts/_app.scss";
import "./sass/layouts/_form.scss";
import "./sass/layouts/_projectList.scss";
import "./sass/layouts/_popup.scss";
import "./sass/layouts/_login.scss";
import "./sass/layouts/_addList.scss";
import "./sass/layouts/_updateProjects.scss";
import { Fields } from "./scripts/components/Fields";
import { ProjectList } from "./scripts/components/ProjectList";
import { loginComponent } from "./scripts/components/Login";
import { addListInstance } from "./scripts/components/AddList";

function checkLogin() {
  const login = localStorage.getItem("isLoggedIn")
    ? JSON.parse(localStorage.getItem("isLoggedIn")!)
    : false;

  const addList = document.getElementById("add-list") as HTMLElement;
  addList.style.display = "none";

  if (!login) {
    loginComponent;
    return;
  }

  new Fields();
  addList.style.display = "block";

  const lists = addListInstance.lists;
  lists.forEach((list) => {
    new ProjectList({ listId: list.id, status: list.name, projects: list.projects });
  });
}

checkLogin();
