const klaw = require('klaw');
const fs = require("fs");
const path = require("path");

module.exports = (folder, options) => {
    return new Promise((resolve, reject) => {
        if (!folder) {
            return reject("There was no input folder specified");
        };

        //Set the options if they don't exist
        options = options ? options : {};

        options = verifyOptions(options);

        console.log(options);

        const output = {};

        output.modules = [];

        //Run through the directory
        klaw(path.resolve(folder)).on("data", async c => {
            //Make sure the file is a type we want to check
            if (!verifyFileType(c.path, options.fileTypes)) {
                return;
            };

            //Get the full name of the file, with the extension
            const fullName = c.path.split("\\").pop();

            const cmdObj = {
                "name": fullName.split(".js")[0],
                "fullName": fullName,
                "filePath": c.path,
                "requirements": []
            };

            //Get each line of the file
            const content = fs.readFileSync(c.path).toString().split(/(\n|\r)/g);

            for await (const line of content) {
                //Check if the line is a require statement
                if (RegExp(/(= |=)(require\(['"])(.*?)(?=['"]\))/g).test(line)) {
                    //Get the name of the requirement
                    const req = line
                        .split(/(\("|\(')/g)
                        .pop()
                        .split(/("\)|'\))/g)[0];

                    //Check if it's a local import, and ignore if necessary
                    if (RegExp(/\.\.\/|\.\//g).test(req)) {
                        if (options.allowLocalReqs === true) {
                            if (filter(req, options.filters)) {
                                cmdObj.requirements.push(req);
                            };
                        } else {
                            continue;
                        };
                    } else {
                        if (filter(req, options.filters)) {
                            console.log(filter(req, options.filters), " - ", req, " - ", fullName);

                            cmdObj.requirements.push(req);
                        };
                    };
                };
            };

            if (cmdObj.requirements.length) {
                output.modules.push(cmdObj);
            };
        }).on('end', () => {
            if (options.outputToFile) {
                const outputPath = path.resolve(options.outputLocation + "/requirements.json");

                fs.writeFileSync(outputPath, JSON.stringify(output));

                return resolve({
                    path: outputPath,
                    totalFiles: output.modules.length,
                    results: output.modules
                });
            } else {
                return resolve(output.modules);
            };
        });
    });
};

function verifyOptions(options) {
    const finalObj = {};

    finalObj.outputToFile = options.outputToFile ? options.outputToFile : true;

    finalObj.outputLocation = options.outputLocation ? path.resolve(options.outputLocation) : path.resolve("./");

    finalObj.filters = options.filters ? options.filters : null;

    finalObj.allowLocalReqs = options.allowLocalReqs ? options.allowLocalReqs : false;

    finalObj.fileTypes = options.fileTypes ? options.fileTypes : ["js"];

    return finalObj;
};

function verifyFileType(input, types) {
    var valid = false;

    for (const type of types) {
        if (input.endsWith(type)) {
            valid = true;
        };
    };

    return valid;
};

function filter(input, filters) {
    var valid = true;

    if (filters) {
        for (const filter of filters) {
            //Check the item against our list of disallowed filters
            if (RegExp(filter).test(input)) {
                valid = false;
            };
        };
    };

    return valid;
};