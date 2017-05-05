"use strict";
import TreeNodes from './tree-nodes';

let Tree = {

  navHistory: [],
  reviewNavHistory: [],
  savedHistory: [],
  currentSection: "",
  currentNodeID: null,

  config: {
    startNodeID: "0.0",
    showSection: true,
    allowSave: true,
    debugMode: false,
    reviewMode: false,
    prefix: "ATHD"
  },

  util: {
    localStorageActive: function() {
      try {
  			localStorage.setItem("localStorageTest", "test");
  			localStorage.removeItem("localStorageTest");
        return true;
  		} catch(e) {
  			return false;
  		}
    }(),

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

  history: {
    add(nodeID = "0.0", choice = "-") {
      Tree.navHistory.push([nodeID, choice])
    },

    back() {
      if(Tree.navHistory.length > 0) {
        return TreeNodes.nodes[Tree.navHistory.pop()[0]];
      }
    },

    save(endpoint, history) {
      if(Tree.util.localStorageActive) {
        let itemName = `${Tree.config.prefix}-history`;

        if(localStorage.getItem(itemName) !== null) {
          Tree.savedHistory = JSON.parse(localStorage.getItem(itemName));
        }

        let entryName = new Date().toISOString();
        Tree.savedHistory.push({"endpoint": endpoint, "timestamp": Tree.util.getTimeStamp(), "history": history});

        window.localStorage.setItem(itemName, JSON.stringify(Tree.savedHistory));
      }
    },

    load() {
      if(Tree.util.localStorageActive) {
        let itemName = `${Tree.config.prefix}-history`;
        Tree.savedHistory = JSON.parse(localStorage.getItem(itemName)) || [];
      }
    },

    clear() {
      if(Tree.util.localStorageActive) {
        localStorage.clear();
      }
    }
  },

  getNodeByID(nodeID) {
    return TreeNodes.nodes[nodeID];
  },

  getSectionByNodeID(nodeID) {
    let sectionStr = "";
    let sectionCount = 0;

    for(let section in TreeNodes.sections) {
      if(nodeID.startsWith( section.replace(".0","") )) {

        if(sectionCount == 0) {
            sectionStr += TreeNodes.sections[section];
        } else {
          sectionStr += ` > ${TreeNodes.sections[section]}`;
        }

        Tree.currentSection = sectionStr;
        sectionCount++;
      }
    }

    return Tree.currentSection;
  }

}

export default Tree;
