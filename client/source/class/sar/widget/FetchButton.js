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
    __icon: null,

    __applyFetching: function(isFetching, old) {
      if (isFetching) {
        this.__icon = this.getIcon();
        this.getChildControl("icon").set({
          source: "sar/circle-notch-solid.svg",
          height: 14
        })
        this.getChildControl("icon").getContentElement().addClass("rotate");
      } else {
        if (isFetching !== old) {
          this.setIcon(this.__icon);
        }
        if (this.getChildControl("icon")) {
          this.getChildControl("icon").getContentElement().removeClass("rotate");
        }
      }
      // Might have been destroyed already
      if (this.getLayoutParent()) {
        this.setEnabled(!isFetching);
      }
    }
  }
});
