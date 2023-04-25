/* ************************************************************************

   Copyright:
     2023 IT'IS Foundation, https://itis.swiss

   License:
     MIT: https://opensource.org/licenses/MIT

   Authors:
     * Odei Maiz (odeimaiz)

************************************************************************ */

qx.Class.define("sar.widget.FetchButton", {
  extend: qx.ui.form.Button,

  properties: {
    fetching: {
      check: "Boolean",
      nullable: false,
      init: false,
      apply: "__applyFetching"
    }
  },

  members: {
    __oldIconScr: null,

    __applyFetching: function(isFetching, old) {
      const icon = this.getChildControl("icon");
      if (isFetching) {
        this.__oldIconScr = this.getIcon();
        icon.set({
          source: "sar/circle-notch-solid.svg",
          width: 14,
          height: 14,
          scale: true
        })
        icon.getContentElement().addClass("rotate");
      } else {
        if (isFetching !== old) {
          this.setIcon(this.__oldIconScr);
        }
        if (icon) {
          icon.getContentElement().removeClass("rotate");
        }
      }
      // Might have been destroyed already
      if (this.getLayoutParent()) {
        this.setEnabled(!isFetching);
      }
    }
  }
});
