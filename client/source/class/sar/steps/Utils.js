/* ************************************************************************

   Copyright:
     2023 IT'IS Foundation, https://itis.swiss

   License:
     MIT: https://opensource.org/licenses/MIT

   Authors:
     * Odei Maiz (odeimaiz)

************************************************************************ */

qx.Class.define("sar.steps.Utils", {
  type: "static",

  statics: {
    loadModelSection: function() {
      const loadModelLayout = new qx.ui.container.Composite(new qx.ui.layout.VBox(5));

      const loadModelButton = new qx.ui.form.Button("Load Model").set({
        allowGrowX: false
      });
      loadModelLayout.add(loadModelButton);

      const modelViewer = sar.steps.Utils.modelViewer(null, false);
      loadModelLayout.add(modelViewer);

      return loadModelLayout;
    },

    modelViewer: function(data, enabled = true) {
      const form = new qx.ui.form.Form();

      form.addGroupHeader("Model information")

      const systemName = new qx.ui.form.TextField().set({
        value: "cSAR3D",
        enabled
      });
      form.add(systemName, "System name", null, "systemName");

      const phantomType = new qx.ui.form.TextField().set({
        value: "Flat HSL",
        enabled
      });
      form.add(phantomType, "Phantom type", null, "phantomType");

      const hardwareVersion = new qx.ui.form.TextField().set({
        value: "SD C00 F01 AC",
        enabled
      });
      form.add(hardwareVersion, "Hardware version", null, "hardwareVersion");

      const softwareVersion = new qx.ui.form.TextField().set({
        value: "V5.2.0",
        enabled
      });
      form.add(softwareVersion, "Software version", null, "softwareVersion");

      const formRenderer = new qx.ui.form.renderer.Single(form);
      return formRenderer;
    },

    sarSelectBox: function() {
      const selectBox = new qx.ui.form.SelectBox();
      [{
        id: "sar1g",
        text: "SAR 1g",
      }, {
        id: "sar10g",
        text: "SAR 10g",
      }, {
        id: "both",
        text: "Both",
      }].forEach((sarEntry, idx) => {
        const listItem = new qx.ui.form.ListItem(sarEntry.text);
        listItem.id = sarEntry.id;
        selectBox.add(listItem);
        if (idx === 0) {
          selectBox.setSelection([listItem]);
        }
      });
      return selectBox;
    },

    addMeasAreaToForm: function(form) {
      form.addGroupHeader("Meas. area (mm)");
      const xMin = new qx.ui.form.Spinner().set({
        minimum: 120,
        maximum: 120,
        value: 120,
        enabled: false
      });
      form.add(xMin, "x", null, "measAreaX");
      const yMin = new qx.ui.form.Spinner().set({
        minimum: 240,
        maximum: 240,
        value: 240,
        enabled: false
      });
      form.add(yMin, "y", null, "measAreaY");
    },

    createTabPage: function(title, widget) {
      const layout = new qx.ui.layout.Canvas();
      const tabPage = new qx.ui.tabview.Page(title).set({
        layout
      });
      tabPage.add(widget, {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      });
      return tabPage;
    },

    createImageViewer: function(source) {
      const distributionImage = new qx.ui.basic.Image().set({
        maxWidth: 600,
        source,
        scale: true,
        alignX: "center"
      });
      return distributionImage;
    },

    csvToJson: function(csvString) {
      // https://www.geeksforgeeks.org/how-to-convert-csv-to-json-file-having-comma-separated-values-in-node-js/

      // const array = csv.toString().split("\r");
      const array = csvString.split("\r");
  
      // All the rows of the CSV will be
      // converted to JSON objects which
      // will be added to result in an array
      let result = [];
      
      // The array[0] contains all the
      // header columns so we store them
      // in headers array
      // let headers = array[0].split(", ")
      let headers = array[0].split(",");
      
      // Since headers are separated, we
      // need to traverse remaining n-1 rows.
      for (let i = 1; i < array.length - 1; i++) {
        let obj = {}

        // Create an empty object to later add
        // values of the current row to it
        // Declare string str as current array
        // value to change the delimiter and
        // store the generated string in a new
        // string s
        let str = array[i]
        let s = ''

        // By Default, we get the comma separated
        // values of a cell in quotes " " so we
        // use flag to keep track of quotes and
        // split the string accordingly
        // If we encounter opening quote (")
        // then we keep commas as it is otherwise
        // we replace them with pipe |
        // We keep adding the characters we
        // traverse to a String s
        let flag = 0
        for (let ch of str) {
            if (ch === '"' && flag === 0) {
                flag = 1
            }
            else if (ch === '"' && flag == 1) flag = 0
            if (ch === ', ' && flag === 0) ch = '|'
            if (ch !== '"') s += ch
        }

        // Split the string using pipe delimiter |
        // and store the values in a properties array
        let properties = s.split("|")

        // For each header, if the value contains
        // multiple comma separated data, then we
        // store it in the form of array otherwise
        // directly the value is stored
        for (let j in headers) {
            // if (properties[j].includes(", ")) {
            if (properties[j].includes(",")) {
                obj[headers[j]] = properties[j]
                    .split(", ").map(item => item.trim())
            }
            else obj[headers[j]] = properties[j]
        }

        // Add the generated object to our
        // result array
        result.push(obj)
      }
    }
  }
});
