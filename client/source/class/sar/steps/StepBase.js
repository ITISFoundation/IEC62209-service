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
      const leftLayout = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));

      const decription = this._createDescription();
      leftLayout.add(decription);

      const options = this._createOptions();
      leftLayout.add(options);

      this._add(decription);

      const results = this._createResults();
      this._add(results, {
        flex: 1
      });
    }
  }
});
