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

      const formRenderer = sar.steps.Utils.modelViewer(null, true);
      optionsLayout.add(formRenderer);

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

      const loadButton = new qx.ui.form.Button("Load Training Data");
      loadButton.addListener("execute", () => {
        loadButton.setEnabled(false);
        const form = formRenderer._form;
        const data = {};
        for (const [key, item] of Object.entries(form.getItems())) {
          data[key] = item.getValue()
        }
        const params = {
          data
        };
        sar.io.Resources.fetch("analysisCreation", "load", params)
          .then(data => console.log(data))
          .catch(err => console.error(err))
          .finally(() => loadButton.setEnabled(true));
      });
      stepLayout.add(loadButton, {
        row: 0,
        column: 0
      });

      const sarSelectBox = sar.steps.Utils.sarSelectBox(null, false);
      stepLayout.add(sarSelectBox, {
        row: 1,
        column: 0
      });

      const sarSelected = new qx.ui.basic.Label().set({
        alignY: "middle",
        rich: true,
        wrap: true,
        selectable: true
      });
      sarSelectBox.addListener("changeSelection", e => {
        const listItem = e.getData()[0];
        sarSelected.setValue(listItem.getLabel())
      }, this);
      stepLayout.add(sarSelected, {
        row: 1,
        column: 1
      });

      const createButton = new qx.ui.form.Button("Create & Analyze").set({
        allowGrowY: false
      });
      createButton.addListener("execute", () => {
        createButton.setEnabled(false);
        const data = {
          "sarOption": sarSelectBox.getSelection()[0].id
        };
        const params = {
          data
        };
        sar.io.Resources.fetch("analysisCreation", "create", params)
          .then(trainingData => this.__populateResults(trainingData))
          .catch(err => console.error(err))
          .finally(() => createButton.setEnabled(true));
      });
      stepLayout.add(createButton, {
        row: 2,
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
        value: "Normalized rms error 10.% < 25%:"
      });
      resultsLayout.add(normalityTitle, {
        row: 1,
        column: 0
      });
      stepLayout.add(resultsLayout, {
        row: 2,
        column: 1
      });

      const exportButton = new qx.ui.form.Button("Export Model");
      stepLayout.add(exportButton, {
        row: 3,
        column: 0,
        colSpan: 2
      });

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

      const variogramView = this.__createVariogramView()
      resultsTabView.add(variogramView);

      const deviationsView = this.__createDeviationsView()
      resultsTabView.add(deviationsView);

      const marginalsView = this.__createMarginalsView()
      resultsTabView.add(marginalsView);

      return resultsLayout;
    }
  }
});
