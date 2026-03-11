  /****************************************************************************
      Pattern Recognition Helper
      Manages the pttrn_rcgntn_obj instance and exposes helper functions
      @Copyright (C) 2019-2026 | Panthera Corporation
  ****************************************************************************/

  var pttrn_rcgntn_obj = new ViewerComponent(0, 50, 5,
    'spcs_idntfctn_pttrn_rcgntn_mn_pnl');

  function clickEvent(event, id) {

    arrayclone(pttrn_rcgntn_obj.selected_images);
    if (event.metaKey && event.shiftKey) {
      var eid = event.target.id;
      var indx = parseInt(eid.substring(0, eid.indexOf('_')));
      if ((pttrn_rcgntn_obj.hotKeysIndx).length === 1) {
        (pttrn_rcgntn_obj.hotKeysIndx).push(indx);
        pttrn_rcgntn_obj.keySelection();
      } else {
        (pttrn_rcgntn_obj.hotKeysIndx).push(indx);
        pttrn_rcgntn_obj.highliter(eid);
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

  function reset_props() {
    pttrn_rcgntn_obj.deSelectAll();
    (pttrn_rcgntn_obj.selected_images).length = 0;
    pttrn_rcgntn_obj.batnum = 0;
    pttrn_rcgntn_obj.getCurrClckdImg("pttrn_rcgntn_mn_pnl_slctd_img", "");
  }

  function setImagesNumber(numb) {
    pttrn_rcgntn_obj.imgNumb = numb;
  }

  function setimgarry(resp) {
    pttrn_rcgntn_obj.readServerData(resp);
  }

  function setimgarryTest(resp) {
    pttrn_rcgntn_obj.readServerDataTest(resp);
  }

  function saveRejectButtonListerner() {
    pttrn_rcgntn_obj.matchRejectHighlighter();
    pttrn_rcgntn_obj.getCurrClckdImg("pttrn_rcgntn_mn_pnl_slctd_img", "");
  }

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
