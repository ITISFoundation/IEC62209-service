/* ************************************************************************

   Copyright:
     2023 IT'IS Foundation, https://itis.swiss

   License:
     MIT: https://opensource.org/licenses/MIT

   Authors:
     * Odei Maiz (odeimaiz)

************************************************************************ */

qx.Class.define("sar.steps.Step1", {
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
      const optionsLayout = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
      
      const form1 = new qx.ui.form.Form();

      const systemName = new qx.ui.form.TextField();
      form1.add(systemName, "System name");

      const phantomType = new qx.ui.form.TextField();
      form1.add(phantomType, "Phantom type");

      const hardwareVersion = new qx.ui.form.TextField();
      form1.add(hardwareVersion, "Hardware version");

      const softwareVersion = new qx.ui.form.TextField();
      form1.add(softwareVersion, "Software version");

      const formRenderer1 = new qx.ui.form.renderer.Single(form1);
      optionsLayout.add(formRenderer1);


      const form2 = new qx.ui.form.Form();

      const fRangeMin = new qx.ui.form.TextField();
      form2.add(fRangeMin, "Frequency range (MHz). Min");

      const fRangeMax = new qx.ui.form.TextField();
      form2.add(fRangeMax, "Frequency range (MHz). Max");

      const formRenderer2 = new qx.ui.form.renderer.Single(form2);
      optionsLayout.add(formRenderer2);

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

    _createResults: function() {
      const resultsLayout = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));

      const resultsTabView = new qx.ui.tabview.TabView().set({
        contentPadding: 10
      });
      resultsLayout.add(resultsTabView);

      const dataTable = this.__createDataTable();
      const layout = new qx.ui.layout.VBox();
      const tabPage = new qx.ui.tabview.Page("Data").set({
        layout
      });
      tabPage.add(dataTable)
      resultsTabView.add(tabPage);

      return resultsLayout;
    }
  }
});
