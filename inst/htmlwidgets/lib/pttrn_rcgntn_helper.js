    /****************************************************************************
     code included inside $(document).ready() will only run once the page is
      ready for JavaScript code to execute
    ***************************************************************************/
    /*$(document).ready(function () {

        $("#pttrn_rcgntn_slct_all_button").on("click", function () {
          pttrn_rcgntn_obj.selectAll();
        });

        $("#pttrn_rcgntn_dslct_all_button").on("click", function () {
          pttrn_rcgntn_obj.deSelectAll();
        });

        $("#pttrn_rcgntn_invrt_button").on("click", function () {
          pttrn_rcgntn_obj.invertSelection();
        });
    });*/

    // pattern recognition viewer object 
    var pttrn_rcgntn_obj = new ViewerComponent(0, 50, 5,
      'spcs_idntfctn_pttrn_rcgntn_mn_pnl',
      'pttrn_rcgntn_fltrd_rslts.csv');

    /**
     * Handles all image panel click events
     * @parameter - event click/shiftKey
     *
     * Checks if event is shiftKey/click
     * Execute appropriate instructions based on event
     * @return void
     */
    function clickEvent(event, id) {

      arrayclone(pttrn_rcgntn_obj.selected_images);
      if (event.metaKey && event.shiftKey) {
        let id = event.target.id;
        let indx = parseInt(id.substring(0, id.indexOf('_')));
        if ((pttrn_rcgntn_obj.hotKeysIndx).length == 1) {
          (pttrn_rcgntn_obj.hotKeysIndx).push(indx);
          pttrn_rcgntn_obj.keySelection();
        } else {
          (pttrn_rcgntn_obj.hotKeysIndx).push(indx);
          pttrn_rcgntn_obj.highliter(id);
        }
        selectionfind(true);
        return;
      } else if (event.shiftKey) {

        if (pttrn_rcgntn_obj.selected_images.includes(event.target.src)) {
          selectionfind(true);
        }
        pttrn_rcgntn_obj.handleExistance(pttrn_rcgntn_obj.selected_images,
          event.target.src, event.target.id);

      } else {

        objectof("pttrn_rcgntn_vwr");
        pttrn_rcgntn_obj.callvjs(pttrn_rcgntn_obj.moduleId + "_divId");
      }
    }


    // reset all populated attributes
    function reset_props() {
      pttrn_rcgntn_obj.deSelectAll();
      (pttrn_rcgntn_obj.selected_images).length = 0;
      pttrn_rcgntn_obj.batnum = 0;
      pttrn_rcgntn_obj.getCurrClckdImg("pttrn_rcgntn_mn_pnl_slctd_img", "");
    }

    // set the number of panel images
    function setImagesNumber(numb) {
      pttrn_rcgntn_obj.imgNumb = numb;
    }

    // reads csv response to array
    function setimgarry(resp) {
      pttrn_rcgntn_obj.readServerData(resp);
    }

    function setimgarryTest(resp) {
      pttrn_rcgntn_obj.readServerDataTest(resp);
    }

    // save or reject helper function
    function saveRejectButtonListerner() {
      pttrn_rcgntn_obj.matchRejectHighlighter(); //matchRejectHighlighter
    }

    // remove all images from the panel
    function clearimages() {
      $("#spcs_idntfctn_pttrn_rcgntn_mn_pnl").html("");
    }

    function pttrn_rcgntn_dslct_all() {
      pttrn_rcgntn_obj.deSelectAll();
    }

    function pttrn_rcgntn_slct_all() {
      pttrn_rcgntn_obj.selectAll();
    }

    function pttrn_rcgntn_invrt() {
      pttrn_rcgntn_obj.invertSelection();
    }