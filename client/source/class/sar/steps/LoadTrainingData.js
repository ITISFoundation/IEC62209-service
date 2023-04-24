/* ************************************************************************

   Copyright:
     2023 IT'IS Foundation, https://itis.swiss

   License:
     MIT: https://opensource.org/licenses/MIT

   Authors:
     * Odei Maiz (odeimaiz)

************************************************************************ */

qx.Class.define("sar.steps.LoadTrainingData", {
  extend: sar.steps.StepBase,

  events: {
    "dataSet": "qx.event.type.Data"
  },

  members: {
    __input: null,
    __loadModelButton: null,
    __dataViewer: null,

    // overriden
    _getDescriptionText: function() {
      return "Load the training data";
    },

    _createOptions: function() {
      const optionsLayout = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));

      const fileInput = this.__fileInput = new sar.widget.FileInput("Load Training data...", ["csv"]);
      fileInput.addListener("selectionChanged", () => {
        const file = fileInput.getFile();
        if (file) {
          this.__submitFile(file);
        }
      });
      optionsLayout.add(fileInput);

      const resetBtn = this.__resetBtn = new qx.ui.form.Button("Reset Model").set({
        allowGrowX: false
      });
      resetBtn.addListener("execute", () => this.setModel(null));
      optionsLayout.add(resetBtn);

      const dataViewer = this.__dataViewer = sar.steps.Utils.modelViewer(null);
      optionsLayout.add(dataViewer);

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

    __createDataView: function() {
      const dataTable = this.__dataTable = sar.steps.Utils.trainingDataTable();
      const layout = new qx.ui.layout.VBox();
      const tabPage = new qx.ui.tabview.Page("Data").set({
        layout
      });
      tabPage.add(dataTable);
      return tabPage;
    },

    __submitFile: function(file) {
      const successCallback = resp => {
        console.log(resp);
      };
      sar.steps.Utils.postFile(file, "/load-training-data", successCallback);
    },

    _applyModel: function(model) {
      if (model) {
        this.__fileInput.exclude();
        this.__resetBtn.show();
      } else {
        this.__fileInput.show();
        this.__resetBtn.exclude();
      }

      this._optionsLayout.remove(this.__dataViewer);
      const modelViewer = this.__dataViewer = sar.steps.Utils.modelViewer(model);
      this._optionsLayout.add(modelViewer);
      this.fireDataEvent("dataSet", model);
    }
  }
});
