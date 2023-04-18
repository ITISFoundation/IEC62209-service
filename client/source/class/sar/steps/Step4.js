/* ************************************************************************

   Copyright:
     2023 IT'IS Foundation, https://itis.swiss

   License:
     MIT: https://opensource.org/licenses/MIT

   Authors:
     * Odei Maiz (odeimaiz)

************************************************************************ */

qx.Class.define("sar.steps.Step4", {
  extend: sar.steps.StepBase,

  members: {
    // overriden
    _getDescriptionText: function() {
      return "\
        Explores the space of the valid model to find the most critical regions of the test space, such that:\
        <br>- the test cases are pulled toward the most extreme regions of the data pace,\
        <br>- the test cases exert a repulsive force on each other to ensure even coverage of the critical regions,\
        <br>- the test cases have meaningful coordinates.\
        <br><br>The resulting test conditions, with the computed z-values and associated probabilities to pass the mpe value are saved as a csv file.\
      "
    },

    _createOptions: function() {
      const optionsLayout = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));

      const loadModelButton = new qx.ui.form.Button("Load Model");
      optionsLayout.add(loadModelButton);

      const modelViewer = sar.steps.Utils.modelViewer(null, false);
      optionsLayout.add(modelViewer);

      const form = new qx.ui.form.Form();
      form.addGroupHeader("Explore space");
      const iteraions = new qx.ui.form.Spinner().set({
        minimum: 8,
        maximum: 8,
        value: 8,
        enabled: false
      });
      form.add(iteraions, "Iterations");
      const minFail = new qx.ui.form.Spinner().set({
        minimum: 0,
        maximum: 10,
        value: 5,
        enabled: false
      });
      form.add(minFail, "Min fail prob (%)");
      const formRenderer = new qx.ui.form.renderer.Single(form);
      optionsLayout.add(formRenderer);

      const searchButton = new qx.ui.form.Button("Search");
      searchButton.addListener("execute", () => console.log("search"));
      optionsLayout.add(searchButton);

      const exportButton = new qx.ui.form.Button("Export Tests").set({
        enabled: false
      });
      exportButton.addListener("execute", () => console.log("Export tests"));
      optionsLayout.add(exportButton);

      return optionsLayout;
    },

    __createDataTable: function() {
      const tableModel = new qx.ui.table.model.Simple();
      tableModel.setColumns([
        "ant",
        "Pf (dBm)",
        "modulation",
        "s (mm)",
        "0",
        "x (mm)",
        "y (mm)",
        "sard",
        "fail %",
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

    __createDistributionView: function() {
      const distributionImage = sar.steps.Utils.createImageViewer("sar/plots/step0_distribution.png")
      const tabPage = sar.steps.Utils.createTabPage("Distribution", distributionImage);
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
