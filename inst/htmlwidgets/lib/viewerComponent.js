/***************************************************************************
      @version ViewerComponent v1.3.7
      @author Valentine Tawira
      @Copyright (C) 2019 | Panthera Corporation
***************************************************************************/
class ViewerComponent {

  constructor(batnum, imgNumb, columnSize, moduleId) {
    this.columnSize = columnSize;
    this.batnum = batnum;
    this.imgNumb = imgNumb;
    this.moduleId = moduleId;
    this.imgArray = [];
    this.mtchdArray = [];
    this.selected_images = [];
    this.nextPrev = "0";
    this.result = [];
    this.tempRemoved = "";
    this.currentDisplayedImgs = [];
    this.prevSelectedImgs = [];
    this.hotKeysIndx = [];
    this.selectedImageID = [];
  }


  readServerData(response) {

    console.log("readServerData - 02/08/2021");

    let mdid = (this.moduleId).substring(0, 27);
    this.imgArray.length = 0;
    this.selectedImageID.length = 0;
    let respArray = [];
    if (response === null) {
      console.log(" Error in reading your images.");
    } else {
      respArray = response.split("\n");

      respArray.shift();

      if (respArray[respArray.length - 1] == "") {

        respArray.pop();
      }

      for (let i = 0; i < respArray.length; i++) {
        let src = respArray[i].substring(respArray[i].indexOf('/'), respArray[i].lastIndexOf('/')) + '/' + respArray[i].substring(0, respArray[i].indexOf('/'));
        this.imgArray.push(src.replace(',', ''));
      }

      if (this.moduleId === "img_clssfctn_ud") {
        Shiny.onInputChange("img_clssfctn_ud_btch_tckr",
          1 + " / " + this.getBatchNumber());
      }
    }
    if (this.moduleId === "img_clssfctn_ud") {
      this.clearImages();
      this.imgloop(this.displayImages(this.imgNumb, 0));
    }
    if (this.moduleId === "spcs_idntfctn_pttrn_rcgntn_mn_pnl") {
      this.clearImages();
      this.imgloop(this.imgArray);
    }
    if (mdid === 'ct_vldt_img_trggr_tbl_vldtn') {
      this.clearImages();
      this.imgloop(this.imgArray);
    }
  }

  readServerDataTest(response) {

    let mdid = (this.moduleId).substring(0, 27);
    this.imgArray.length = 0;
    this.selectedImageID.length = 0;

    if (response === null) {
      console.log(" Error in reading your images");
    } else {

      this.imgArray = response.split(",");

      if (this.moduleId === "img_clssfctn_ud") {
        Shiny.onInputChange("img_clssfctn_ud_btch_tckr",
          1 + " / " + this.getBatchNumber());
      }
    }

    if (this.moduleId === "img_clssfctn_ud") {
      this.clearImages();
      this.imgloop(
        this.displayImages(this.imgNumb, 0)
      );
    }

    if (this.moduleId === "spcs_idntfctn_pttrn_rcgntn_mn_pnl") {

      let resp = response;
      let resp_1 = JSON.parse(resp);
      let mtchd1 = resp_1.match;
      let imgArray1 = resp_1.img_wrt;

      this.imgArray = imgArray1;
      this.mtchdArray = mtchd1;

      this.clearImages();
      this.imgloop(this.imgArray);

    }

    if (mdid === 'ct_vldt_img_trggr_tbl_vldtn') {
      this.clearImages();
      this.imgloop(this.imgArray);
    }

  }

  /*readServerDataTest(response) {
    let mdid = (this.moduleId).substring(0, 27);
    this.imgArray.length = 0;
    this.selectedImageID.length = 0;

    if (response === null) {
      console.log(" Error in reading your images");
    } else {

      this.imgArray = response.split(",");

      if (this.moduleId === "img_clssfctn_ud") {
        Shiny.onInputChange("img_clssfctn_ud_btch_tckr",
          1 + " / " + this.getBatchNumber());
      }
    }
    if (this.moduleId === "img_clssfctn_ud") {
      this.clearImages();
      this.imgloop(this.displayImages(this.imgNumb, 0));
    }
    if (this.moduleId === "spcs_idntfctn_pttrn_rcgntn_mn_pnl") {
      this.clearImages();
      this.imgloop(this.imgArray);
    }
    if (mdid === 'ct_vldt_img_trggr_tbl_vldtn') {
      this.clearImages();
      this.imgloop(this.imgArray);
    }
  }*/

