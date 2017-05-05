(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tree = require('./tree');

var _tree2 = _interopRequireDefault(_tree);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UI = {
  init: function init() {
    _tree2.default.navHistory = [];

    UI.loadSavedHistory();

    if (_tree2.default.config.showSection == false) {
      document.querySelector('#data .status').remove();
    }

    UI.displayNode(_tree2.default.getNodeByID(_tree2.default.config.startNodeID));
  },
  addBackBtn: function addBackBtn() {
    var backBtn = document.querySelector('#btn-back');
    if (backBtn === null) {
      backBtn = document.createElement('button');
      backBtn.id = "btn-back";
      backBtn.classList.add("btn-nav");
      backBtn.disabled = true;
      backBtn.innerHTML = "Back";
      backBtn.addEventListener('click', function () {
        UI.displayNode(_tree2.default.history.back());
      }, false);
      document.querySelector('#data nav').appendChild(backBtn);
    } else {
      if (backBtn.style.display = "none") {
        backBtn.style.display = "";
      }

      if (_tree2.default.navHistory.length > 0) {
        backBtn.disabled = false;
      } else {
        backBtn.disabled = true;
      }
    }
  },
  addFinishBtn: function addFinishBtn(allowSave) {
    var target = document.querySelector('#data .content'),
        finishBtn = document.getElementById('btn-finish');

    if (finishBtn === null) {
      finishBtn = document.createElement('button');
      var finishFunction = null;
      finishBtn.id = "btn-finish";
      finishBtn.classList.add("btn-choice", "btn-primary");
      finishBtn.innerHTML = allowSave ? "Log Incident and Restart" : "Start Over";

      if (allowSave) {
        finishFunction = function finishFunction() {
          var currentNodeID = _tree2.default.getNodeByID(_tree2.default.currentNodeID).id;
          _tree2.default.history.add(currentNodeID, "");
          _tree2.default.history.save(_tree2.default.getNodeByID(_tree2.default.currentNodeID).id, _tree2.default.navHistory);
          UI.init();
        };
      } else {
        finishFunction = function finishFunction() {
          UI.init();
        };
      }

      finishBtn.addEventListener('click', finishFunction, false);

      target.appendChild(finishBtn);
    } else {
      if (finishBtn.style.display = "none") {
        finishBtn.style.display = "";
      }
    }
  },
  removeFinishBtn: function removeFinishBtn(allowSave) {
    var finishBtn = document.getElementById('btn-finish');
    if (finishBtn !== null) {
      document.getElementById('btn-finish').remove();
    }
  },
  loadSavedHistory: function loadSavedHistory() {
    var target = document.querySelector('#saved .content'),
        targetInstructions = document.querySelector('#saved .instructions'),
        clearHistoryBtn = document.querySelector('#saved .btn-nav');

    target.innerHTML = "";

    _tree2.default.history.load();

    for (var item in _tree2.default.savedHistory) {
      UI.addHistoryBtn(_tree2.default.savedHistory[item]);
    };

    if (_tree2.default.savedHistory.length > 0) {
      if (clearHistoryBtn === null) {
        clearHistoryBtn = document.createElement('button');
        clearHistoryBtn.classList.add("btn-nav");
        clearHistoryBtn.innerHTML = "Clear History";
        clearHistoryBtn.addEventListener('click', function () {
          _tree2.default.history.clear();
          UI.loadSavedHistory();
        });
        document.querySelector('#saved nav').appendChild(clearHistoryBtn);
        targetInstructions.innerHTML = "Select an incident to review its history.";
      }
    } else {
      if (clearHistoryBtn !== null) clearHistoryBtn.remove();
      targetInstructions.innerHTML = "There are no saved incidents.";
    }
  },
  addHistoryBtn: function addHistoryBtn(item) {
    var target = document.querySelector('#saved .content');
    var historyBtn = document.createElement('button');

    historyBtn.classList.add("btn-history");
    historyBtn.innerHTML = '<p><span class="title">' + item.endpoint + '</span><br>' + item.timestamp + '</p>';
    historyBtn.addEventListener('click', function () {
      UI.toggleReviewMode(item);
    }, false);

    target.appendChild(historyBtn);
  },
  addReviewBtns: function addReviewBtns() {
    if (document.getElementById('btn-exit-review') === null) {
      var exitReviewBtn = document.createElement('button');
      exitReviewBtn.id = "btn-exit-review";
      exitReviewBtn.classList.add("btn-nav");
      exitReviewBtn.innerHTML = "Exit Review";
      exitReviewBtn.addEventListener('click', function () {
        this.remove();
        UI.toggleReviewMode();
        UI.displayNode(_tree2.default.getNodeByID(_tree2.default.currentNodeID));
      }, false);
      document.querySelector('#data nav').appendChild(exitReviewBtn);
    }
  },
  toggleReviewMode: function toggleReviewMode() {
    var item = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    var breadcrumb = document.querySelector('#data .status');
    if (item !== null) {
      breadcrumb.innerHTML = 'Reviewing ' + item.endpoint + ' incident';

      _tree2.default.config.reviewMode = true;
      _tree2.default.reviewNavHistory = item.history;

      document.querySelector('#data .content').innerHTML = UI.createHistoryList();

      var backBtn = document.getElementById('btn-back'),
          btnFinish = document.getElementById('btn-finish');

      if (backBtn !== null) backBtn.style.display = "none";
      if (btnFinish !== null) btnFinish.style.display = "none";

      UI.addReviewBtns();
    } else {
      _tree2.default.config.reviewMode = false;
    }
  },
  displayNode: function displayNode(node) {
    _tree2.default.currentNodeID = node.id;

    var nodeMarkup = '<p>' + node.text + '</p>';

    if (node.choices !== undefined) {
      var noBtn = false;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = node.choices[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var choice = _step.value;

          noBtn = choice.text.includes("No (start over)");
          nodeMarkup += '<button class="btn-choice ' + (noBtn ? 'btn-warn' : '') + '" data-target="' + choice.targetNode + '">' + choice.text + '</button>';
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }

    var target = document.querySelector('#data .content');
    target.innerHTML = nodeMarkup;

    var choiceButtons = document.querySelectorAll('#data .content button');

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = choiceButtons[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var btn = _step2.value;

        btn.addEventListener('click', function () {
          var choice = this.innerHTML;
          _tree2.default.history.add(node.id, choice);
          UI.displayNode(_tree2.default.getNodeByID(this.dataset.target));
        }, false);
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    UI.addBackBtn();

    if (node.type == "end") {
      UI.addFinishBtn(_tree2.default.config.allowSave);
    } else {
      UI.removeFinishBtn(_tree2.default.config.allowSave);
    }

    if (_tree2.default.config.showSection) {
      UI.updateSection(node);
    }

    if (_tree2.default.config.debugMode) {
      document.getElementById('history').innerHTML = UI.createHistoryList(true, true);
    }
  },
  updateSection: function updateSection(node) {
    document.querySelector('#data .status').innerHTML = _tree2.default.getSectionByNodeID(node.id);
  },
  createHistoryList: function createHistoryList() {
    var includeCurrentNode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var includeNodeID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var stepCount = 0;
    var itemTable = '<table class="history"><thead><tr><th>Step</th>';

    if (includeNodeID) itemTable += '<th>ID</th>';

    itemTable += '<th>Decision</th><th>Choice</th></tr></thead><tbody>';

    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = _tree2.default.reviewNavHistory[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var item = _step3.value;

        stepCount = item[1].length === 0 ? "END" : ++stepCount;
        itemTable += '<tr><td>' + stepCount + '</td>';

        if (includeNodeID) itemTable += '<td>' + item[0] + '</td>';

        itemTable += '<td>' + _tree2.default.getNodeByID(item[0]).text + '</td><td>' + item[1] + '</td></tr>';
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }

    if (includeCurrentNode) {
      var endNode = _tree2.default.getNodeByID(_tree2.default.currentNodeID);
      itemTable += '<tr><td>Current</td><td>' + endNode.id + '</td><td>' + endNode.text + '</td><td></td></tr>';
    }

    itemTable += '</tbody></table>';

    return itemTable;
  }
};

exports.default = UI;

},{"./tree":4}],2:[function(require,module,exports){
"use strict";

var _UI = require("./UI");

var _UI2 = _interopRequireDefault(_UI);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*document.getElementById('begin').addEventListener('click', function() {
  UI.init();
}, false);*/

window.onload = function () {
  _UI2.default.init();
};

},{"./UI":1}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var questionBank = {
    BEST: "Which of the following best describes the issue?",
    OTHER: function OTHER(text) {
        return "Is this some other " + text + " issue not mentioned or is there a suggestion?";
    }
};

var TreeNodes = {
    sections: {
        "0.0": "Initial Section",
        "1.0": "Training System Technical Issues",
        "2.0": "Course Content Issues",
        "3.0": "Training System Transcript Issues",
        "4.0": "Computer and Browser Issues",
        "1.1": "Searching for a Course",
        "1.1.1": "Other",
        "1.2": "Course Registrations",
        "1.2.1": "Registering",
        "1.2.2": "Accessing",
        "1.2.3": "Dropping",
        "1.3": "Launching a Course",
        "1.4": "Navigating a Course",
        "1.4.1": "Course Buttons",
        "1.4.2": "Blocked Progress",
        "2.1": "Text and Image Appearance",
        "2.2": "Lesson Instructional Content",
        "2.2.1": "Unclear Content",
        "2.2.2": "Incorrect Content",
        "2.2.3": "Other",
        "2.3": "Exam Content",
        "2.3.1": "Answers",
        "2.3.3": "Other",
        "2.4": "Multimedia",
        "2.4.1": "Audio",
        "2.4.2": "Video",
        "3.1": "Status and Credit",
        "3.1.1": "Module",
        "3.1.2": "Course",
        "3.2": "Certificate",
        "3.3": "Attempt Limit",
        "4.1": "Accessing a Web Page",
        "4.2": "Error Message"
    },

    nodes: {
        "0.0": {
            id: "0.0",
            type: "question",
            text: questionBank.BEST,
            choices: [{
                text: "Issue with training system usage such as registration and other general issues",
                targetNode: "1.0"
            }, {
                text: "Issue with the course content such as instruction, appearance, or multimedia",
                targetNode: "2.0"
            }, {
                text: "Issue with course completion or credit such as rollup or certificates",
                targetNode: "3.0"
            }, {
                text: "Issue with the website or computer such as web browser errors",
                targetNode: "4.0"
            }]
        },
        "1.0": {
            id: "1.0",
            type: "question",
            text: questionBank.BEST,
            choices: [{
                text: "Issue with general usage such as searching for a course",
                targetNode: "1.1"
            }, {
                text: "Issue with course registration such as creating, accessing, or dropping a registration",
                targetNode: "1.2"
            }, {
                text: "Issue with launching a registered course such as the Launch button",
                targetNode: "1.3"
            }, {
                text: "Issue with navigating within a course such as bookmarking or menu buttons",
                targetNode: "1.4"
            }]
        },
        "1.1": {
            id: "1.1",
            type: "question",
            text: questionBank.BEST,
            choices: [{
                text: "Search controls such as text fields or buttons are not responding",
                targetNode: "N2B"
            }, {
                text: "Search returns duplicate results",
                targetNode: "N3H"
            }, {
                text: "Unable to find an item using search",
                targetNode: "N2A"
            }, {
                text: "Something else",
                targetNode: "1.1.1"
            }]
        },
        "1.1.1": {
            id: "1.1.1",
            type: "question",
            text: questionBank.BEST,
            choices: [{
                text: "Training system tutorial/help video does not play",
                targetNode: "N6H"
            }, {
                text: "Something else",
                targetNode: "1.1.1.1"
            }]
        },
        "1.1.1.1": {
            id: "1.1.1.1",
            type: "question",
            text: questionBank.OTHER('search'),
            choices: [{
                text: "Yes (specify)",
                targetNode: "N2C"
            }, {
                text: "No (start over)",
                targetNode: "0.0"
            }]
        },
        "1.2": {
            id: "1.2",
            type: "question",
            text: questionBank.BEST,
            choices: [{
                text: "Registering for a course",
                targetNode: "1.2.1"
            }, {
                text: "Accessing a course after registration",
                targetNode: "1.2.2"
            }, {
                text: "Dropping a course",
                targetNode: "1.2.3"
            }]
        },
        "1.2.1": {
            id: "1.2.1",
            type: "question",
            text: questionBank.BEST,
            choices: [{
                text: "Cannot register for a course",
                targetNode: "1.2.1.1"
            }, {
                text: "Something else",
                targetNode: "1.2.1.2"
            }]
        },
        "1.2.1.1": {
            id: "1.2.1.1",
            type: "question",
            text: "Is this a course on an external system such as ATRRS?",
            choices: [{
                text: "Yes",
                targetNode: "N3A"
            }, {
                text: "No",
                targetNode: "N3C"
            }]
        },
        "1.2.1.2": {
            id: "1.2.1.2",
            type: "question",
            text: questionBank.OTHER('registration'),
            choices: [{
                text: "Yes (specify)",
                targetNode: "N3J"
            }, {
                text: "No (start over)",
                targetNode: "0.0"
            }]
        },
        "1.2.2": {
            id: "1.2.2",
            type: "question",
            text: questionBank.BEST,
            choices: [{
                text: "Course registration not visible",
                targetNode: "1.2.2.1"
            }, {
                text: "Cannot access a registered course",
                targetNode: "N3B"
            }, {
                text: "One or more parts of a registered course are not visible",
                targetNode: "N3F"
            }]
        },
        "1.2.2.1": {
            id: "1.2.2.1",
            type: "question",
            text: questionBank.BEST,
            choices: [{
                text: "Course registration on external system such as ATRRS not visible in training record",
                targetNode: "N3G"
            }, {
                text: "Course registration not visible in training record",
                targetNode: "N3E"
            }, {
                text: "Course credit already exists in training record",
                targetNode: "N3I"
            }]
        },
        "1.2.3": {
            id: "1.2.3",
            type: "question",
            text: questionBank.BEST,
            choices: [{
                text: "Unable to drop a course",
                targetNode: "N3D"
            }, {
                text: "Something else",
                targetNode: "1.2.3.1"
            }]
        },
        "1.2.3.1": {
            id: "1.2.3.1",
            type: "question",
            text: questionBank.OTHER('drop'),
            choices: [{
                text: "Yes (specify)",
                targetNode: "N3J"
            }, {
                text: "No (start over)",
                targetNode: "0.0"
            }]
        },
        "1.3": {
            id: "1.3",
            type: "question",
            text: questionBank.BEST,
            choices: [{
                text: "Launch button or link did not launch course",
                targetNode: "N4A"
            }, {
                text: "Launch button or link is not available",
                targetNode: "N4H"
            }, {
                text: "Something else",
                targetNode: "1.3.1"
            }]
        },
        "1.3.1": {
            id: "1.3.1",
            type: "question",
            text: questionBank.OTHER('launch'),
            choices: [{
                text: "Yes (specify)",
                targetNode: "N4I"
            }, {
                text: "No (start over)",
                targetNode: "0.0"
            }]
        },
        "1.3.2": {
            id: "1.3.2",
            type: "question",
            text: questionBank.OTHER('launch'),
            choices: [{
                text: "Yes (specify)",
                targetNode: "N4I"
            }, {
                text: "No (start over)",
                targetNode: "0.0"
            }]
        },
        "1.4": {
            id: "1.4",
            type: "question",
            text: questionBank.BEST,
            choices: [{
                text: "Navigation links or buttons inside the course are not responding as expected",
                targetNode: "1.4.1"
            }, {
                text: "Table-of-Contents does not work",
                targetNode: "N4F"
            }, {
                text: "Course launches but does not return to previous location",
                targetNode: "N4G"
            }, {
                text: "Course exited unexpectedly or progress was blocked",
                targetNode: "1.4.2"
            }]
        },
        "1.4.1": {
            id: "1.4.1",
            type: "question",
            text: questionBank.BEST,
            choices: [{
                text: "Navigation buttons such as Back and Next are not responding as expected",
                targetNode: "N4E"
            }, {
                text: "Other buttons or links such as Menu or Glossary are not responding as expected",
                targetNode: "N4J"
            }]
        },
        "1.4.2": {
            id: "1.4.2",
            type: "question",
            text: questionBank.BEST,
            choices: [{
                text: "Course exited unexpectedly",
                targetNode: "N4C"
            }, {
                text: "Progress was blocked (with message)",
                targetNode: "N4D"
            }, {
                text: "Progress was blocked (no message)",
                targetNode: "N4B"
            }, {
                text: "Something else",
                targetNode: "1.4.2.1"
            }]
        },
        "1.4.2.1": {
            id: "1.4.2.1",
            type: "question",
            text: questionBank.OTHER('course progression'),
            choices: [{
                text: "Yes (specify)",
                targetNode: "N4I"
            }, {
                text: "No (start over)",
                targetNode: "0.0"
            }]
        },
        "2.0": {
            id: "2.0",
            type: "question",
            text: questionBank.BEST,
            choices: [{
                text: "Issue with the appearance of text or images",
                targetNode: "2.1"
            }, {
                text: "Issue with a lesson's instructional content",
                targetNode: "2.2"
            }, {
                text: "Issue with exam content",
                targetNode: "2.3"
            }, {
                text: "Issue with multimedia such as audio or video",
                targetNode: "2.4"
            }]
        },
        "2.1": {
            id: "2.1",
            type: "question",
            text: questionBank.BEST,
            choices: [{
                text: "Could not read text",
                targetNode: "C2A"
            }, {
                text: "Images are incorrect or garbled",
                targetNode: "C2B"
            }, {
                text: "Paragraph ends abruptly or text runs off screen",
                targetNode: "C2C"
            }, {
                text: "Something else",
                targetNode: "2.1.1"
            }]
        },
        "2.1.1": {
            id: "2.1.1",
            type: "question",
            text: questionBank.OTHER('content appearance'),
            choices: [{
                text: "Yes (specify)",
                targetNode: "C2D"
            }, {
                text: "No (start over)",
                targetNode: "0.0"
            }]
        },
        "2.2": {
            id: "2.2",
            type: "question",
            text: questionBank.BEST,
            choices: [{
                text: "Content is unclear",
                targetNode: "2.2.1"
            }, {
                text: "Content is incorrect",
                targetNode: "2.2.2"
            }, {
                text: "Something else sush as broken links or other content issues",
                targetNode: "2.2.3"
            }]
        },
        "2.2.1": {
            id: "2.2.1",
            type: "question",
            text: "Is the unclear content lesson material or a check on learning?",
            choices: [{
                text: "Lesson material",
                targetNode: "C4A"
            }, {
                text: "Check on learning",
                targetNode: "C4B"
            }, {
                text: "Something else",
                targetNode: "2.2.1.1"
            }]
        },
        "2.2.1.1": {
            id: "2.2.1.1",
            type: "question",
            text: questionBank.OTHER('content clarity'),
            choices: [{
                text: "Yes (specify)",
                targetNode: "C4D"
            }, {
                text: "No (start over)",
                targetNode: "0.0"
            }]
        },
        "2.2.2": {
            id: "2.2.2",
            type: "question",
            text: "Is the incorrect content doctrine or an image?",
            choices: [{
                text: "Doctrine",
                targetNode: "C3A"
            }, {
                text: "Image",
                targetNode: "C3B"
            }]
        },
        "2.2.3": {
            id: "2.2.3",
            type: "question",
            text: questionBank.BEST,
            choices: [{
                text: "Broken link in a lesson",
                targetNode: "C3F"
            }, {
                text: "Lesson contains PII",
                targetNode: "C3D"
            }, {
                text: "Lesson contains redundant information",
                targetNode: "C3E"
            }, {
                text: "Something else",
                targetNode: "2.2.3.1"
            }]
        },
        "2.2.3.1": {
            id: "2.2.3.1",
            type: "question",
            text: questionBank.OTHER('instructional content'),
            choices: [{
                text: "Yes (specify)",
                targetNode: "C3G"
            }, {
                text: "No (start over)",
                targetNode: "0.0"
            }]
        },
        "2.3": {
            id: "2.3",
            type: "question",
            text: questionBank.BEST,
            choices: [{
                text: "Issue with answers in an assessment",
                targetNode: "2.3.1"
            }, {
                text: "Incorrect score was reported",
                targetNode: "C1E"
            }, {
                text: "Something else",
                targetNode: "2.3.3"
            }]
        },
        "2.3.1": {
            id: "2.3.1",
            type: "question",
            text: questionBank.BEST,
            choices: [{
                text: "One or more answers were inactive or could not be selected",
                targetNode: "C1B"
            }, {
                text: "One or more answers were unclear",
                targetNode: "C4C"
            }, {
                text: "There were multiple correct answers",
                targetNode: "C1D"
            }, {
                text: "One or more answers were missing or there was no correct answer",
                targetNode: "2.3.1.1"
            }]
        },
        "2.3.1.1": {
            id: "2.3.1.1",
            type: "question",
            text: questionBank.BEST,
            choices: [{
                text: "One or more answers were missing",
                targetNode: "C1A"
            }, {
                text: "There was no correct answer",
                targetNode: "C1C"
            }]
        },
        "2.3.2": {
            id: "2.3.2",
            type: "question",
            text: "Was the incorrect score reported before exiting the exam?",
            choices: [{
                text: "Yes",
                targetNode: "C1E"
            }, {
                text: "No",
                targetNode: "C1G"
            }]
        },
        "2.3.3": {
            id: "2.3.3",
            type: "question",
            text: questionBank.BEST,
            choices: [{
                text: "The assessment content does not match the lesson content",
                targetNode: "C3C"
            }, {
                text: "Something else",
                targetNode: "2.3.3.1"
            }]
        },
        "2.3.3.1": {
            id: "2.3.3.1",
            type: "question",
            text: questionBank.OTHER('exam content'),
            choices: [{
                text: "Yes (specify)",
                targetNode: "C1G"
            }, {
                text: "No (start over)",
                targetNode: "0.0"
            }]
        },
        "2.4": {
            id: "2.4",
            type: "question",
            text: questionBank.BEST,
            choices: [{
                text: "Audio",
                targetNode: "2.4.1"
            }, {
                text: "Video",
                targetNode: "2.4.2"
            }, {
                text: "Something else",
                targetNode: "2.4.3"
            }]
        },
        "2.4.1": {
            id: "2.4.1",
            type: "question",
            text: questionBank.BEST,
            choices: [{
                text: "Audio does not play at all",
                targetNode: "N6C"
            }, {
                text: "Audio plays improperly such as stuttering",
                targetNode: "N6D"
            }, {
                text: "Audio does not match video such as incorrect closed captioning or a delay",
                targetNode: "N6E"
            }]
        },
        "2.4.2": {
            id: "2.4.2",
            type: "question",
            text: questionBank.BEST,
            choices: [{
                text: "Video plays improperly such as stuttering or blocked view",
                targetNode: "N6B"
            }, {
                text: "Video player appears but the video does not load",
                targetNode: "N6F"
            }, {
                text: "Video appears to load but does not play",
                targetNode: "2.4.2.1"
            }]
        },
        "2.4.2.1": {
            id: "2.4.2.1",
            type: "question",
            text: "Is this a tutorial or help video?",
            choices: [{
                text: "Yes",
                targetNode: "N6H"
            }, {
                text: "No",
                targetNode: "N6A"
            }]
        },
        "2.4.3": {
            id: "2.4.3",
            type: "question",
            text: questionBank.OTHER('multimedia'),
            choices: [{
                text: "Yes (specify)",
                targetNode: "N6I"
            }, {
                text: "No (start over)",
                targetNode: "0.0"
            }]
        },
        "3.0": {
            id: "3.0",
            type: "question",
            text: questionBank.BEST,
            choices: [{
                text: "Issue with course status or credit",
                targetNode: "3.1"
            }, {
                text: "Issue with certificate",
                targetNode: "3.2"
            }, {
                text: "Issue with attempt limit",
                targetNode: "3.3"
            }, {
                text: "Something else",
                targetNode: "3.4"
            }]
        },
        "3.1": {
            id: "3.1",
            type: "question",
            text: questionBank.BEST,
            choices: [{
                text: "Issue with a part of a course such as a lesson or exam",
                targetNode: "3.1.1"
            }, {
                text: "Issue with the entire course",
                targetNode: "3.1.2"
            }]
        },
        "3.1.1": {
            id: "3.1.1",
            type: "question",
            text: questionBank.BEST,
            choices: [{
                text: "Completed a lesson but did not receive credit",
                targetNode: "N5A"
            }, {
                text: "Exam shows incorrect score after completion",
                targetNode: "N5C"
            }, {
                text: "Passed an exam but did not receive credit",
                targetNode: "N5D"
            }]
        },
        "3.1.2": {
            id: "3.1.2",
            type: "question",
            text: questionBank.BEST,
            choices: [{
                text: "Course credit not received after receiving credit for all modules",
                targetNode: "N5B"
            }, {
                text: "Course is already complete after registration",
                targetNode: "N3I"
            }, {
                text: "System did not forward credit to external system such as ATRRS",
                targetNode: "N5E"
            }, {
                text: "Something else",
                targetNode: "3.1.2.1"
            }]
        },
        "3.1.2.1": {
            id: "3.1.2.1",
            type: "question",
            text: questionBank.OTHER('status or credit'),
            choices: [{
                text: "Yes (specify)",
                targetNode: "N5F"
            }, {
                text: "No (start over)",
                targetNode: "0.0"
            }]
        },
        "3.2": {
            id: "3.2",
            type: "question",
            text: questionBank.BEST,
            choices: [{
                text: "Cannot find or print existing certificate",
                targetNode: "N9B"
            }, {
                text: "Certificate does not appear when expected",
                targetNode: "N9C"
            }]
        },
        "3.3": {
            id: "3.3",
            type: "question",
            text: "Can the attempt limit be reset?",
            choices: [{
                text: "Yes",
                targetNode: "N9E"
            }, {
                text: "No",
                targetNode: "C1F"
            }]
        },
        "3.4": {
            id: "3.4",
            type: "question",
            text: questionBank.OTHER('course completion or credit'),
            choices: [{
                text: "Yes (specify)",
                targetNode: "N9F"
            }, {
                text: "No (start over)",
                targetNode: "0.0"
            }]
        },
        "4.0": {
            id: "4.0",
            type: "question",
            text: questionBank.BEST,
            choices: [{
                text: "Issue with accessing a webpage such as a training system",
                targetNode: "4.1"
            }, {
                text: "Error message appears while on a webpage such as a training system",
                targetNode: "4.2"
            }, {
                text: "Something else",
                targetNode: "4.3"
            }]
        },
        "4.1": {
            id: "4.1",
            type: "question",
            text: questionBank.BEST,
            choices: [{
                text: "Browser crashed or became unresponsive while accessing the web page",
                targetNode: "N1A"
            }, {
                text: "Whole computer crashed or became unresponsive while accessing the web page",
                targetNode: "N1C"
            }, {
                text: "The web page is accessible but loads slowly or incompletely",
                targetNode: "N1D"
            }, {
                text: "Internet connection is working but the training system's web pages do not load at all",
                targetNode: "N9A"
            }]
        },
        "4.2": {
            id: "4.2",
            type: "question",
            text: questionBank.BEST,
            choices: [{
                text: "Web page displayed a Java error as an inline message",
                targetNode: "N8A"
            }, {
                text: "Web page displayed an Oracle error as an inline message",
                targetNode: "N8B"
            }, {
                text: "Browser displayed a script error in a pop-up or at the bottom of the window",
                targetNode: "N8D"
            }, {
                text: "Cannot determine the type of error that occured",
                targetNode: "N8C"
            }]
        },
        "4.3": {
            id: "4.3",
            type: "question",
            text: questionBank.OTHER('system-related'),
            choices: [{
                text: "Yes (specify)",
                targetNode: "N1E"
            }, {
                text: "No (start over)",
                targetNode: "0.0"
            }]
        },
        "C1A": {
            id: "C1A",
            type: "end",
            text: "Record C1A Answers Missing"
        },
        "C1B": {
            id: "C1B",
            type: "end",
            text: "Record C1B Answers Inactive"
        },
        "C1C": {
            id: "C1C",
            type: "end",
            text: "Record C1C No Correct Answer"
        },
        "C1D": {
            id: "C1D",
            type: "end",
            text: "Record C1D Multiple Correct Answers"
        },
        "C1E": {
            id: "C1E",
            type: "end",
            text: "Record C1E Incorrect Scoring (during exam)"
        },
        "C1F": {
            id: "C1F",
            type: "end",
            text: "Record C1F Number of Test Attempts (not adjusted)"
        },
        "C1G": {
            id: "C1G",
            type: "end",
            text: "Record C1G Completed/Failed Test Issue"
        },
        "C2A": {
            id: "C2A",
            type: "end",
            text: "Record C2A Legibility of Text"
        },
        "C2B": {
            id: "C2B",
            type: "end",
            text: "Record C2B Image Rendering"
        },
        "C2C": {
            id: "C2C",
            type: "end",
            text: "Record C2C Scroll Bar"
        },
        "C2D": {
            id: "C2D",
            type: "end",
            text: "Record C2D Other"
        },
        "C3A": {
            id: "C3A",
            type: "end",
            text: "Record C3A Incorrect or Outdated Doctrine"
        },
        "C3B": {
            id: "C3B",
            type: "end",
            text: "Record C3B Incorrect or Outdated Imagery"
        },
        "C3C": {
            id: "C3C",
            type: "end",
            text: "Record C3C Test Doesn't Assess Presented Course"
        },
        "C3D": {
            id: "C3D",
            type: "end",
            text: "Record C3D Personally Identifiable Information (PII)"
        },
        "C3E": {
            id: "C3E",
            type: "end",
            text: "Record C3E Redundant Content"
        },
        "C3F": {
            id: "C3F",
            type: "end",
            text: "Record C3F Broken Hyperlink"
        },
        "C3G": {
            id: "C3G",
            type: "end",
            text: "Record C3G Other"
        },
        "C4A": {
            id: "C4A",
            type: "end",
            text: "Record C4A Course Material"
        },
        "C4B": {
            id: "C4B",
            type: "end",
            text: "Record C4B Check on Learning"
        },
        "C4C": {
            id: "C4C",
            type: "end",
            text: "Record C4C Exam Answers"
        },
        "C4D": {
            id: "C4D",
            type: "end",
            text: "Record C4D Other"
        },
        "N1A": {
            id: "N1A",
            type: "end",
            text: "Record N1A Browser Doesn't Work"
        },
        "N1C": {
            id: "N1C",
            type: "end",
            text: "Record N1C Computer Locks Up"
        },
        "N1D": {
            id: "N1D",
            type: "end",
            text: "Record N1D Poor Connectivity"
        },
        "N1E": {
            id: "N1E",
            type: "end",
            text: "Record N1E Other"
        },
        "N2A": {
            id: "N2A",
            type: "end",
            text: "Record N2A Fails to Find Item"
        },
        "N2B": {
            id: "N2B",
            type: "end",
            text: "Record N2B Learner Unable to Use Search"
        },
        "N2C": {
            id: "N2C",
            type: "end",
            text: "Record N2C Other"
        },
        "N3A": {
            id: "N3A",
            type: "end",
            text: "Record N3A ATRRS Registration Issue"
        },
        "N3B": {
            id: "N3B",
            type: "end",
            text: "Record N3B Course Unavailable (Pending Schedule)"
        },
        "N3C": {
            id: "N3C",
            type: "end",
            text: "Record N3C Can't Register for Course"
        },
        "N3D": {
            id: "N3D",
            type: "end",
            text: "Record N3D Can't Drop Registration"
        },
        "N3E": {
            id: "N3E",
            type: "end",
            text: "Record N3E Enrollment Not Visible"
        },
        "N3F": {
            id: "N3F",
            type: "end",
            text: "Record N3F Course Modules Drop w/o Completion"
        },
        "N3G": {
            id: "N3G",
            type: "end",
            text: "Record N3G No Indication ALMS/ATRRS Enrolled"
        },
        "N3H": {
            id: "N3H",
            type: "end",
            text: "Record N3H Learner Can't Pick Course From List"
        },
        "N3I": {
            id: "N3I",
            type: "end",
            text: "Record N3I Course Auto Complete Upon Registration"
        },
        "N3J": {
            id: "N3J",
            type: "end",
            text: "Record N3J Other"
        },
        "N4A": {
            id: "N4A",
            type: "end",
            text: "Record N4A Course Doesn't Launch"
        },
        "N4B": {
            id: "N4B",
            type: "end",
            text: "Record N4B Can't Proceed/Return (blocked)"
        },
        "N4C": {
            id: "N4C",
            type: "end",
            text: "Record N4C Learner Forced from Course"
        },
        "N4D": {
            id: "N4D",
            type: "end",
            text: "Record N4D Dialog Box Issues"
        },
        "N4E": {
            id: "N4E",
            type: "end",
            text: "Record N4E Navigation Button Malfunction"
        },
        "N4F": {
            id: "N4F",
            type: "end",
            text: "Record N4F Table-of-Contents Topic Link"
        },
        "N4G": {
            id: "N4G",
            type: "end",
            text: "Record N4G Bookmark Issues"
        },
        "N4H": {
            id: "N4H",
            type: "end",
            text: "Record N4H Learner Can't Operate LMS GUI"
        },
        "N4I": {
            id: "N4I",
            type: "end",
            text: "Record N4I Other"
        },
        "N4J": {
            id: "N4J",
            type: "end",
            text: "Record N4J Learner Can't Operate Courseware GUI"
        },
        "N5A": {
            id: "N5A",
            type: "end",
            text: "Record N5A Lesson/Module"
        },
        "N5B": {
            id: "N5B",
            type: "end",
            text: "Record N5B Course"
        },
        "N5C": {
            id: "N5C",
            type: "end",
            text: "Record N5C Incorrect Scoring (after exam exited)"
        },
        "N5D": {
            id: "N5D",
            type: "end",
            text: "Record N5D Completed Test Issue/Not Recorded"
        },
        "N5E": {
            id: "N5E",
            type: "end",
            text: "Record N5E Credit Not Forwarded to External System"
        },
        "N5F": {
            id: "N5F",
            type: "end",
            text: "Record N5F Other"
        },
        "N6A": {
            id: "N6A",
            type: "end",
            text: "Record N6A Video Doesn't Play"
        },
        "N6B": {
            id: "N6B",
            type: "end",
            text: "Record N6B Video Plays Improperly"
        },
        "N6C": {
            id: "N6C",
            type: "end",
            text: "Record N6C No Audio When Expected"
        },
        "N6D": {
            id: "N6D",
            type: "end",
            text: "Record N6D Audio Plays Improperly"
        },
        "N6E": {
            id: "N6E",
            type: "end",
            text: "Record N6E Audio Out of Sync with Video"
        },
        "N6F": {
            id: "N6F",
            type: "end",
            text: "Record N6F No Video Shows Up at All"
        },
        "N6H": {
            id: "N6H",
            type: "end",
            text: "Record N6H Tutorial/Help Video Does Not Play"
        },
        "N6I": {
            id: "N6I",
            type: "end",
            text: "Record N6I Other"
        },
        "N8A": {
            id: "N8A",
            type: "end",
            text: "Record N8A Java"
        },
        "N8B": {
            id: "N8B",
            type: "end",
            text: "Record N8B Oracle"
        },
        "N8C": {
            id: "N8C",
            type: "end",
            text: "Record N8C Other"
        },
        "N8D": {
            id: "N8D",
            type: "end",
            text: "Record N8D Script"
        },
        "N9A": {
            id: "N9A",
            type: "end",
            text: "Record N9A Delivery System Not Available"
        },
        "N9B": {
            id: "N9B",
            type: "end",
            text: "Record N9B Can't Find/Print Training Cert"
        },
        "N9C": {
            id: "N9C",
            type: "end",
            text: "Record N9C Training Certificate Not Available"
        },
        "N9E": {
            id: "N9E",
            type: "end",
            text: "Record N9E Number of Test Attempts (adjusted)"
        },
        "N9F": {
            id: "N9F",
            type: "end",
            text: "Record N9F Other"
        }
    }
};

exports.default = TreeNodes;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _treeNodes = require("./tree-nodes");

var _treeNodes2 = _interopRequireDefault(_treeNodes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Tree = {

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
    localStorageActive: function () {
      try {
        localStorage.setItem("localStorageTest", "test");
        localStorage.removeItem("localStorageTest");
        return true;
      } catch (e) {
        return false;
      }
    }(),

    getTimeStamp: function getTimeStamp() {
      var timeStamp = new Date();
      return timeStamp.getFullYear() + "-" + (timeStamp.getMonth() + 1 < 10 ? "0" : "") + (timeStamp.getMonth() + 1) + "-" + (timeStamp.getDate() < 10 ? "0" : "") + timeStamp.getDate() + ", " + (timeStamp.getHours() < 10 ? "0" : "") + timeStamp.getHours() + ":" + (timeStamp.getMinutes() < 10 ? "0" : "") + timeStamp.getMinutes() + ":" + (timeStamp.getSeconds() < 10 ? "0" : "") + timeStamp.getSeconds();
    }
  },

  history: {
    add: function add() {
      var nodeID = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "0.0";
      var choice = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "-";

      Tree.navHistory.push([nodeID, choice]);
    },
    back: function back() {
      if (Tree.navHistory.length > 0) {
        return _treeNodes2.default.nodes[Tree.navHistory.pop()[0]];
      }
    },
    save: function save(endpoint, history) {
      if (Tree.util.localStorageActive) {
        var itemName = Tree.config.prefix + "-history";

        if (localStorage.getItem(itemName) !== null) {
          Tree.savedHistory = JSON.parse(localStorage.getItem(itemName));
        }

        var entryName = new Date().toISOString();
        Tree.savedHistory.push({ "endpoint": endpoint, "timestamp": Tree.util.getTimeStamp(), "history": history });

        window.localStorage.setItem(itemName, JSON.stringify(Tree.savedHistory));
      }
    },
    load: function load() {
      if (Tree.util.localStorageActive) {
        var itemName = Tree.config.prefix + "-history";
        Tree.savedHistory = JSON.parse(localStorage.getItem(itemName)) || [];
      }
    },
    clear: function clear() {
      if (Tree.util.localStorageActive) {
        localStorage.clear();
      }
    }
  },

  getNodeByID: function getNodeByID(nodeID) {
    return _treeNodes2.default.nodes[nodeID];
  },
  getSectionByNodeID: function getSectionByNodeID(nodeID) {
    var sectionStr = "";
    var sectionCount = 0;

    for (var section in _treeNodes2.default.sections) {
      if (nodeID.startsWith(section.replace(".0", ""))) {

        if (sectionCount == 0) {
          sectionStr += _treeNodes2.default.sections[section];
        } else {
          sectionStr += " > " + _treeNodes2.default.sections[section];
        }

        Tree.currentSection = sectionStr;
        sectionCount++;
      }
    }

    return Tree.currentSection;
  }
};

exports.default = Tree;

},{"./tree-nodes":3}]},{},[2]);
