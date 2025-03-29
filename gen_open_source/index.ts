import pkg from "nlf";
import * as fs from "fs";
import { sub } from "date-fns";

try {
  const stat = fs.statSync("../assets/open_source_licenses.json");
  if (stat.isFile()) {
    if (stat.mtime > sub(new Date(), { days: 30 })) {
      console.log("skipping open source license generation");
      process.exit(0);
    }
    console.log("open_source_licenses.json is too old, regenerating");
  }
} catch (e: any) {
  if (e.code !== "ENOENT") {
    console.error("Error unable to read open_source_licenses.json", e);
  }
}

console.log("Reading licenses from package.json");

pkg.find({ directory: "../", reach: 1 }, function (err, data) {
  let licenses: { name: string; modules: string[] }[] = [];
  data.forEach((d) => {
    d?.licenseSources.package.sources.forEach((ls) => {
      let item = licenses.find((v) => v.name == ls.license);
      if (!item) {
        item = {
          name: ls.license,
          modules: [],
        };
        licenses.push(item);
      }
      item?.modules.push(d.name);
    });
  });

  fs.writeFile(
    "../assets/open_source_licenses.json",
    JSON.stringify(licenses, null, 1),
    { flag: "w" },
    function (err) {
      if (err) {
        return console.log(err);
      }
    },
  );
});
