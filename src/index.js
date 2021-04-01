import React from "react";
import diff from "./htmldiff";
import ReactDOM from "react-dom";
import { htmlOld, htmlNew } from "./mock-api";

import "./styles.css";

function Changes() {
  let fulldiff = diff(htmlOld, htmlNew);
  console.log("fulldiff: ", fulldiff);

  // create a new dov container
  let divOld = document.createElement("div");
  let divNew = document.createElement("div");
  // assing your HTML to div's innerHTML
  divOld.innerHTML = fulldiff;
  divNew.innerHTML = fulldiff;
  // get all <a> elements from div
  var divOldIns = divOld.getElementsByTagName("ins");
  var divNewDel = divNew.getElementsByTagName("del");

  // remove all <a> elements
  while (divOldIns[0]) divOldIns[0].parentNode.removeChild(divOldIns[0]);
  while (divNewDel[0]) divNewDel[0].parentNode.removeChild(divNewDel[0]);

  // get div's innerHTML into a new variable
  var htmlOldWithDelTag = divOld.innerHTML;
  var htmlNewWithInsTag = divNew.innerHTML;

  const oldImgsSrcs = htmlOld.match(/<img([\w\W]+?)\/>/g).map((img) => {
    const matches = img.match(/src\s*=\s*"(.+?)"/);
    if (!matches.length || matches.length < 2)
      throw new Error("Can't find src attribute in img tag");

    return matches[1];
  });

  htmlOldWithDelTag = htmlOldWithDelTag.replaceAll(
    /<img([\w\W]+?)>/g,
    (img) => {
      const matches = img.match(/src\s*=\s*"(.+?)"/);
      if (!matches.length || matches.length < 2)
        throw new Error("Can't find src attribute in img tag");
      const src = matches[1];

      // console.log("src:", src);

      if (oldImgsSrcs.includes(src)) return img;
      else return "";
    }
  );

  const newImgsSrcs = htmlNew.match(/<img([\w\W]+?)\/>/g).map((img) => {
    const matches = img.match(/src\s*=\s*"(.+?)"/);
    if (!matches.length || matches.length < 2)
      throw new Error("Can't find src attribute in img tag");

    return matches[1];
  });

  htmlNewWithInsTag = htmlNewWithInsTag.replaceAll(
    /<img([\w\W]+?)>/g,
    (img) => {
      const matches = img.match(/src\s*=\s*"(.+?)"/);
      if (!matches.length || matches.length < 2)
        throw new Error("Can't find src attribute in img tag");
      const src = matches[1];

      // console.log("src:", src);

      if (newImgsSrcs.includes(src)) return img;
      else return "";
    }
  );

  return (
    <div className="card">
      <div className="row">
        <div className="col">
          <h4>Past version</h4>
          <div className="card" id="outputOriginal">
            <div dangerouslySetInnerHTML={{ __html: htmlOldWithDelTag }} />
          </div>
        </div>
        <div className="col">
          <h4>New version</h4>
          <div className="card" id="outputNew">
            <div dangerouslySetInnerHTML={{ __html: htmlNewWithInsTag }} />
          </div>
        </div>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Changes />, rootElement);
