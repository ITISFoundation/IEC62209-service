/* ************************************************************************

   Copyright: 2023 undefined

   License: MIT license

   Authors: @odeimaiz

************************************************************************ */

/**
 * This is the main application class of "sar"
 *
 * @asset(sar/*)
 */

qx.Class.define("sar.Application", {
  extend : qx.application.Standalone,

  members: {
    __mainLayout: null,

    main() {
      // Call super class
      super.main();

      // Enable logging in debug variant
      if (qx.core.Environment.get("qx.debug")) {
        // support native logging capabilities, e.g. Firebug for Firefox
        qx.log.appender.Native;
        // support additional cross-browser console. Press F7 to toggle visibility
        qx.log.appender.Console;
      }

      const mainLayout = this.__mainLayout = new qx.ui.container.Composite(new qx.ui.layout.VBox());

      const scroll = new qx.ui.container.Scroll();
      scroll.add(mainLayout);
      const doc = this.getRoot();
      const padding = 20;
      doc.add(scroll, {
        left: padding,
        top: padding,
        right: padding,
        bottom: padding
      });

      const introPage = new sar.widget.IntroPage();
      mainLayout.add(introPage);

      introPage.addListener("optionSelected", e => {
        const selection = e.getData();
        this.__startingPointSelected(selection);
      });
    },

    __startingPointSelected: function(optionNumber) {
      const mainLayout = this.__mainLayout;
      mainLayout.removeAll();

      console.log("optionNumber", optionNumber);
      const introPage = new sar.widget.IntroPage();
      mainLayout.add(introPage);
    }
  }
});