  ulClassName() {

    if (this.moduleId === "img_clssfctn_ud") {
      return 'pictures';
    }
    if (this.moduleId === "spcs_idntfctn_pttrn_rcgntn_mn_pnl") {
      return 'rcgntn_pictures';
    }
  }

  highliter(elementID) {
    //let ulclassname = this.ulClassName();
    $('#' + elementID + '').css({
      'opacity': '0.4',
      'filter': 'alpha(opacity=40)'
    });
    $('#' + elementID + '').closest("li").css("background-color", "yellow");
    this.selectedImageID.push(elementID);
  }

  removeHighlight(elementID) {
    let indx = this.selectedImageID.indexOf(elementID);
    this.selectedImageID.splice(indx, 1);
    $('#' + elementID + '').css({
      'opacity': '',
      'filter': ''
    });
    $('#' + elementID + '').closest("li").css("background-color", "white");

  }

  /** Not Yet Generic */
  setCol() {

    $('.pictures > li').css({
      'width': 'calc(100% /' + this.columnSize + ')'
    });
  }

  // clssfctn_slctd_img
  getCurrClckdImg(state, imgsrc) {
    Shiny.onInputChange(state, imgsrc);
  }

  sendAllImages() {
    this.getCurrClckdImg(this.selectedImgShinyRef(), this.getTrimedSelectedImages().toString());
  }

  selectedImgShinyRef() {

    if (this.moduleId === "img_clssfctn_ud") {
      return "clssfctn_slctd_img";
    }
    if (this.moduleId === "spcs_idntfctn_pttrn_rcgntn_mn_pnl") {
      return "pttrn_rcgntn_mn_pnl_slctd_img";
    }
  }

  /** Not Yet Generic */
  handleExistance(params, src, id) {
    let ref = this.selectedImgShinyRef();

    if (params.includes(src)) {
      this.tempRemoved = (params.splice(params.indexOf(src), 1))[0];
      this.removeHighlight(id);
      if (params.length > 0) {
        this.getCurrClckdImg(ref, this.getTrimedSelectedImages().toString());
      } else {
        this.getCurrClckdImg(ref, ""); //""
      }
    } else {
      if (this.isPlacveHolder(src)) {

        this.callSelectionFind(true);
      } else {
        params.push(src);
        this.highliter(id);
        this.getCurrClckdImg(ref, this.getTrimedSelectedImages().toString());
      }
    }
  }

  callSelectionFind(value) {
    if (this.moduleId === "img_clssfctn_ud") {
      selectionFind(value);
    }
    if (this.moduleId === "spcs_idntfctn_pttrn_rcgntn_mn_pnl") {
      selectionfind(value);
    }

  }

  isPlacveHolder(src) {
    return (src.split('/').pop() === 'PantheraIDS_image_not_found_2.jpg');
  }

  removedRef() {
    return this.tempRemoved;
  }

  displayImages(imgnumb, bat) {
    this.clearImages();
    let start, end;
    start = bat * imgnumb;
    end = start + imgnumb;
    this.result = this.imgArray.slice(start, end);
    return this.result;
  }

