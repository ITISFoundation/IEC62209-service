/* ************************************************************************

   Copyright:
     2023 IT'IS Foundation, https://itis.swiss

   License:
     MIT: https://opensource.org/licenses/MIT

   Authors:
     * Odei Maiz (odeimaiz)

************************************************************************ */

qx.Class.define("sar.steps.AnalysisCreation", {
  extend: sar.steps.StepBase,

  construct: function() {
    this.__valueLabels = [];
    this.__images = [];

    this.base(arguments);
  },

  members: {
    __valueLabels: null,
    __xArea: null,
    __yArea: null,
    __images: null,
    __exportButton: null,
    __reportButton: null,
    __semivariogramImage: null,
    __marginalsImage: null,
    __deviationsImage: null,

    // overriden
    _getDescriptionText: function() {
      return "\
        Press 'Create & Analyze' to create a GPI model from the training data that was loaded in the previous step.\
        This evaluates the Pass / Fail results for the acceptance criteria (whether all measurements are within the mpe, as shown in the Deviations plot), \
        and the normalized RMS error of the model (from the Semi-variogram plot), and it creates the Marginals plot as useful information to show how the errors vary with the eight dimensions.\
      "
    },

    _createOptions: function() {
      const optionsLayout = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));

      const stepGrid = new qx.ui.layout.Grid(20, 20);
      stepGrid.setColumnFlex(0, 1);
      stepGrid.setColumnFlex(1, 1);
      stepGrid.setRowFlex(0, 0);
      stepGrid.setRowFlex(1, 1);
      stepGrid.setColumnMinWidth(0, 200);
      const stepLayout = new qx.ui.container.Composite(stepGrid).set({
        allowGrowX: false
      });
      optionsLayout.add(stepLayout);

      let row = 0;
      const createButton = new sar.widget.FetchButton("Create & Analyze").set({
        alignY: "middle",
        allowGrowY: false
      });
      stepLayout.add(createButton, {
        row,
        column: 0
      });

      const resultsGrid = new qx.ui.layout.Grid(10, 10);
      const resultsLayout = new qx.ui.container.Composite(resultsGrid).set({
        allowGrowX: false
      });
      // titles
      const acceptanceTitle = new qx.ui.basic.Label().set({
        value: "Acceptance criteria:",
        alignX: "right",
        alignY: "middle",
        textAlign: "right",
      });
      resultsLayout.add(acceptanceTitle, {
        row: 0,
        column: 0
      });
      const rmsErrorTitle = new qx.ui.basic.Label().set({
        value: "Norm. RMS error:",
        alignX: "right",
        alignY: "middle",
        textAlign: "right",
      });
      resultsLayout.add(rmsErrorTitle, {
        row: 1,
        column: 0
      });
      // values
      const acceptanceValue = new qx.ui.basic.Label();
      this.__valueLabels.push(acceptanceValue);
      sar.steps.Utils.decoratePassFailLabel(acceptanceValue);
      resultsLayout.add(acceptanceValue, {
        row: 0,
        column: 1
      });
      const rmsErrorValue = new qx.ui.basic.Label();
      this.__valueLabels.push(rmsErrorValue);
      sar.steps.Utils.decoratePassFailLabel(rmsErrorValue);
      resultsLayout.add(rmsErrorValue, {
        row: 1,
        column: 1
      });
      stepLayout.add(resultsLayout, {
        row,
        column: 1
      });
      createButton.addListener("execute", () => {
        createButton.setFetching(true);
        this.__resetValueLabels();
        sar.io.Resources.fetch("analysisCreation", "create")
          .then(data => {
            if ("Acceptance criteria" in data) {
              acceptanceValue.setValue(data["Acceptance criteria"]);
            }
            if ("Normalized RMS error" in data) {
              rmsErrorValue.setValue(data["Normalized RMS error"]);
            }
            this.__trainingDataAnalyzed();
          })
          .catch(err => console.error(err))
          .finally(() => createButton.setFetching(false));
      });
      row++;

      const modelEditor = sar.steps.Utils.modelEditor();
      stepLayout.add(modelEditor, {
        row,
        column: 0,
        colSpan: 2
      });
      this.__xArea = modelEditor._form.getItem("measAreaX");
      this.__yArea = modelEditor._form.getItem("measAreaY");
      row++;

      const exportButton = this.__exportButton = new sar.widget.FetchButton("Export Model").set({
        enabled: false
      });
      exportButton.addListener("execute", () => {
        exportButton.setFetching(true);
        const data = {};
        for (const [key, item] of Object.entries(modelEditor._form.getItems())) {
          data[key] = item.getValue()
        }
        data["acceptanceCriteria"] = acceptanceValue.getValue();
        data["normalizedRMSError"] = rmsErrorValue.getValue();
        const params = {
          data
        };
        sar.io.Resources.fetch("analysisCreation", "xport", params)
          .then(data => this.__modelExported(data))
          .catch(err => console.error(err))
          .finally(() => exportButton.setFetching(false));
      });
      stepLayout.add(exportButton, {
        row,
        column: 0,
        colSpan: 2
      });
      row++;

      const reportButton = this.__reportButton = sar.steps.Utils.createGenerateReportButton("analysisCreation", "ModelCreationReport.pdf");
      stepLayout.add(reportButton, {
        row,
        column: 0,
        colSpan: 2
      });
      // disable 'Generate Report' button any time the user changes something in the Model information
      Object.values(modelEditor._form.getItems()).forEach(field => {
        field.addListener("changeValue", () => reportButton.setEnabled(false));
      });
      row++;

      return optionsLayout;
    },

    __createSemivariogramView: function() {
      const semivariogramImage = this.__semivariogramImage = sar.steps.Utils.createImageViewer();
      this.__images.push(semivariogramImage);
      const tabPage = sar.steps.Utils.createTabPage("Semi-variogram", semivariogramImage);
      return tabPage;
    },

    __createMarginalsView: function() {
      const marginalsImage = this.__marginalsImage = sar.steps.Utils.createImageViewer();
      this.__images.push(marginalsImage);
      const tabPage = sar.steps.Utils.createTabPage("Marginals", marginalsImage);
      return tabPage;
    },

    __createDeviationsView: function() {
      const deviationsImage = this.__deviationsImage = sar.steps.Utils.createImageViewer();
      this.__images.push(deviationsImage);
      const tabPage = sar.steps.Utils.createTabPage("Deviations", deviationsImage);
      return tabPage;
    },

    _createResults: function() {
      const resultsLayout = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));

      const resultsTabView = new qx.ui.tabview.TabView().set({
        contentPadding: 10
      });
      resultsLayout.add(resultsTabView);

      const semivariogramView = this.__createSemivariogramView()
      resultsTabView.add(semivariogramView);

      const marginalsView = this.__createMarginalsView()
      resultsTabView.add(marginalsView);

      const deviationsView = this.__createDeviationsView()
      resultsTabView.add(deviationsView);

      return resultsLayout;
    },

    __trainingDataAnalyzed: function() {
      sar.io.Resources.fetch("analysisCreation", "getModelConstraints")
        .then(data => {
          if ("xmin" in data) {
            this.__xArea.setMinimum(parseInt(data["xmin"]));
          }
          if ("xmax" in data) {
            this.__xArea.setMaximum(parseInt(data["xmax"]));
          }
          if ("ymin" in data) {
            this.__yArea.setMinimum(parseInt(data["ymin"]));
          }
          if ("ymax" in data) {
            this.__yArea.setMaximum(parseInt(data["ymax"]));
          }
          this.__exportButton.setEnabled(true);
        })
        .catch(err => console.error(err));

      this.__fetchResults();
    },

    __fetchResults: function() {
      this.__populateSemivariogramImage();
      this.__populateMarginalsImage();
      this.__populateDeviationsImage();
    },

    __populateSemivariogramImage: function() {
      const endpoints = sar.io.Resources.getEndPoints("analysisCreation");
      this.__semivariogramImage.setSource(endpoints["getSemivariogram"].url);
    },

    __populateMarginalsImage: function() {
      const endpoints = sar.io.Resources.getEndPoints("analysisCreation");
      this.__marginalsImage.setSource(endpoints["getMarginals"].url);
    },

    __populateDeviationsImage: function() {
      const endpoints = sar.io.Resources.getEndPoints("analysisCreation");
      this.__deviationsImage.setSource(endpoints["getDeviations"].url);
    },

    __modelExported: function(data) {
      const filename = ("metadata" in data && "filename" in data["metadata"]) ? data["metadata"]["filename"] : "Model.json";
      sar.steps.Utils.downloadJson(data, filename);

      this.__reportButton.setEnabled(true);
    },

    __resetValueLabels: function() {
      this.__valueLabels.forEach(valueLabel => valueLabel.resetValue());
    },

    __resetImages: function() {
      this.__images.forEach(image => image.resetSource());
    },

    resetResults: function() {
      this.__resetValueLabels();
      this.__resetImages();
      this.__reportButton.setEnabled(false);
    },
  }
});
