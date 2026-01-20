import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import { Fields } from "../components/Fields";
import { addListInstance } from "../components/AddList";
import { Register } from "../components/Register";
import { Header } from "../components/Header";
import type { ProjectsList } from "../types";
import { ProjectList } from "../components/ProjectList";

export function listenToAuthChanges() {
  const addList = document.getElementById("add-list") as HTMLElement;
  const management = document.getElementById("management") as HTMLElement;
  const content = document.getElementById("content") as HTMLElement;
  const header = document.querySelector("header")! as HTMLElement;
  if (content) content.style.display = "none";
  if (management) management.style.display = "none";

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const registerComponent = document.getElementById("register-form");
      const loginComponent = document.getElementById("login-form");

      if (loginComponent) {
        loginComponent.remove();
      }
      if (registerComponent) {
        registerComponent.remove();
      }

      if (header) {
        header.style.display = "flex";
      }

      new Header();
      new Fields();
      if (content) content.style.display = "flex";
      if (management) management.style.display = "block";
      addList.style.display = "block";
      const lists = (await addListInstance.getAlllists()) as ProjectsList[];
      lists.forEach((list: ProjectsList) => {
        new ProjectList({ listId: list.id, status: list.name, projects: list.projects });
      });
    } else {
      if (content) content.style.display = "none";
      if (management) management.style.display = "none";
      addList.style.display = "none";
      new Register();
    }
  });
}
