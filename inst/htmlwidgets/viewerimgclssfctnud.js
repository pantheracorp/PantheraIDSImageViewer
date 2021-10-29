HTMLWidgets.widget({

  name: 'viewerimgclssfctnud',

  type: 'output',


  factory: function (el, width, height) {

    return {

      renderValue: function (x) {


        Shiny.addCustomMessageHandler("img_clssfctn_ud_batch_image_size",
          function (message) {
            setImagesNumber(parseInt(JSON.stringify(message)));
          }
        );

        Shiny.addCustomMessageHandler("img_clssfctn_ud_srvr_batch_image_size",
          function (message) {
            setImagesNumber(parseInt(JSON.stringify(message)));
          }
        );

        Shiny.addCustomMessageHandler("img_clssfctn_ud_img_clmn_numb",
          function (message) {
            setColumnNumb(parseInt(JSON.stringify(message)));
          }
        );

        Shiny.addCustomMessageHandler("img_clssfctn_srver_ud_img_clmn_numb",
          function (message) {
            setColumnNumb(parseInt(JSON.stringify(message)));
          }
        );

        Shiny.addCustomMessageHandler("img_clssfctn_ud_fltr_button",
          function (msg) {
            let src = JSON.stringify(msg);
            nextPrevClicked("1");
            fetchServerData(src, x.componentID);
            resetProps();
          }
        );

        Shiny.addCustomMessageHandler("img_clssfctn_ud_fltr_srvr_button",
          function (msg) {
            nextPrevClicked("1");
            let src = JSON.stringify(msg);
            fetchServerData(src, x.componentID);
            resetProps();
          }
        );


        Shiny.addCustomMessageHandler("img_clssfctn_ud_apply_edt_button",
          function (msg) {
            applyButtonListerner();
          }
        );

        Shiny.addCustomMessageHandler("img_clssfctn_ud_srvr_apply_edt_button",
          function (msg) {
            applyButtonListerner();
          }
        );

        /*Shiny.addCustomMessageHandler("img_clssfctn_ud_sv_edt_button",
          function (msg) {
            saveButtonListerner();
          }
        );

        Shiny.addCustomMessageHandler("img_clssfctn_ud_srvr_sv_edt_button",
          function (msg) {
            saveButtonListerner();
          }
        );*/

        Shiny.addCustomMessageHandler("mssng_srv_imgs_handler",
          function (msg) {
            resetMsnImgsInputs(msg);
          }
        );

        Shiny.addCustomMessageHandler("no_srv_imgs_handler",
          function (msg) {
            resetMsnImgsInputs(msg);
          }
        );
      },

      resize: function (width, height) {

        // TODO: code to re-render the widget with a new size

      }

    };
  }
});