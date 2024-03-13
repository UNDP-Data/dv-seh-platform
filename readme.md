# Energy Moonshot AI Frontend
#### An AI chatbot UI [Click here to see the interface](https://lenseg.github.io/energy-hub-demo/).

## Table of Contents
* [Link for the visualization](#section-01)
* [Deployment](#deployment)
* [Steps to integrate the vis in static page](#section-02)
* [Related Repos](#section-04)
* [Global CSS Files and Repo](#section-05)
* [Build With](#section-06)
* [Installation](#section-07)
* [Local Deployment](#section-08)
* [Available Scripts](#section-09)
* [Tooling Setup](#section-10)
* [Contact](#section-11)

## Link for the visualization<a name="section-01"></a>
[Energy Moonshot AI](https://lenseg.github.io/energy-hub-demo/)

## Deployment
<a name="deployment"></a>
Testing environment being deployed to the [gh-pages](https://github.com/Lenseg/dv-seh-platform/tree/gh-pages) branch

<a name="section-02"></a>
## Steps to Integrating the Visualization in the Data Future Platform or Any Other Page
__Static build__

Use `npm run build`

There us no base url or any similar config set

<a name="section-04"></a>
## Related Repos
* [energy-graph-viz](https://github.com/dianaow/energy-graph-viz/) - node graph visualisation

<a name="section-05"></a>
## Global CSS for UI and Graphs
__Git Repo__: https://github.com/UNDP-Data/stylesheets-for-viz

__Link for stylesheets__
* https://undp-data.github.io/stylesheets-for-viz/style/mainStyleSheet.css
* https://undp-data.github.io/stylesheets-for-viz/style/StyleForGraphingInterface.css
* https://undp-data.github.io/stylesheets-for-viz/style/StyleForGraph.css

<a name="section-06"></a>
## Build with
* React ^18.0
* Antd ^5.11
* i18next

<a name="section-07"></a>
## Installation
This project uses `npm`. For installation you will need to install `node` and `npm`, if you don't already have it. `node` and `npm` can be installed from [here](https://nodejs.org/en/download/).

To install the project, simply clone the the repo and them run `npm install` in the project folder. You can use terminal on Mac and Command Prompt on Windows.

This project is bootstrapped with [`Vite`](https://vitejs.dev/) and was created using `npm create vite@latest` command.

Run the terminal or command prompt and then run the following

```
git clone https://github.com/UNDP-Data/{{projectName}}.git
cd {{projectName}}
npm install
```

## Local Development<a name="section-08"></a>
To start the project locally, you can run `npm run dev` in the project folder in terminal or command prompt.

This is run the app in development mode. Open [http://localhost:5173/](http://localhost:5173/) to view it in the browser.

The page will reload if you make edits. You will also see any lint errors in the console.

## Available Scripts<a name="section-09"></a>
* `npm run dev`: Executes `vite` and start the local server for local deployment.
* `npm run build`: Executes `tsc && vite build` and builds the app for production and deployment.

## Tooling Setup<a name="section-10"></a>
This project uses ESLint integrated with prettier, which verifies and formats your code so you don't have to do it manually. You should have your editor set up to display lint errors and automatically fix those which it is possible to fix. See [http://eslint.org/docs/user-guide/integrations](http://eslint.org/docs/user-guide/integrations).

This project is build in Visual Studio Code, therefore the project is already set up to work with. Install it from [here](https://code.visualstudio.com/) and then install this [eslint plugin](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and you should be good to go.

## Contact<a name="section-11"></a>
_Last editor Anton Stepanenkov - Lenseg1@gmail.com_
