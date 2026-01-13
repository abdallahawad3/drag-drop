import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import { Fields } from "../components/Fields";
import { addListInstance } from "../components/AddList";
import type { ProjectRules } from "../store/ProjectRules";
import { ProjectList } from "../components/ProjectList";
import { Register } from "../components/Register";

export function listenToAuthChanges() {
  const addList = document.getElementById("add-list") as HTMLElement;
  addList.style.display = "none";

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const registerComponent = document.getElementById("register-form");
      const loginComponent = document.getElementById("login-form");
      if (loginComponent) {
        loginComponent.remove();
      }
      if (registerComponent) {
        registerComponent.remove();
      }
      new Fields();
      addList.style.display = "block";
      const lists = addListInstance.lists as {
        id: string;
        name: string;
        projects: ProjectRules[];
      }[];
      lists.forEach((list: { id: string; name: string; projects: ProjectRules[] }) => {
        new ProjectList({ listId: list.id, status: list.name, projects: list.projects });
      });
    } else {
      new Register();
    }
  });
}
