#!/usr/bin/env ts-node-script

/* eslint-disable no-console */
import fs from "fs";
import plantuml from "node-plantuml";
import path from "path";

/**
 * Generate Graphics from PlantUml Diagrams.
 */
const generateDiagrams = () => {
  console.log("Start generating diagrams");

  const inputDir = fs.opendirSync("./doc/diagrams/src");
  const outputDir = "./doc/diagrams/out";

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  let dirent: fs.Dirent;
  while ((dirent = inputDir.readSync()) !== null) {
    if (!dirent.isFile && !dirent.name.endsWith("wsd")) continue;

    const inputFile = path.join(inputDir.path, dirent.name);
    const outputFile = path.join(outputDir, dirent.name + ".svg");

    console.log("Generate diagram from " + inputFile + " to " + outputFile);

    const gen = plantuml.generate(inputFile, { format: "svg" });
    gen.out.pipe(fs.createWriteStream(outputFile));
  }
  inputDir.closeSync();
};

generateDiagrams();
