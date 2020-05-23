import { ExcalidrawElement } from "../element/types";
import { AppState } from "../types";
import { clearAppStateForLocalStorage } from "../appState";
import { restore } from "./restore";

const LOCAL_STORAGE_KEY = "excalidraw";
const LOCAL_STORAGE_KEY_STATE = "excalidraw-state";
const LOCAL_STORAGE_KEY_COLLAB = "excalidraw-collab";

export function saveUsernameToLocalStorage(username: string) {
  try {
    console.log("username::",username)
    localStorage.setItem(
      LOCAL_STORAGE_KEY_COLLAB,
      JSON.stringify({ username }),
    );
  } catch (error) {
    // Unable to access window.localStorage
    console.error(error);
  }
}

export function restoreUsernameFromLocalStorage(): string | null {
  try {
    console.log("Restorl local  ",LOCAL_STORAGE_KEY_COLLAB)
    const data = localStorage.getItem(LOCAL_STORAGE_KEY_COLLAB);
    if (data) {
      return JSON.parse(data).username;
    }
  } catch (error) {
    // Unable to access localStorage
    console.error(error);
  }

  return null;
}

export function saveToLocalStorage(
  elements: readonly ExcalidrawElement[],
  appState: AppState,
) {
  try {
    console.log("save to localstorage")
    console.log(elements)
    //debugger
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify(elements.filter((element) => !element.isDeleted)),
    );
    localStorage.setItem(
      LOCAL_STORAGE_KEY_STATE,
      JSON.stringify(clearAppStateForLocalStorage(appState)),
    );
  } catch (error) {
    // Unable to access window.localStorage
    console.error(error);
  }
}

export function restoreFromLocalStorage() {
  console.log("Restore", LOCAL_STORAGE_KEY, LOCAL_STORAGE_KEY_STATE)
  let savedElements = null;
  let savedState = null;

  try {
    savedElements = localStorage.getItem(LOCAL_STORAGE_KEY);
    savedState = localStorage.getItem(LOCAL_STORAGE_KEY_STATE);
  } catch (error) {
    // Unable to access localStorage
    console.error(error);
  }

  let elements = [];
  if (savedElements) {
    try {
      elements = JSON.parse(savedElements);
    } catch {
      // Do nothing because elements array is already empty
    }
  }

  let appState = null;
  if (savedState) {
    try {
      appState = JSON.parse(savedState) as AppState;
      // If we're retrieving from local storage, we should not be collaborating
      appState.isCollaborating = false;
      appState.collaborators = new Map();
    } catch {
      // Do nothing because appState is already null
    }
  }

  return restore(elements, appState);
}
