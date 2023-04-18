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

  construct: function(optionNumber = 0) {
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
      const introLayout = new qx.ui.container.Composite(new qx.ui.layout.HBox(20));
      const introTitle = new qx.ui.basic.Label().set({
        value: "IEC 62209-3 Validation Procedure",
        font: "text-30"
      });
      introLayout.add(introTitle)
      const infoButton = new qx.ui.basic.Image().set({
        source: "sar/icons/info.png",
        cursor: "pointer",
        alignY: "middle",
        scale: true,
        width: 30,
        height: 30,
      });
      infoButton.addListener("tap", () => {
        const win = new qx.ui.window.Window("Info").set({
          layout: new qx.ui.layout.VBox(0),
          contentPadding: 20,
          resizable: false,
          showClose: true,
          showMaximize: false,
          showMinimize: false,
          modal: true,
          width: 750
        });
        const introPage = new sar.widget.IntroPage();
        win.add(introPage), {
          flex: 1
        };
        win.center();
        win.open();
      });
      introLayout.add(infoButton)
      this._add(introLayout);

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
        icon: "sar/icons/step0_icon.png",
        label: "Training Set Generation",
        step: new sar.steps.Step0(),
      }, {
        icon: "sar/icons/step1_icon.png",
        label: "Analysis & Creation",
        step: new sar.steps.Step1(),
      }, {
        icon: "sar/icons/step2_icon.png",
        label: "Test Set Generation",
        step: new sar.steps.Step2(),
      }, {
        icon: "sar/icons/step3_icon.png",
        label: "Confirm Model",
        step: new sar.steps.Step3(),
      }, {
        icon: "sar/icons/step4_icon.png",
        label: "Explore Space",
        step: new sar.steps.Step4(),
      }, {
        icon: "sar/icons/step5_icon.png",
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