  getBatchNumber() {
    if ((this.imgArray.length % this.imgNumb) === 0) {
      return (this.imgArray.length / this.imgNumb);
    } else {
      return ((Math.floor(this.imgArray.length / this.imgNumb)) + 1);
    }
  }
  // We need a function that maps to diff modules
  next() {
    nextPrevClicked("1");

    if (this.batnum < this.getBatchNumber() - 1) {
      this.batnum++;
      Shiny.onInputChange("img_clssfctn_ud_btch_tckr",
        (this.batnum + 1) + " / " + this.getBatchNumber());
      this.imgloop(this.displayImages(this.imgNumb, this.batnum));
      this.selected_images.length = 0;
      this.selectedImageID.length = 0;
      this.getCurrClckdImg("clssfctn_slctd_img", "");

    } else {
      Shiny.onInputChange("img_clssfctn_ud_btch_tckr",
        this.getBatchNumber() + " / " + this.getBatchNumber());
      this.imgNumb(this.displayImages(this.imgNumb, this.getBatchNumber() - 1));
      this.batnum = this.getBatchNumber() - 1;
      this.selected_images.length = 0;
      this.selectedImageID.length = 0;
      this.getCurrClckdImg("clssfctn_slctd_img", "");
    }
  }

  prev() {

    nextPrevClicked("1");
    this.batnum--;
    if (this.batnum > 0) {
      Shiny.onInputChange("img_clssfctn_ud_btch_tckr",
        (this.batnum + 1) + " / " + this.getBatchNumber());
      this.imgloop(this.displayImages(this.imgNumb, this.batnum));
      this.selected_images.length = 0;
      this.selectedImageID.length = 0;
      this.getCurrClckdImg("clssfctn_slctd_img", "");
    } else {
      Shiny.onInputChange("img_clssfctn_ud_btch_tckr",
        1 + " / " + this.getBatchNumber());
      this.imgloop(this.displayImages(this.imgNumb, 0));
      this.selected_images.length = 0;
      this.selectedImageID.length = 0;
      this.getCurrClckdImg("clssfctn_slctd_img", "");
      this.batnum = 0;
    }
  }

  trimSRC(selctdImgAry) {
    let i = 0;
    let tempArray = [];
    for (i; i < this.selected_images.length; i++) {
      let newSRC = selctdImgAry[i].substring(selctdImgAry[i].lastIndexOf("/") + 1,
        selctdImgAry[i].length);
      tempArray[i] = newSRC;
    }
    return tempArray;
  }

  clearImages() {
    $('#' + this.moduleId + '').html("");
  }

  // See if this indeed should var
  vjs(elementID) {
    var elementID = new Viewer(document.getElementById(elementID), {
      url: 'data-original',
      title: function (image) {
        return image.alt + ' (' + (this.index + 1) + '/' + this.length + ')';
      },
    });
  }

  getSelectedImages() {
    return this.selected_images;
  }

  getTrimedSelectedImages() {
    return this.trimSRC(this.getSelectedImages());
  }

  invertSelection() {

    let notSelected;

    if ((this.selected_images).length > 0) {

      notSelected = this.arryCompliment(this.currentDisplayedImgs, this.selected_images);
      this.deSelectAll();
    } else {

      notSelected = this.arryCompliment(this.currentDisplayedImgs, this.prevSelectedImgs)
    }
    this.highlightInverse(notSelected);
  }

  arryCompliment(ar1, ar2) {

    if (ar1.length == 0 || ar2.length == 0) {
      return
    }
    return ar1.filter(f => !ar2.includes(f));
  }

  highlightInverse(ar) {
    this.selected_images.length = 0;
    this.selectedImageID.length = 0;
    let slctdimgs = [],
      mtchStatus = ['mtchd', 'mtchd-nw'],
      tempSlctdId = [];

    $('#' + this.moduleId + ' img').each(function () {

      if (
        !mtchStatus.includes($('#' + this.id + '').closest('li').attr('id'))
      ) {

        if (ar.includes($(this).attr('src'))) {
          $('#' + this.id + '').css({
            'opacity': '0.4',
            'filter': 'alpha(opacity=40)'
          });
          slctdimgs.push($(this).attr('src'));
          tempSlctdId.push($(this).attr('id'));
          $('#' + this.id + '').closest('li').css("background-color", "yellow");
        }

      }

    });
    this.selected_images = [...slctdimgs];
    this.selectedImageID = [...tempSlctdId];
    this.sendAllImages();

    console.log(
      this.selectedImageID
    )

  }

