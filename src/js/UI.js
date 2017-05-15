"use strict";

/*************************
 * IMPORTS
 * ---
 * The Tree object and its methods
 *************************/
import Tree from './tree';

/*************************
 * IE POLYFILLS
 *************************/
Element.prototype.remove = function() {
  try {
    this.remove();
  } catch (e) {
    this.parentElement.removeChild(this);
  }
}

/*************************
 * UI
 * ---
 * The UI object contains all methods responsible for modifying the HTML
 * front-end of the app. The UI communicates with the 'Tree' object to
 * get its data.
 *************************/
let UI = {
  /***************
   * init()
   * ---
   * Initializes the front-end by clearing in-memory data, loading any
   * saved data, and displaying the default node.
   ***************/
  init() {
    Tree.navHistory = [];

    UI.loadSavedHistory();

    if(Tree.config.showSection == false) {
      let status = document.querySelector('#data .status');
      if(status !== null) status.remove();
    }

    UI.displayNode(Tree.getNodeByID(Tree.config.startNodeID));
  },

  /***************
   * addBackBtn()
   * ---
   * Creates and adds the Back nav button to the DOM.
   ***************/
  addBackBtn() {
    let backBtn = document.querySelector('#btn-back'),
        target = document.querySelector('#data nav');

    if(backBtn === null) {
      backBtn = document.createElement('button');
      backBtn.id = "btn-back";
      backBtn.classList.add("btn-nav");
      backBtn.disabled = true;
      backBtn.innerHTML = "Back";

      backBtn.addEventListener('click', function(){
        UI.displayNode(Tree.history.back());
      }, false);

      target.appendChild(backBtn);
    } else {
      if(backBtn.style.display = "none") {
        backBtn.style.display = "";
      }

      if(Tree.navHistory.length > 0) {
        backBtn.disabled = false;
      } else {
        backBtn.disabled = true;
      }
    }
  },

  /***************
   * addFinishBtn( allowSave )
   * ---
   * Creates and adds the finish nav button, which either saves the current
   * history or starts over based on the boolean parameter, to the DOM.
   ***************/
  addFinishBtn(allowSave) {
    let target = document.querySelector('#data .content'),
        finishBtn = document.getElementById('btn-finish');

    if(finishBtn === null) {
      finishBtn = document.createElement('button');
      let finishFunction = null;
      finishBtn.id = "btn-finish";
      finishBtn.classList.add("btn-choice", "btn-primary");
      finishBtn.innerHTML = allowSave ? "Log Incident and Restart" : "Start Over";

      if(allowSave) {
        finishFunction = function() {
          let currentNodeID = Tree.getNodeByID(Tree.currentNodeID).id;
          Tree.history.add(currentNodeID, "");
          Tree.history.save(Tree.getNodeByID(Tree.currentNodeID).id, Tree.navHistory);
          UI.init();
        };
      } else {
        finishFunction = function() {
          UI.init();
        };
      }

      finishBtn.addEventListener('click', finishFunction, false);

      target.appendChild(finishBtn);

    } else {
      if(finishBtn.style.display = "none") {
        finishBtn.style.display = "";
      }
    }
  },

  /***************
   * removeFinishBtn()
   * ---
   * Removes the finish button from the DOM if it exists.
   ***************/
  removeFinishBtn() {
    let finishBtn = document.getElementById('btn-finish');
    if(finishBtn !== null) {
      finishBtn.remove();
    }
  },

  /***************
   * loadSavedHistory()
   * ---
   * Checks for any saved history items, and calls
   * the addHistoryBtn UI method for each.
   ***************/
  loadSavedHistory() {
    let target = document.querySelector('#saved .content'),
        targetInstructions = document.querySelector('#saved .instructions'),
        clearHistoryBtn = document.querySelector('#saved .btn-nav');

    target.innerHTML = "";

    Tree.history.load();

    if(Tree.savedHistory.length > 0) {
      let target = document.querySelector('#saved nav');

      for(let item in Tree.savedHistory) {
        UI.addHistoryBtn(Tree.savedHistory[item]);
      };

      if(clearHistoryBtn === null){
        clearHistoryBtn = document.createElement('button');
        clearHistoryBtn.classList.add("btn-nav");
        clearHistoryBtn.innerHTML = "Clear History";

        clearHistoryBtn.addEventListener('click', function() {
          Tree.history.clear();
          UI.loadSavedHistory();
        });

        target.appendChild(clearHistoryBtn);
        targetInstructions.innerHTML = "Select an incident to review its history.";
      }
    } else {
      if(clearHistoryBtn !== null) clearHistoryBtn.remove();
      targetInstructions.innerHTML = "There are no saved incidents.";
    }
  },

  /***************
   * addHistoryBtn( item )
   * ---
   * Creates and adds a history item button containing data from the
   * item object paramater to the DOM.
   ***************/
  addHistoryBtn(item) {
    let target = document.querySelector('#saved .content');
    let historyBtn = document.createElement('button');

    historyBtn.classList.add("btn-history");
    historyBtn.innerHTML = `<p><span class="title">${item.endpoint}</span><br>${item.timestamp}</p>`;
    historyBtn.addEventListener('click', function() {
      UI.toggleReviewMode(item);
    }, false);

    target.appendChild(historyBtn);
  },

  /***************
   * addExitReviewBtn()
   * ---
   * Creates and adds an exit review button that returns to the tree
   * navigation mode from review mode to the DOM.
   ***************/
  addExitReviewBtn() {
    let exitReviewBtn = document.getElementById('btn-exit-review'),
        target = document.querySelector('#data nav');

    if(exitReviewBtn === null) {
      exitReviewBtn = document.createElement('button');

      exitReviewBtn.id = "btn-exit-review";
      exitReviewBtn.classList.add("btn-nav");
      exitReviewBtn.innerHTML = "Exit Review";

      exitReviewBtn.addEventListener('click', function(){
        this.remove();
        UI.toggleReviewMode();
        UI.displayNode(Tree.getNodeByID(Tree.currentNodeID));
      }, false);

      target.appendChild(exitReviewBtn);
    }
  },

  /***************
   * addPrintReview()
   * ---
   * Creates and adds a button that opens a new window and renders the history
   * in PDF format.
   ***************/
  addPrintReviewBtn() {
    // do things
  },

  /***************
   * toggleReviewMode( item )
   * ---
   * Toggles review mode based on whether an item object paramter is given.
   * Review mode displays a history item in place of the tree navigation.
   ***************/
  toggleReviewMode(item = null) {
    let breadcrumb = document.querySelector('#data .status'),
        target = document.querySelector('#data .content');

    if(item !== null) {
      if(Tree.config.showSection)
        breadcrumb.innerHTML = `Reviewing ${item.endpoint} incident`;

      Tree.reviewMode = true;
      Tree.reviewNavHistory = item.history;

        target.innerHTML = UI.createHistoryList();

      let backBtn = document.getElementById('btn-back'),
          btnFinish = document.getElementById('btn-finish');

      if(backBtn !== null) backBtn.style.display = "none";
      if(btnFinish !== null) btnFinish.style.display = "none";

      UI.addPrintReviewBtn();
      UI.addExitReviewBtn();
    } else {
      Tree.reviewMode = false;
    }

  },

  /***************
   * displayNode( node )
   * ---
   * Displays a node from the tree data by creating buttons for
   * choices, if any, and adding + activating Back and finish nav buttons
   * based on the node type.
   ***************/
  displayNode(node) {
    Tree.currentNodeID = node.id;

    let nodeMarkup = `<p>${node.text}</p>`,
        target = document.querySelector('#data .content'),
        choiceButtons = null;

    /*
     * Create the markup for buttons based on the node's choices, and add
     * a highlight CSS class to buttons to "start over" choice buttons.
     */
    if(node.choices !== undefined) {
      let noBtn = false;
      for(let choice of node.choices) {
          noBtn = choice.text.includes("start over");
          nodeMarkup += `<button class="btn-choice ${noBtn ? 'btn-warn' : ''}" data-target="${choice.targetNode}">${choice.text}</button>`;
      }
    }

    // Add choice buttons to the target element and store a reference to them
    target.innerHTML = nodeMarkup;
    choiceButtons = document.querySelectorAll('#data .content button');

    for(let btn of choiceButtons) {
      btn.addEventListener('click', function() {
        let choice = this.innerHTML;
        Tree.history.add(node.id, choice)

        if(choice.includes("start over")) {
          Tree.navHistory = [];
        }

         UI.displayNode(Tree.getNodeByID(this.dataset.target));
       }, false);
    }

    UI.addBackBtn();

    // Add a finish button if the node is an end node.
    if(node.type == "end") {
      UI.addFinishBtn(Tree.config.allowSave);
    } else {
      UI.removeFinishBtn(Tree.config.allowSave);
    }

    // Update the breadcrumb if the breadcrumb is active.
    if(Tree.config.showSection) {
      UI.updateSection(node);
    }

    // Show the live history table if debug mode is active.
    if(Tree.config.debugMode) {
      let target = document.getElementById('history');
      target.innerHTML = UI.createHistoryList(true, true);
    }

  },

  /***************
   * updateSection( node )
   * ---
   * Updates the breadcrumb by pulling the sections to which the specified
   * node object paramater belongs in the tree data.
   ***************/
  updateSection(node) {
    let target = document.querySelector('#data .status'),
        sections = Tree.getSectionsByNodeID(node.id, false),
        sectionCount = 0,
        sectionStr = "";

    for(let section in sections) {
      if(section == sections.length - 1) {
        sectionStr += (section == 0) ? `${sections[section].name}` : ` > ${sections[section].name}`;
      } else if(section == 0) {
        sectionStr = `<a class="breadcrumb" href="#" data-section="${sections[section].id}">${sections[section].name}</a>`;
      } else {
        sectionStr += ` > <a class="breadcrumb" href="#" data-section="${sections[section].id}">${sections[section].name}</a>`;
      }

      sectionCount++;
    }

    target.innerHTML = sectionStr;

    let navLinks = document.querySelectorAll('a.breadcrumb');

    let navLinkCallback = function() {
      for(let i = 0; i < Tree.navHistory.length; i++) {
        if(this.dataset.section == Tree.navHistory[i][0]) {
          let targetNode = Tree.navHistory[i][0];
          Tree.navHistory = Tree.navHistory.slice(0,i);
          UI.displayNode(Tree.getNodeByID(targetNode));
        }
      }
    };

    if(navLinks.length > 0 ) {
      for(let i = 0; i < navLinks.length; i++) {
        navLinks[i].addEventListener('click', navLinkCallback, false);
      }
    }
  },

  /***************
   * createHistoryList( includeCurrentNode, includeNodeID )
   * ---
   * Creates a history table element based on the active history item in the
   * Tree object. The history table includes the current node and all node
   * IDs (mainly for debug purposes) based on the boolean parameters.
   ***************/
  createHistoryList(includeCurrentNode = false, includeNodeID = false) {
    let stepCount = 0;
    let itemTable = `<table class="history"><thead><tr><th>Step</th>`;

    if(includeNodeID) itemTable += `<th>ID</th>`;

    itemTable += `<th>Decision</th><th>Choice</th></tr></thead><tbody>`;

    for(let item of Tree.reviewNavHistory) {
      stepCount = (item[1].length === 0) ? "END" : ++stepCount;
      itemTable += `<tr><td>${stepCount}</td>`;

      if(includeNodeID) itemTable += `<td>${item[0]}</td>`;

      itemTable += `<td>${Tree.getNodeByID(item[0]).text}</td><td>${item[1]}</td></tr>`;
    }

    if(includeCurrentNode) {
      let endNode = Tree.getNodeByID(Tree.currentNodeID);
      itemTable += `<tr><td>Current</td><td>${endNode.id}</td><td>${endNode.text}</td><td></td></tr>`;
    }

    itemTable += `</tbody></table>`;

    return itemTable;
  }

}

export default UI;
