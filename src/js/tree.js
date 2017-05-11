"use strict";

/*************************
 * IMPORTS
 * ---
 * The TreeNodes object that contains all the tree data
 *************************/
import TreeNodes from './tree-nodes';

/**************************
 * TREE
 * ---
 * The Tree object contains all methods responsible for working with data
 * from the TreeNodes object that contains the entire decision tree.
 *************************/
let Tree = {
  /***************
   * Config object
   * ---
   * Contains configuration settings such as the default node ID, debug mode,
   * and the prefix to apply to the history object name.
   ***************/
  config: {
    // The default node to display
    startNodeID: "0.0",
    // Toggles the breadcrumb display
    showSection: true,
    // Toggles saving via localStorage
    allowSave: true,
    // Toggles debug mode
    debugMode: false,
    // The prefix to apply to the localStorage history item
    prefix: "ATHD"
  },

  // Vars used to temporarily store data during operation
  navHistory: [],
  reviewNavHistory: [],
  savedHistory: [],
  sessionSavedHistory: [],
  currentSection: "",
  currentNodeID: null,
  reviewMode: false,

  /***************
   * Util object
   * ---
   * Contains utility methods such as checking for localStorage and
   * generating a formatted timestamp string for history.
   ***************/
  util: {
    /***************
     * util.localStorageActive()
     * ---
     * IIFE that checks whether localStorage is available for saving data.
     ***************/
    localStorageActive: (function() {
      try {
  			localStorage.setItem("localStorageTest", "test");
  			localStorage.removeItem("localStorageTest");
        return true;
  		} catch(e) {
  			return false;
  		}
    }()),

    /***************
     * util.getTimeStamp()
     * ---
     * Generates a formatted time stamp, e.g., 2017-05-10, 14:54:52.
     ***************/
    getTimeStamp() {
      let timeStamp = new Date();
  		return timeStamp.getFullYear() + "-" +
  			((timeStamp.getMonth()+1) < 10 ? "0" : "") + (timeStamp.getMonth()+1) + "-" +
  			((timeStamp.getDate() < 10) ? "0" : "") + timeStamp.getDate() + ", " +
  			((timeStamp.getHours() < 10) ? "0" : "") + timeStamp.getHours() + ":" +
  			((timeStamp.getMinutes() < 10) ? "0" : "") +timeStamp.getMinutes() + ":" +
  			((timeStamp.getSeconds() < 10) ? "0" : "") + timeStamp.getSeconds();
    }
  },

  /***************
   * History object
   * ---
   * Contains methods for dealing with both saved and working/in-memory
   * history items and data.
   ***************/
  history: {
    /***************
     * history.add( nodeID, choice )
     * ---
     * Adds a node ID and user choice text to the navigation history array.
     ***************/
    add(nodeID = "0.0", choice = "-") {
      Tree.navHistory.push([nodeID, choice])
    },

    /***************
     * history.back()
     * ---
     * Returns the last item added to the navigation history array.
     ***************/
    back() {
      if(Tree.navHistory.length > 0) {
        return TreeNodes.nodes[Tree.navHistory.pop()[0]];
      }
    },

    /***************
     * history.save( endpoint, history )
     * ---
     * Saves a history item containing the endpoint that the user Reached
     * and the choices that led to the endpoint for later display.
     ***************/
    save(endpoint = "", history = []) {
      if(Tree.util.localStorageActive) {
        let itemName = `${Tree.config.prefix}-history`;

        if(localStorage.getItem(itemName) !== null) {
          Tree.savedHistory = JSON.parse(localStorage.getItem(itemName));
        }

        let entryName = new Date().toISOString();
        Tree.savedHistory.push({"endpoint": endpoint, "timestamp": Tree.util.getTimeStamp(), "history": history});

        window.localStorage.setItem(itemName, JSON.stringify(Tree.savedHistory));
      } else {
        Tree.sessionSavedHistory.push({"endpoint": endpoint, "timestamp": Tree.util.getTimeStamp(), "history": history});
      }
    },

    /***************
     * history.load()
     * ---
     * Loads any saved history into memory.
     ***************/
    load() {
      if(Tree.util.localStorageActive) {
        let itemName = `${Tree.config.prefix}-history`;
        Tree.savedHistory = JSON.parse(localStorage.getItem(itemName)) || [];
      } else {
        Tree.savedHistory = Tree.sessionSavedHistory;
      }
    },

    /***************
     * history.clear()
     * ---
     * Clears any saved history.
     ***************/
    clear() {
      if(Tree.util.localStorageActive) {
        localStorage.clear();
      } else {
        Tree.sessionSavedHistory = [];
      }
    }
  },

  /***************
   * getNodeByID( nodeID )
   * ---
   * Returns tree node data based on the specific ID string parameter.
   ***************/
  getNodeByID(nodeID) {
    return TreeNodes.nodes[nodeID];
  },

  /***************
   * getSectionsByNodeID( nodeID, onlyCurrentSection )
   * ---
   * Returns a section list breadcrumb from the tree node data based on the
   * specified node ID string parameter.
   ***************/
  getSectionsByNodeID(nodeID, onlyCurrentSection = false) {
    let sectionStr = "";
    let sectionCount = 0;

    for(let section in TreeNodes.sections) {
      if(nodeID.startsWith( section.replace(".0","") )) {

        // Create a breadcrumb out the sections and subsections for the node
        if(sectionCount == 0) {
            sectionStr += TreeNodes.sections[section];
        } else {
          sectionStr += ` > ${TreeNodes.sections[section]}`;
        }

        // If the onlyCurrentSection param is true, set just the current section
        if(onlyCurrentSection) {
          sectionStr = TreeNodes.sections[section];
        }

        sectionCount++;
        Tree.currentSection = sectionStr;
      }
    }

    return Tree.currentSection;
  }

}

export default Tree;
