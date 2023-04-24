/* ************************************************************************

   Copyright:
     2023 IT'IS Foundation, https://itis.swiss

   License:
     MIT: https://opensource.org/licenses/MIT

   Authors:
     * Odei Maiz (odeimaiz)

************************************************************************ */

qx.Class.define("sar.steps.LoadTestData", {
  extend: sar.steps.StepBase,

  properties: {
    testData: {
      check: "Object",
      init: null,
      nullable: true,
      apply: "__applyTestData"
    }
  },

  events: {
    "testDataSet": "qx.event.type.Data"
  },

  members: {
    __input: null,
    __loadTestDataButton: null,
    __modelViewer: null,

    // overriden
    _getDescriptionText: function() {
      return "Load Test data"
    },

    _createOptions: function() {
      const optionsLayout = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));

      const fileInput = this.__fileInput = new sar.widget.FileInput("Load Test data...", ["csv"]);
      fileInput.addListener("selectionChanged", () => {
        const file = fileInput.getFile();
        if (file) {
          this.__submitFile(file);
        }
      });
      optionsLayout.add(fileInput);

      const resetBtn = this.__resetBtn = new qx.ui.form.Button("Reset Test data").set({
        allowGrowX: false
      });
      resetBtn.addListener("execute", () => this.setTestData(null));
      optionsLayout.add(resetBtn);

      const modelViewer = this.__modelViewer = sar.steps.Utils.modelViewer(null);
      optionsLayout.add(modelViewer);

      return optionsLayout;
    },

    _createResults: function() {
      const resultsLayout = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));

      const resultsTabView = new qx.ui.tabview.TabView().set({
        contentPadding: 10
      });
      resultsLayout.add(resultsTabView);

      const dataView = this.__createDataView();
      resultsTabView.add(dataView);

      return resultsLayout;
    },

    _applyModel: function(model) {
      if (model) {
        this.__fileInput.exclude();
        this.__resetBtn.show();
      } else {
        this.__fileInput.show();
        this.__resetBtn.exclude();
      }

      this._optionsLayout.remove(this.__modelViewer);
      const modelViewer = this.__modelViewer = sar.steps.Utils.modelViewer(model);
      this._optionsLayout.add(modelViewer);
      this.fireDataEvent("testDataSet", model);
    },

    __submitFile: function(file) {
      const fileName = file.name;
      console.log("submitFile", fileName);
      
      const body = new FormData();
      body.append("fileName", fileName);

      const req = new XMLHttpRequest();
      req.upload.addEventListener("progress", ep => {
        // updateProgress
        if (ep.lengthComputable) {
          const percentComplete = ep.loaded / ep.total * 100;
          console.log("percentComplete", percentComplete);
        } else {
          console.log("Unable to compute progress information since the total size is unknown");
        }
      }, false);
      req.addEventListener("load", e => {
        // transferComplete
        if (req.status == 200) {
          console.log("transferComplete");
        } else if (req.status == 400) {
          console.error("transferFailed");
        }
      });
      req.addEventListener("error", e => console.error(e));
      req.addEventListener("abort", e => console.error(e));
      req.open("POST", "/load-model", true);
      req.send(body);
    },

    __createDataView: function() {
      const dataTable = this.__dataTable = sar.steps.Utils.trainingDataTable();
      const layout = new qx.ui.layout.VBox();
      const tabPage = new qx.ui.tabview.Page("Data").set({
        layout
      });
      tabPage.add(dataTable);
      return tabPage;
    }
  }
});
