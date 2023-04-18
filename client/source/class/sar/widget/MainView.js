/* ************************************************************************

   Copyright:
     2023 IT'IS Foundation, https://itis.swiss

   License:
     MIT: https://opensource.org/licenses/MIT

   Authors:
     * Odei Maiz (odeimaiz)

************************************************************************ */

qx.Class.define("sar.widget.MainView", {
  extend: qx.ui.core.Widget,

  construct: function(optionNumber) {
    this.base(arguments);

    this._setLayout(new qx.ui.layout.VBox(20));

    this.__stepButtons = [];
    this.__steps = [];

    this.builLayout();

    this.setStartingPoint(optionNumber);
  },

  members: {
    __stepButtons: null,
    __stepsStack: null,

    builLayout: function() {
      const introTitle = new qx.ui.basic.Label().set({
        value: "IEC 62209-3 Validation Procedure",
        font: "text-30"
      });
      this._add(introTitle);

      const stepsGrid = new qx.ui.layout.Grid(20, 10);
      stepsGrid.setColumnAlign(0, "center", "middle");
      stepsGrid.setColumnAlign(1, "center", "middle");
      stepsGrid.setColumnAlign(2, "center", "middle");
      stepsGrid.setColumnAlign(3, "center", "middle");
      stepsGrid.setColumnAlign(4, "center", "middle");
      stepsGrid.setColumnAlign(5, "center", "middle");
      const stepsLayout = new qx.ui.container.Composite(stepsGrid).set({
        allowGrowX: false
      });
      [
        "Model Creation",
        "Model Confirmation",
        "Critical Data Space Search",
      ].forEach((sectionText, idx) => {
        const sectionLabel = new qx.ui.basic.Label().set({
          value: sectionText,
          font: "text-18"
        });
        stepsLayout.add(sectionLabel, {
          row: 0,
          column: idx*2,
          colSpan: 2
        });
      });

      const stepsStack = new qx.ui.container.Stack();
      [{
        icon: null,
        label: "Training Set Generation",
        step: new sar.steps.Step0(),
      }, {
        icon: null,
        label: "Analysis & Creation",
        step: new sar.steps.Step1(),
      }, {
        icon: null,
        label: "Test Set Generation",
        step: new sar.steps.Step2(),
      }, {
        icon: null,
        label: "Confirm Model",
        step: new sar.steps.Step3(),
      }, {
        icon: null,
        label: "Explore Space",
        step: new sar.steps.Step4(),
      }, {
        icon: null,
        label: "Verify",
        step: new sar.steps.Step5(),
      }].forEach((section, idx) => {
        const stepButton = new sar.widget.StepButton(section.label, section.icon);
        stepButton.addListener("changeValue", e => {
          if (e.getData()) {
            stepsStack.setSelection([section.step]);
          }
          this.__stepButtons.forEach((stepButton, buttonIdx) => {
            if (buttonIdx !== idx) {
              stepButton.setValue(false);
            }
          })
        })
        stepsStack.add(section.step);
        this.__stepButtons.push(stepButton);
        stepsLayout.add(stepButton, {
          row: 1,
          column: idx
        });
      });
      this._add(stepsLayout);
      this._add(stepsStack);

      this.__stepButtons[0].setValue(true);
    },

    setStartingPoint: function(optionNumber) {
      this.__stepButtons[optionNumber*2].setValue(true);
    }
  }
});
