/* ************************************************************************

   Copyright:
     2023 IT'IS Foundation, https://itis.swiss

   License:
     MIT: https://opensource.org/licenses/MIT

   Authors:
     * Odei Maiz (odeimaiz)

************************************************************************ */

qx.Class.define("sar.steps.Step0", {
  extend: sar.steps.StepBase,

  members: {
    // overriden
    _getDescriptionText: function() {
      return "\
        Generates a random latin hypercube sample with 8 dimensions and saves the results to a .csv file. The 8 test variables are:\
        frequency, output power, peak to average power ratio (PAPR), bandwidth (BW), distance (mm), angle (deg), x (mm), and y (mm).\
        When performing the SAR measurements, fill in the SAR (SAR1g and/or SAR10g), and uncertainty (U1g and/or U10g) values. The uncertainty values should be reported with a 95% confidence level (k = 2 standard deviations).\
      "
    },

    _createOptions: function() {
      const optionsLayout = new qx.ui.container.Composite(new qx.ui.layout.VBox(20));

      const form = new qx.ui.form.Form();
      form.addGroupHeader("Frequency range (MHz)");
      const fRangeMin = new qx.ui.form.Spinner().set({
        minimum: 300,
        maximum: 300,
        value: 300,
        enabled: false
      });
      form.add(fRangeMin, "Min");
      const fRangeMax = new qx.ui.form.Spinner().set({
        minimum: 6000,
        maximum: 6000,
        value: 6000,
        enabled: false
      });
      form.add(fRangeMax, "Max");
      form.addGroupHeader("Meas. area (mm)");
      const xMin = new qx.ui.form.Spinner().set({
        minimum: 120,
        maximum: 120,
        value: 120,
        enabled: false
      });
      form.add(xMin, "x");
      const yMin = new qx.ui.form.Spinner().set({
        minimum: 240,
        maximum: 240,
        value: 240,
        enabled: false
      });
      form.add(yMin, "y");
      const sampleSize = new qx.ui.form.Spinner().set({
        minimum: 50,
        maximum: 50,
        value: 50,
        enabled: false
      });
      form.add(sampleSize, "Sample size");
      const formRenderer = new qx.ui.form.renderer.Single(form);
      optionsLayout.add(formRenderer);

      const createButton = new qx.ui.form.Button("Create");
      createButton.addListener("execute", () => console.log("Create training data"));
      optionsLayout.add(createButton);

      const exportButton = new qx.ui.form.Button("Export").set({
        enabled: false
      });
      exportButton.addListener("execute", () => console.log("Export training data"));
      optionsLayout.add(exportButton);

      return optionsLayout;
    },

    __createDataTable: function() {
      const tableModel = new qx.ui.table.model.Simple();
      tableModel.setColumns([
        "no.",
        "antenna",
        "freq. (MHz)",
        "Pin (dBm)",
        "mod.",
        "PAPR (db)",
        "BW (MHz)",
        "d (mm)",
        "O (*)",
        "x (mm)",
        "y (mm)",
        "SAR 1g (W/Kg)",
        "SAR 10g (W/Kg)",
        "U 1g (dB)",
        "U 10g (dB)",
      ]);
      const custom = {
        tableColumnModel: function(obj) {
          return new qx.ui.table.columnmodel.Resize(obj);
        }
      };
      const table = new qx.ui.table.Table(tableModel, custom).set({
        selectable: true,
        statusBarVisible: false,
        showCellFocusIndicator: false,
        forceLineHeight: false
      });
      table.getTableColumnModel().setDataCellRenderer(0, new qx.ui.table.cellrenderer.Number());
      table.getTableColumnModel().setDataCellRenderer(1, new qx.ui.table.cellrenderer.String());
      table.getTableColumnModel().setDataCellRenderer(2, new qx.ui.table.cellrenderer.Number());
      table.setColumnWidth(0, 20);
      return table;
    },

    __createDataView: function() {
      const dataTable = this.__createDataTable();
      const layout = new qx.ui.layout.VBox();
      const tabPage = new qx.ui.tabview.Page("Data").set({
        layout
      });
      tabPage.add(dataTable);
      return tabPage;
    },

    __createDistribitionImage: function() {
      const distributionImage = new qx.ui.basic.Image().set({
        source: "sar/plots/step0_distribution.png",
        scale: true,
        alignX: "center"
      });
      return distributionImage;
    },

    __createDistributionView: function() {
      const distributionImage = this.__createDistribitionImage();
      const layout = new qx.ui.layout.Canvas();
      const tabPage = new qx.ui.tabview.Page("Distribution").set({
        layout
      });
      tabPage.add(distributionImage, {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      });
      return tabPage;
    },

    _createResults: function() {
      const resultsLayout = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));

      const resultsTabView = new qx.ui.tabview.TabView().set({
        contentPadding: 10
      });
      resultsLayout.add(resultsTabView);

      const dataView = this.__createDataView()
      resultsTabView.add(dataView);

      const distributionView = this.__createDistributionView()
      resultsTabView.add(distributionView);

      return resultsLayout;
    }
  }
});
