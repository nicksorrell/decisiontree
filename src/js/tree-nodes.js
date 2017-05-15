"use strict";

/**************************
 * TREE NODES
 * ---
 * The Tree Nodes file contains data constituting a decision tree.
 * A question bank object is used for common text, and the TreeNodes.sections
 * object contains any sections that should appear in the nav breadcrumb.
 *************************/

 /***************
  * QuestionBank object
  * ---
  * Contains default text strings and methods used to handle common text.
  ***************/
let questionBank = {
  BEST: "Which of the following best describes the issue?",
  OTHER(text) {
    return "Is this some other " + text + " issue not mentioned or is there a suggestion?";
  }
};

/***************
 * TreeNodes object
 * ---
 * The actual data for the decision tree. Contains a "sections" object for
 * sections that should show up in the breadcrumb, and a "nodes" object that
 * contains all decision and endpoint nodes.
 ***************/
let TreeNodes = {

  /* Sections that are important enough to show up as a breadcrumb go here.
   * Sections MUST appear in descending order (e.g., 0.0 -> 1.0 -> 1.2) to
   * show up properly in the breadcrumb. Leave the object blank if none.
   */
  sections: {
    "0.0": "Start",
    "1.0": "Section 1",
    "2.0": "Section 2",
    "3.0": "Section 3",
    "1.1": "Section 1.1",
    "1.1.1": "Section 1.1.1",
  },

  /* Each node uses a numeric ID for it's reference point.
   *
   * Decision nodes have the following attributes:
   * id: almost always the numeric ID
   * type: "question"
   * text: the text for the node
   * choices: an array of choices that have their own text and target node.
   *
   * Endpoint nodes have the following attributes:
   * id: almost always the numeric ID
   * type: "end" for endpoints
   * text: the text for the node
   */
  nodes: {
    "0.0": {
        id: "0.0",
        type: "question",
        text: questionBank.BEST,
        choices: [{
            text: "Go to section 1",
            targetNode: "1.0"
        }, {
            text: "Go to section 2",
            targetNode: "2.0"
        }, {
            text: "Go to section 3",
            targetNode: "3.0"
        }]
    },
    "1.0": {
        id: "1.0",
        type: "question",
        text: questionBank.BEST,
        choices: [{
            text: "Go to section 1.1",
            targetNode: "1.1"
        }, {
            text: "Go to endpoint 1",
            targetNode: "END1"
        }]
    },
    "1.1": {
        id: "1.1",
        type: "question",
        text: questionBank.BEST,
        choices: [{
            text: "Go to section 1.1.1",
            targetNode: "1.1.1"
        }, {
            text: "Go to endpoint 2",
            targetNode: "END2"
        }]
    },
    "1.1.1": {
        id: "1.1.1.1",
        type: "question",
        text: questionBank.OTHER("decision-making"),
        choices: [{
            text: "Yes (endpoint 1)",
            targetNode: "END1"
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
            text: "Go to endpoint 2",
            targetNode: "END2"
        }, {
            text: "Go to section 3",
            targetNode: "3.0"
        }]
    },
    "3.0": {
        id: "3.0",
        type: "question",
        text: questionBank.BEST,
        choices: [{
            text: "Go to section 1",
            targetNode: "1.0"
        }, {
            text: "Go to endpoint 3",
            targetNode: "END3"
        }]
    },
    "END1": {
        id: "END1",
        type: "end",
        text: "END1 endpoint"
    },
    "END2": {
        id: "END2",
        type: "end",
        text: "END2 endpoint"
    },
    "END3": {
        id: "END3",
        type: "end",
        text: "END3 endpoint"
    }
  }
};

export default TreeNodes;
