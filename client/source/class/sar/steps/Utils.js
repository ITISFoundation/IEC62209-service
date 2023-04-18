/* ************************************************************************

   Copyright:
     2023 IT'IS Foundation, https://itis.swiss

   License:
     MIT: https://opensource.org/licenses/MIT

   Authors:
     * Odei Maiz (odeimaiz)

************************************************************************ */

qx.Class.define("sar.steps.Utils", {
  type: "static",

  statics: {
    modelViewer: function(data, readOnly = false) {
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
      if (readOnly) {
        formRenderer1.setEnabled(!readOnly);
      }
      return formRenderer1;
    }
  }
});
