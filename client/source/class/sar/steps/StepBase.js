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

    this._setLayout(new qx.ui.layout.HBox(10));

    this.__builLayout();
  },

  members: {
    __builLayout: function() {
      const stepGrid = new qx.ui.layout.Grid(20, 20);
      stepGrid.setColumnFlex(0, 1);
      stepGrid.setColumnFlex(1, 1);
      stepGrid.setRowFlex(0, 0);
      stepGrid.setRowFlex(1, 1);
      stepGrid.setColumnMinWidth(0, 500);
      stepGrid.setColumnMaxWidth(0, 500);
      stepGrid.setColumnMinWidth(1, 500);
      const stepLayout = new qx.ui.container.Composite(stepGrid).set({
        allowGrowX: false
      });

      const text = this._getDescriptionText();
      const descriptionLabel = new qx.ui.basic.Label().set({
        value: text,
        rich: true,
        wrap: true,
        selectable: true
      });
      stepLayout.add(descriptionLabel, {
        row: 0,
        column: 0
      });

      const options = this._createOptions();
      stepLayout.add(options, {
        row: 1,
        column: 0
      });

      const results = this._createResults();
      stepLayout.add(results, {
        row: 0,
        column: 1,
        rowSpan: 2
      });

      this._add(stepLayout, {
        flex: 1
      });
    },

    _getDescriptionText: function() {
      throw new Error("Abstract method called!");
    }
  }
});
