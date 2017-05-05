"use strict";

/**********
 * UI
 **********
 * The UI object contains all methods responsible for modifying the HTML
 * front-end of the app. The UI communicates with the 'Tree' object to
 * get its data.
 **********/

/*****
 * IMPORTS: Tree object and methods
 *****/
import Tree from './tree';

// UI object and methods start here
let UI = {
  /*****
   * init()
   * ---
   * Initializes the front-end by clearing in-memory data, loading any
   * saved data, and displaying the default node.
   *****/
  init() {
    Tree.navHistory = [];

    UI.loadSavedHistory();

    if(Tree.config.showSection == false) {
      document.querySelector('#data .status').remove();
    }

    UI.displayNode(Tree.getNodeByID(Tree.config.startNodeID));
  },

  addBackBtn() {
    let backBtn = document.querySelector('#btn-back');
    if(backBtn === null) {
      backBtn = document.createElement('button');
      backBtn.id = "btn-back";
      backBtn.classList.add("btn-nav");
      backBtn.disabled = true;
      backBtn.innerHTML = "Back";
      backBtn.addEventListener('click', function(){
        UI.displayNode(Tree.history.back());
      }, false);
      document.querySelector('#data nav').appendChild(backBtn);
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

  removeFinishBtn(allowSave) {
    let finishBtn = document.getElementById('btn-finish');
    if(finishBtn !== null) {
      document.getElementById('btn-finish').remove();
    }
  },

  loadSavedHistory() {
    let target = document.querySelector('#saved .content'),
        targetInstructions = document.querySelector('#saved .instructions'),
        clearHistoryBtn = document.querySelector('#saved .btn-nav');

    target.innerHTML = "";

    Tree.history.load();

    for(let item in Tree.savedHistory) {
      UI.addHistoryBtn(Tree.savedHistory[item]);
    };

    if(Tree.savedHistory.length > 0) {
      if(clearHistoryBtn === null){
        clearHistoryBtn = document.createElement('button');
        clearHistoryBtn.classList.add("btn-nav");
        clearHistoryBtn.innerHTML = "Clear History";
        clearHistoryBtn.addEventListener('click', function() {
          Tree.history.clear();
          UI.loadSavedHistory();
        });
        document.querySelector('#saved nav').appendChild(clearHistoryBtn);
        targetInstructions.innerHTML = "Select an incident to review its history.";
      }
    } else {
      if(clearHistoryBtn !== null) clearHistoryBtn.remove();
      targetInstructions.innerHTML = "There are no saved incidents.";
    }
  },

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

  addReviewBtns() {
    if(document.getElementById('btn-exit-review') === null) {
      let exitReviewBtn = document.createElement('button');
      exitReviewBtn.id = "btn-exit-review";
      exitReviewBtn.classList.add("btn-nav");
      exitReviewBtn.innerHTML = "Exit Review";
      exitReviewBtn.addEventListener('click', function(){
        this.remove();
        UI.toggleReviewMode();
        UI.displayNode(Tree.getNodeByID(Tree.currentNodeID));
      }, false);
      document.querySelector('#data nav').appendChild(exitReviewBtn);
    }
  },

  toggleReviewMode(item = null) {
    let breadcrumb = document.querySelector('#data .status');
    if(item !== null) {
      breadcrumb.innerHTML = `Reviewing ${item.endpoint} incident`;

      Tree.config.reviewMode = true;
      Tree.reviewNavHistory = item.history;

        document.querySelector('#data .content').innerHTML = UI.createHistoryList();

      let backBtn = document.getElementById('btn-back'),
          btnFinish = document.getElementById('btn-finish');

      if(backBtn !== null) backBtn.style.display = "none";
      if(btnFinish !== null) btnFinish.style.display = "none";

      UI.addReviewBtns();
    } else {
      Tree.config.reviewMode = false;
    }

  },

  displayNode(node) {
    Tree.currentNodeID = node.id;

    let nodeMarkup = `<p>${node.text}</p>`;

    if(node.choices !== undefined) {
      let noBtn = false;
      for(let choice of node.choices) {
          noBtn = choice.text.includes("No (start over)");
          nodeMarkup += `<button class="btn-choice ${noBtn ? 'btn-warn' : ''}" data-target="${choice.targetNode}">${choice.text}</button>`;
      }
    }

    let target = document.querySelector('#data .content');
    target.innerHTML = nodeMarkup;

    let choiceButtons = document.querySelectorAll('#data .content button');

    for(let btn of choiceButtons) {
      btn.addEventListener('click', function() {
        let choice = this.innerHTML;
        Tree.history.add(node.id, choice)
         UI.displayNode(Tree.getNodeByID(this.dataset.target));
       }, false);
    }

    UI.addBackBtn();

    if(node.type == "end") {
      UI.addFinishBtn(Tree.config.allowSave);
    } else {
      UI.removeFinishBtn(Tree.config.allowSave);
    }

    if(Tree.config.showSection) {
      UI.updateSection(node);
    }

    if(Tree.config.debugMode) {
      document.getElementById('history').innerHTML = UI.createHistoryList(true, true);
    }

  },

  updateSection(node) {
    document.querySelector('#data .status').innerHTML = Tree.getSectionByNodeID(node.id);
  },

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
