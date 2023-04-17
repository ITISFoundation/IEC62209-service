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
    _createDescription: function() {
      return new qx.ui.basic.Label("Desc 1").set({
        rich: true,
        wrap: true,
        selectable: true
      });
    },

    _createOptions: function() {
      return new qx.ui.basic.Label("Options 1").set({
        rich: true,
        wrap: true,
        selectable: true
      });
    },

    _createResults: function() {
      return new qx.ui.basic.Label("Results 1").set({
        rich: true,
        wrap: true,
        selectable: true
      });
    }
  }
});