  selectAll() {

    this.selected_images.length = 0;
    this.selectedImageID.length = 0;
    let slctdimgs = [],
      mtchStatus = ['mtchd', 'mtchd-nw'],
      tempSlctdId = [];
    $('#' + this.moduleId + ' img').each(function () {

      if (
        !mtchStatus.includes($('#' + this.id + '').closest('li').attr('id'))
      ) {

        $('#' + this.id + '').css({
          'opacity': '0.4',
          'filter': 'alpha(opacity=40)'
        });
        $('#' + this.id + '').closest('li').css("background-color", "yellow");
        slctdimgs.push($(this).attr('src'));
        tempSlctdId.push($(this).attr('id'));

      }

    });
    this.selected_images = [...slctdimgs];
    this.selectedImageID = [...tempSlctdId];
    this.sendAllImages();

    console.log(
      this.selectedImageID
    )

  }


  deSelectAll() {
    let mtchStatus = ['mtchd', 'mtchd-nw'];

    $('#' + this.moduleId + ' img').each(function () {

      if (
        !mtchStatus.includes($('#' + this.id + '').closest('li').attr('id'))
      ) {

        $('#' + this.id + '').css({
          'opacity': '',
          'filter': ''
        });

      }
    });

    (this.prevSelectedImgs).length = 0;
    this.prevSelectedImgs = [...this.selected_images];
    this.selected_images.length = 0;
    this.selectedImageID.length = 0;
    this.getCurrClckdImg(this.selectedImgShinyRef(), "");
    this.highlightMatched();

  }

  highlightMatched() {

    if (this.moduleId === "spcs_idntfctn_pttrn_rcgntn_mn_pnl") {

      $("#mtchd > img").css({
        'opacity': '0.4',
        'filter': 'alpha(opacity=40)'
      });
      $('li#mtchd').css("background-color", "#1200a6");
    }

  }

  sendDataToShinny() {
    if (this.selected_images === undefined || this.selected_images.length === 0) {
      return;
    } else {
      const copy_selected_images = [...this.selected_images];
      this.deSelectAll();
      return copy_selected_images;
    }
  }

  // Checks if the an image exist on the server
  placeHolder(imgURL) {
    let xmlhttp = new XMLHttpRequest();
    let url = imgURL;
    xmlhttp.open("GET", url, false);
    xmlhttp.send();
    if (xmlhttp.status == 200) {
      return true;
    } else {
      return false;
    }
  }

