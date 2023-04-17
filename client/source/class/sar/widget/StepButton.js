/* ************************************************************************

   Copyright:
     2023 IT'IS Foundation, https://itis.swiss

   License:
     MIT: https://opensource.org/licenses/MIT

   Authors:
     * Odei Maiz (odeimaiz)

************************************************************************ */

qx.Class.define("sar.widget.StepButton", {
  extend: qx.ui.form.ToggleButton,

  construct: function(text, icon) {
    this.base(arguments);

    this.set({
      width: 140,
      height: 100,
      font: "text-16"
    });

    if (text) {
      this.setLabel(text);
    }
    if (icon) {
      this.setIcon(icon);
    }
  }
});
