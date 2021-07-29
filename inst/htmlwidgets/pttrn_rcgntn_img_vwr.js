HTMLWidgets.widget({

  name: 'pttrn_rcgntn_img_vwr',

  type: 'output',

  factory: function (el, width, height) {

    // TODO: define shared variables for this instance

    return {

      renderValue: function (x) {

        console.log("pttrn_rcgntn_img_vwr");

        Shiny.addCustomMessageHandler(
          "spcs_idntfctn_pttrn_rcgntn_indvdl_fltr_button",
          function (mesg) {
            console.log("Handler spcs_idntfctn_pttrn_rcgntn_indvdl_fltr_button");
            let src = JSON.stringify(mesg);
            console.log(src);
            nextprevclicked("1");
            fetchServerData(src, x.componentID);
            reset_props();
          }
        );

        Shiny.addCustomMessageHandler(
          "spcs_idntfctn_pttrn_rcgntn_srvr_indvdl_fltr_button",
          function (mesg) {
            let src = JSON.stringify(mesg);
            console.log("Handler svr spcs_idntfctn_pttrn_rcgntn_indvdl_fltr_button");
            nextprevclicked("1");
            fetchServerData(src, x.componentID);
            reset_props();

          }
        );

        Shiny.addCustomMessageHandler(
          "pttrn_rcgntn_mtch_all_button",
          function (mesg) {
            console.log(mesg);
            saveRejectButtonListerner();
          }
        );

        Shiny.addCustomMessageHandler(
          "pttrn_rcgntn_no_mtch_all_button",
          function (mesg) {
            console.log(mesg);
            saveRejectButtonListerner();
          }
        );

        // New
        Shiny.addCustomMessageHandler(
          "pttrn_rcgntn_slct_all_button",
          function (mesg) {
            console.log("Handler pttrn_rcgntn_slct_all_button");
            pttrn_rcgntn_slct_all();
          }
        );

        Shiny.addCustomMessageHandler(
          "pttrn_rcgntn_dslct_all_button",
          function (mesg) {
            console.log("Handler pttrn_rcgntn_dslct_all_button");
            pttrn_rcgntn_dslct_all();
          }
        );

        Shiny.addCustomMessageHandler(
          "pttrn_rcgntn_invrt_button",
          function (mesg) {
            console.log("Handler pttrn_rcgntn_invrt_button");
            pttrn_rcgntn_invrt();
          }
        );
        // el.innerText = x.message;
      },

      resize: function (width, height) {
        // TODO: code to re-render the widget with a new size
      }

    };
  }
});
