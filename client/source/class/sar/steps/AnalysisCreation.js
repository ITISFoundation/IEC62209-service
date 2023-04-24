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

  members: {
    __createButton: null,
    __exportButton: null,
    __variogramImage: null,
    __deviationsImage: null,
    __marginalsImage: null,

    // overriden
    _getDescriptionText: function() {
      return "\
        Builds a model and outputs the empirical (blue) and theoretical (red) semi-variogram after rescaling to an isotropic space.\
        <br>The system analyses geostatistical properties along each direction in the data space, computes an invertible mapping that converts the space to an isotropic one.\
        <br>The tests evaluate whether:\
        <br>- the acceptance criteria are met for each measurement,\
        <br>- the normalized mean squared error (nrsme) is within 0.25 to ensure that the variogram model fits the empirical variances\
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
      const createButton = this.__createButton = new qx.ui.form.Button("Create & Analyze").set({
        allowGrowY: false
      });
      createButton.addListener("execute", () => {
        createButton.setEnabled(false);
        sar.io.Resources.fetch("analysisCreation", "create")
          .then(() => this.__trainingDataCreated())
          .catch(err => {
            this.__trainingDataCreated();
            console.error(err);
          })
          .finally(() => createButton.setEnabled(true));
      });
      stepLayout.add(createButton, {
        row,
        column: 0
      });

      const resultsGrid = new qx.ui.layout.Grid(10, 10);
      const resultsLayout = new qx.ui.container.Composite(resultsGrid).set({
        allowGrowX: false
      });
      const acceptanceTitle = new qx.ui.basic.Label().set({
        value: "Acceptance criteria:"
      });
      resultsLayout.add(acceptanceTitle, {
        row: 0,
        column: 0
      });
      const normalityTitle = new qx.ui.basic.Label().set({
        value: "Normalized rms error 10.2% < 25%:"
      });
      resultsLayout.add(normalityTitle, {
        row: 1,
        column: 0
      });
      stepLayout.add(resultsLayout, {
        row,
        column: 1
      });
      row++;

      const modelEditor = sar.steps.Utils.modelEditor();
      stepLayout.add(modelEditor, {
        row,
        column: 0,
        colSpan: 2
      });
      row++;

      const exportButton = this.__exportButton = new qx.ui.form.Button("Export Model").set({
        enabled: false
      });
      exportButton.addListener("execute", () => {
        sar.io.Resources.fetch("analysisCreation", "xport")
          .then(data => this.__modelExported(data))
          .catch(err => console.error(err))
          .finally(() => createButton.setEnabled(true));
      });
      stepLayout.add(exportButton, {
        row,
        column: 0,
        colSpan: 2
      });
      row++;

      return optionsLayout;
    },

    __createVariogramView: function() {
      const variogramImage = sar.steps.Utils.createImageViewer("sar/plots/step1_variogram.png")
      const tabPage = sar.steps.Utils.createTabPage("Variogram", variogramImage);
      return tabPage;
    },

    __createDeviationsView: function() {
      const deviationsImage = sar.steps.Utils.createImageViewer("sar/plots/step1_deviations.png")
      const tabPage = sar.steps.Utils.createTabPage("Deviations", deviationsImage);
      return tabPage;
    },

    __createMarginalsView: function() {
      const marginalsImage = sar.steps.Utils.createImageViewer("sar/plots/step1_marginals.png")
      const tabPage = sar.steps.Utils.createTabPage("Marginals", marginalsImage);
      return tabPage;
    },

    _createResults: function() {
      const resultsLayout = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));

      const resultsTabView = new qx.ui.tabview.TabView().set({
        contentPadding: 10
      });
      resultsLayout.add(resultsTabView);

      const variogramView = this.__variogramImage = this.__createVariogramView()
      resultsTabView.add(variogramView);

      const deviationsView = this.__deviationsImage = this.__createDeviationsView()
      resultsTabView.add(deviationsView);

      const marginalsView = this.__marginalsImage = this.__createMarginalsView()
      resultsTabView.add(marginalsView);

      return resultsLayout;
    },

    __trainingDataCreated: function() {
      this.__exportButton.setEnabled(true);
      this.__fetchResults();
    },

    __fetchResults: function() {
      console.log("fetch images");
      /*
      sar.io.Resources.fetch("trainingSetGeneration", "getData")
        .then(data => this.__popoluateTable(data))
        .catch(err => console.error(err));

      sar.io.Resources.fetch("trainingSetGeneration", "getDistribution")
        .then(data => this.__populateDistributionImage(data))
        .catch(err => console.error(err));
    },
      */
    },

    __modelExported: function(data) {
      sar.steps.Utils.downloadJson(data, "Model.json");
    }
  }
});
