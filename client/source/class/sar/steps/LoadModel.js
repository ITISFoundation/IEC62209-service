/* ************************************************************************

   Copyright:
     2023 IT'IS Foundation, https://itis.swiss

   License:
     MIT: https://opensource.org/licenses/MIT

   Authors:
     * Odei Maiz (odeimaiz)

************************************************************************ */

qx.Class.define("sar.steps.LoadModel", {
  extend: sar.steps.StepBase,

  properties: {
    loadedModel: {
      check: "Object",
      init: null,
      apply: "__setModel"
    }
  },

  events: {
    "modelSet": "qx.event.type.Data"
  },

  members: {
    __loadModelButton: null,
    __modelViewer: null,

    // overriden
    _getDescriptionText: function() {
      return "Load the model that will be used in the coming 4 steps"
    },

    _createOptions: function() {
      const optionsLayout = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));

      const loadModelButton = this.__loadModelButton = new qx.ui.form.Button("Load Model").set({
        allowGrowX: false
      });
      optionsLayout.add(loadModelButton);

      const modelViewer = this.__modelViewer = sar.steps.Utils.modelViewer(null);
      optionsLayout.add(modelViewer);

      optionsLayout.addListener("execute", () => this.__loadModelButtonPressed());

      return optionsLayout;
    },

    _createResults: function() {
      return null;
    },

    __loadModelButtonPressed: function() {

    },

    __setModel: function(model) {
      if (model) {
        this.__loadModelButton.setLabel("Reset Model");
      } else {
        this.__loadModelButton.setLabel("Load Model")
      }
      this.firedataEvent("modelSet", model);
    }
  }
});
