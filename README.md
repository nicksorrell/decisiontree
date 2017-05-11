# Incident Determination Decision Tree

A simple decision tree app that allows the user to navigate through a tree of decisions to arrive at an incident endpoint.
This is an ES2015 app that uses Babel and Browserify (via Gulp) to build.

## Installation
NPM is required to install the app's development dependencies (Babel, Browserify, Gulp, etc.)
`npm install`

## Build
Run the `default` Gulp task to build the app:
`gulp`

Run the `watch` Gulp task for automatic build:
`gulp watch`

Built files will be in _./dist_.

## Usage
To navigate the tree, open _index.html_ and select choices at each node.

Once an endpoint is reached, the choices that led to that point can be saved via localStorage.

## Editing
### App Data
The app's code is organized MVC-style across 3 modules:

__ui.js__
Contains all functionality for modifying the front-end HTML.
__tree.js__
Contains all functionality required for working with the tree node data. App config settings are found here.
__tree-nodes.js__
Contains the decision tree data that drives the app.

### Node Data
Decision tree data is in a JSON structure in _./src/js/tree-nodes.js_.

Nodes link to other nodes using their IDs until an endpoint is reached. The two types of nodes are:
__question__
```
nodes: {
  "0.0": {
      id: "0.0",
      type: "question",
      text: "This is the decision the user makes. What should they do?",
      choices: [{
          text: "Choice 1",
          targetNode: "1.0"
      }, {
          text: "Choice 2",
          targetNode: "C1A"
      }]
  }  
}
```

__end__
```
nodes: {
  "C1A": {
      id: "C1A",
      type: "end",
      text: "Record C1A Answers Missing"
  }  
}
```
