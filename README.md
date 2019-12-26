<p align="center">
    <img src="./public/logo.svg" alt="logo" width="72" height="72">
</p>

<h3 align="center">Transcribe</h3>

<p align="center">
 A Web App for Transcribing Songs<br>Load mp3, transcribe song, get the score.
</p>

## Table of contents

- [Quick start](#quick-start)
- [Status](#status)
- [Documentation](#documentation)
- [Versioning](#versioning)
- [Copyright and license](#copyright-and-license)

## Quick start

Run the demo app in your Browser: [Transcribe Demo App](https://tscz.github.com/transcribe).

Read the [Documentation](#documentation) for developing and building infos.

## Status

[![](https://github.com/tscz/transcribe/workflows/Build%20application/badge.svg)](https://github.com/tscz/transcribe/actions?query=workflow%3A%22Build+application%22)
[![Coverage Status](https://coveralls.io/repos/github/tscz/transcribe/badge.svg?branch=master)](https://coveralls.io/github/tscz/transcribe?branch=master)
[![Coverage Status](https://david-dm.org/tscz/transcribe.svg)](https://david-dm.org/tscz/transcribe)

[![](https://github.com/tscz/transcribe/workflows/Deploy%20release/badge.svg)](https://github.com/tscz/transcribe/releases/latest)
[![](https://github.com/tscz/transcribe/workflows/Deploy%20storybook/badge.svg)](https://transcribe-storybook.herokuapp.com)

## Usage

## Developer Documentation
### Project Structure
```text
transcribe/
└── .github/ (Github Action config)
└── .storybook/ (Storybook config)
└── .vscode/ (Visual Studio Code config)
└── public/ (Static app content)
└── src/
    ├── api/ (External interfaces)
    ├── components/ (React components)
    ├── pages/ (Application pages)
    ├── states/ (Application state definition based on Redux)
    ├── styles/ (CSS and theme definitions)
    ├── views/ (Application views)
    ├── index.tsx (Main Application Entry Point)
└── package.json (Build and script config)
└── tsconfig.json (Typescript compiler config)

```
### Component documentation
See [Storybook](https://transcribe-storybook.herokuapp.com) for Component Documentation.

## Versioning
| Version | Info
| --- | --- 
| 0.1 | First running version (see https://github.com/tscz/transcribe/projects/1)

## Copyright and license
<div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
