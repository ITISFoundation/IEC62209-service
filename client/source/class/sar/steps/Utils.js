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
    modelViewer: function(data, enabled = true) {
      const form1 = new qx.ui.form.Form();

      form1.addGroupHeader("Model information")

      const systemName = new qx.ui.form.TextField().set({
        value: "cSAR3D",
        enabled
      });
      form1.add(systemName, "System name");

      const phantomType = new qx.ui.form.TextField().set({
        value: "Flat HSL",
        enabled
      });
      form1.add(phantomType, "Phantom type");

      const hardwareVersion = new qx.ui.form.TextField().set({
        value: "SD C00 F01 AC",
        enabled
      });
      form1.add(hardwareVersion, "Hardware version");

      const softwareVersion = new qx.ui.form.TextField().set({
        value: "V5.2.0",
        enabled
      });
      form1.add(softwareVersion, "Software version");

      const formRenderer1 = new qx.ui.form.renderer.Single(form1);
      return formRenderer1;
    },

    sarSelectBox: function() {
      const selectBox = new qx.ui.form.SelectBox();
      [{
        id: "sar1g",
        text: "SAR 1g",
      }, {
        id: "sar10g",
        text: "SAR 10g",
      }, {
        id: "both",
        text: "Both",
      }].forEach((sarEntry, idx) => {
        const listItem = new qx.ui.form.ListItem(sarEntry.text);
        listItem.id = sarEntry.id;
        selectBox.add(listItem);
        if (idx === 0) {
          selectBox.setSelection([listItem]);
        }
      });

      return selectBox;
    },

    createTabPage: function(title, widget) {
      const layout = new qx.ui.layout.Canvas();
      const tabPage = new qx.ui.tabview.Page(title).set({
        layout
      });
      tabPage.add(widget, {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      });
      return tabPage;
    },

    createImageViewer: function(source) {
      const distributionImage = new qx.ui.basic.Image().set({
        source,
        scale: true,
        alignX: "center"
      });
      return distributionImage;
    }
  }
});