  // Depreciated
  checkImageExistance(arry) {
    let count = 0;
    for (let i = 0; i < arry.length; i++) {
      let url = ((arry[i].trim()).replace(/['"]+/g, '')).replace(/(\r\n|\n|\r)/gm, "");
      let xmlhttp = new XMLHttpRequest();
      xmlhttp.open("GET", url, false);
      xmlhttp.send();
      if (xmlhttp.status == 200) {} else {
        count++;
      }
    }
    return count;
  }

  // Creates bilds the images in the panel 
  imgloop(arr) {

    (this.currentDisplayedImgs).length = 0;
    (this.prevSelectedImgs).length = 0;

    let ul = document.getElementById(this.moduleId);

    for (let i = 0; i < arr.length; i++) {

      let liId = i + '_' + this.moduleId;
      let img = new Image();
      img.src = ((arr[i].trim()).replace(/[\[\]'"]+/g, '')).replace(/(\r\n|\n|\r)/gm, "");

      this.currentDisplayedImgs.push(img.src);
      img.alt = "Camera Trap";
      img.datamarked = 0;

      if (this.placeHolder(img.src)) {

        if ((this.mtchdArray).length == arr.length) {

          if (this.mtchdArray[i] == "Unvalidated") {

            ul.innerHTML += '<li  ><img id="' + liId + '" data-original="' + img.src + '"  marked="' + img.datamarked + '" src="' + img.src + '"onerror="' + "this.style.display='none'" + '"  alt="' + img.alt + '" /> </li>';

          } else {
            ul.innerHTML += '<li id="mtchd" ><img id="' + liId + '" data-original="' + img.src + '"  marked="' + img.datamarked + '" src="' + img.src + '"onerror="' + "this.style.display='none'" + '"  alt="' + img.alt + '" /> </li>';
          }

        } else {
          ul.innerHTML += '<li  ><img id="' + liId + '" data-original="' + img.src + '"  marked="' + img.datamarked + '" src="' + img.src + '"onerror="' + "this.style.display='none'" + '"  alt="' + img.alt + '" /> </li>';
        }

      } else {

        img.src = '/srv/shiny-server/www/Missing_Image.JPG';
        ul.innerHTML += '<li  ><img id="' + liId + '" data-original="' + img.src + '"  marked="' + img.datamarked + '" src="' + img.src + '"  alt="' + img.alt + '" /> </li>';

      }

      this.setCol();
    }

  }

  // reset missing images handler (Depreciated)
  resetHandlers(msg) {
    if (msg === 'noImages') {
      Shiny.setInputValue('no_srv_imgs', null);
    } else {
      Shiny.setInputValue('mssng_srv_imgs', null);
    }
  }

  changeCSS(element) {
    $('.' + element).css("list-style", none);
    $('.' + element).css("margin", 0);
    $('.' + element).css("max-width", "500rem");
    $('.' + element).css("padding", 0);

    $('.' + element + '> li').css("border", "2px solid white");
    $('.' + element + '> li').css("float", "left");
    $('.' + element + '> li').css("float", "left");

    $('.' + element + '> li').css({
      'border': '2px solid white',
      'float': 'left',
      'width': 'calc(100% /' + this.columnSize + ')',
      'height': 'calc(100% /' + this.columnSize + ')',
      'margin': '0 -1px -1px 0',
      'overflow': 'hidden',
    });

    $('.' + element + '> li > img').css({
      'cursor': 'pointer',
      'width': '100%',
      'overflow': 'hidden'
    });
  }

  // revert to white panel background
  liWhiteBackground() {
    let ulclassname = this.ulClassName();
    $('.' + ulclassname + ' > li').css("background-color", "white");
  }

  /**
   * @description - indirect call to the vjs() function
   * @returns image view myFunction
   */
  callvjs(elementId) {
    this.vjs(elementId);
    return;
  }

  // HokKey selection 
  keySelection() {

    let slctdimgs = [],
      tempSlctdId = [],
      imgs = $('#' + this.moduleId + ' img'),
      start = Math.min.apply(Math, this.hotKeysIndx),
      end = Math.max.apply(Math, this.hotKeysIndx);

    //let ulclassname = this.ulClassName();
    for (let i = start; i <= end; i++) {
      $('#' + imgs[i].id + '').css({
        'opacity': '0.4',
        'filter': 'alpha(opacity=40)'
      });
      $('#' + imgs[i].id + '').closest('li').css("background-color", "yellow");
      //$('.'+ulclassname+'> li').css("background-color", "yellow");
      slctdimgs.push(imgs[i].src);
      tempSlctdId.push(imgs[i].id);
    }
    (this.selected_images).push(...slctdimgs);
    this.selectedImageID.push(...tempSlctdId);
    this.selected_images = [...new Set(this.selected_images)]; // remove duplicates
    this.selectedImageID = [...new Set(this.selectedImageID)];
    this.sendAllImages();
    (this.hotKeysIndx).length = 0;
  }

  matchRejectHighlighter() {

    for (let i = 0; i < this.selectedImageID.length; i++) {
      $('#' + this.selectedImageID[i] + '').closest('li').css("background-color", "#90EE90");
      $('#' + this.selectedImageID[i] + '').closest('li').attr('id', 'mtchd-nw');
    }

    this.prevSelectedImgs.length = 0;
    this.prevSelectedImgs = [...this.selected_images];
    this.selected_images.length = 0;
    this.selectedImageID.length = 0;
    this.getCurrClckdImg("pttrn_rcgntn_mn_pnl_slctd_img", "");
  }


}