/* ************************************************************************

   Copyright:
     2023 IT'IS Foundation, https://itis.swiss

   License:
     MIT: https://opensource.org/licenses/MIT

   Authors:
     * Odei Maiz (odeimaiz)

************************************************************************ */

qx.Class.define("sar.steps.StepBase", {
  extend: qx.ui.core.Widget,
  type: "abstract",

  construct: function() {
    this.base(arguments);

    const grid = new qx.ui.layout.Grid(20, 20);
    grid.setColumnFlex(0, 0);
    grid.setColumnFlex(1, 1);
    grid.setRowFlex(0, 0);
    grid.setRowFlex(1, 1);
    grid.setColumnMinWidth(0, 500);
    grid.setColumnMaxWidth(0, 500);
    this._setLayout(grid);

    this.__builLayout();
  },

  members: {
    __builLayout: function() {
      const text = this._getDescriptionText();
      const descriptionLabel = new qx.ui.basic.Label().set({
        value: text,
        rich: true,
        wrap: true,
        selectable: true
      });
      this._add(descriptionLabel, {
        row: 0,
        column: 0
      });

      const options = this._createOptions();
      this._add(options, {
        row: 1,
        column: 0
      });

      const results = this._createResults();
      this._add(results, {
        row: 0,
        column: 1,
        rowSpan: 2
      });
    },

    _getDescriptionText: function() {
      throw new Error("Abstract method called!");
    }
  }
});
