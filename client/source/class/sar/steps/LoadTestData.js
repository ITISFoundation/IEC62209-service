/* ************************************************************************

   Copyright:
     2023 IT'IS Foundation, https://itis.swiss

   License:
     MIT: https://opensource.org/licenses/MIT

   Authors:
     * Odei Maiz (odeimaiz)

************************************************************************ */

qx.Class.define("sar.steps.LoadTestData", {
  extend: sar.steps.LoadData,

  events: {
    "testDataSet": "qx.event.type.Data"
  },

  members: {
    __modelViewer: null,

    // overriden
    _getDescriptionText: function() {
      return "Load Test data"
    },

    _createOptions: function() {
      const optionsLayout = this.base(arguments);

      const modelViewer = this.__modelViewer = sar.steps.Utils.modelViewer(null, true);
      optionsLayout.add(modelViewer);

      return optionsLayout;
    },

    // overriden
    _getFileInput: function() {
      const fileInput = this._fileInput = new sar.widget.FileInput("Load Test data...", ["csv"]);
      fileInput.addListener("selectionChanged", () => {
        const file = fileInput.getFile();
        if (file) {
          this.__submitFile(file);
        }
      });
      return fileInput;
    },

    // overriden
    _applyModel: function(modelMetadata) {
      if (this.__modelViewer) {
        this._optionsLayout.remove(this.__modelViewer);
      }
      const modelViewer = this.__modelViewer = sar.steps.Utils.modelViewer(modelMetadata, true);
      this._optionsLayout.add(modelViewer);
    },

    __submitFile: function(file) {
      const endpoints = sar.io.Resources.getEndPoints("testData");
      const successCallback = resp => this.setStepData(resp);
      sar.steps.Utils.postFile(file, endpoints["load"].url, successCallback, null, this);
    },

    // overriden
    _resetPressed: function() {
      this.base(arguments);
      sar.io.Resources.fetch("testData", "resetData");
    },

    // overriden
    _applyStepData: function(testData) {
      this.base(arguments, testData);

      this.fireDataEvent("testDataSet", testData);
    },
  }
});
