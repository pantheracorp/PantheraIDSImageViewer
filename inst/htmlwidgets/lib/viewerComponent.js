/***************************************************************************
    @version ViewerComponent v2.0.0
    @Copyright (C) 2019-2026 | Panthera Corporation

    Rewritten to remove synchronous XMLHttpRequest (which caused
    placeholder/question-mark images in modern browsers).
    Images are now loaded asynchronously with onerror fallback.
***************************************************************************/

var PLACEHOLDER_IMG = 'Missing_Image.JPG';

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

  flagNextPrev() {
    if (typeof nextPrevClicked === "function") {
      nextPrevClicked("1");
      return;
    }
    if (typeof nextprevclicked === "function") {
      nextprevclicked("1");
      return;
    }
  }

  setBatchTickerText(text) {
    if (this.moduleId === "img_clssfctn_ud") {
      Shiny.onInputChange("img_clssfctn_ud_btch_tckr", text);
      return;
    }
    if (this.moduleId === "spcs_idntfctn_pttrn_rcgntn_mn_pnl") {
      var el = document.getElementById("pttrn_rcgntn_btch_tckr");
      if (el) {
        el.textContent = text;
      }
    }
  }

  updateBatchTicker() {
    var batches = this.getBatchNumber();
    if (batches === 0) {
      this.setBatchTickerText("0 / 0");
      return;
    }
    this.setBatchTickerText((this.batnum + 1) + " / " + batches);
  }

  readServerData(response) {
    var mdid = (this.moduleId).substring(0, 27);
    this.imgArray.length = 0;
    this.selectedImageID.length = 0;
    var respArray = [];

    if (response === null) {
      console.warn("ViewerComponent: null response in readServerData");
    } else {
      respArray = response.split("\n");
      respArray.shift();
      if (respArray[respArray.length - 1] === "") {
        respArray.pop();
      }
      for (var i = 0; i < respArray.length; i++) {
        var line = respArray[i];
        var src = line.substring(line.indexOf('/'), line.lastIndexOf('/')) +
          '/' + line.substring(0, line.indexOf('/'));
        this.imgArray.push(src.replace(',', ''));
      }
      if (
        this.moduleId === "img_clssfctn_ud" ||
        this.moduleId === "spcs_idntfctn_pttrn_rcgntn_mn_pnl"
      ) {
        this.batnum = 0;
        this.updateBatchTicker();
      }
    }

    if (
      this.moduleId === "img_clssfctn_ud" ||
      this.moduleId === "spcs_idntfctn_pttrn_rcgntn_mn_pnl"
    ) {
      this.clearImages();
      this.imgloop(this.displayImages(this.imgNumb, 0));
    }
    if (mdid === 'ct_vldt_img_trggr_tbl_vldtn') {
      this.clearImages();
      this.imgloop(this.imgArray);
    }
  }

  readServerDataTest(response) {
    var mdid = (this.moduleId).substring(0, 27);
    this.imgArray.length = 0;
    this.selectedImageID.length = 0;

    if (response === null) {
      console.warn("ViewerComponent: null response in readServerDataTest");
    } else {
      if (this.moduleId === "spcs_idntfctn_pttrn_rcgntn_mn_pnl") {
        var resp_1 = JSON.parse(response);
        var mtchd1 = resp_1.match;
        var imgArray1 = resp_1.img_wrt;

        this.imgArray = Array.isArray(imgArray1) ? imgArray1 : Object.values(imgArray1 || {});
        this.mtchdArray = Array.isArray(mtchd1) ? mtchd1 : Object.values(mtchd1 || {});

        this.batnum = 0;
        this.updateBatchTicker();
        this.clearImages();
        this.imgloop(this.displayImages(this.imgNumb, 0));
        return;
      }

      this.imgArray = response.split(",");

      if (this.moduleId === "img_clssfctn_ud") {
        this.batnum = 0;
        this.updateBatchTicker();
      }
    }

    if (this.moduleId === "img_clssfctn_ud") {
      this.clearImages();
      this.imgloop(this.displayImages(this.imgNumb, 0));
    }
    if (mdid === 'ct_vldt_img_trggr_tbl_vldtn') {
      this.clearImages();
      this.imgloop(this.imgArray);
    }
  }

  ulClassName() {
    if (this.moduleId === "img_clssfctn_ud") {
      return 'pictures';
    }
    if (this.moduleId === "spcs_idntfctn_pttrn_rcgntn_mn_pnl") {
      return 'rcgntn_pictures';
    }
  }

  highliter(elementID) {
    $('#' + elementID).css({
      'opacity': '0.4',
      'filter': 'alpha(opacity=40)'
    });
    $('#' + elementID).closest("li").css("background-color", "yellow");
    this.selectedImageID.push(elementID);
  }

  removeHighlight(elementID) {
    var indx = this.selectedImageID.indexOf(elementID);
    this.selectedImageID.splice(indx, 1);
    $('#' + elementID).css({ 'opacity': '', 'filter': '' });
    $('#' + elementID).closest("li").css("background-color", "white");
  }

  setCol() {
    $('.rcgntn_pictures > li').css({
      'width': 'calc(100% / ' + this.columnSize + ')'
    });
    $('.pictures > li').css({
      'width': 'calc(100% / ' + this.columnSize + ')'
    });
  }

  getCurrClckdImg(state, imgsrc) {
    Shiny.onInputChange(state, imgsrc);
  }

  sendAllImages() {
    this.getCurrClckdImg(
      this.selectedImgShinyRef(),
      this.getTrimedSelectedImages().toString()
    );
  }

  selectedImgShinyRef() {
    if (this.moduleId === "img_clssfctn_ud") {
      return "clssfctn_slctd_img";
    }
    if (this.moduleId === "spcs_idntfctn_pttrn_rcgntn_mn_pnl") {
      return "pttrn_rcgntn_mn_pnl_slctd_img";
    }
  }

  handleExistance(params, src, id) {
    var ref = this.selectedImgShinyRef();

    if (params.includes(src)) {
      this.tempRemoved = (params.splice(params.indexOf(src), 1))[0];
      this.removeHighlight(id);
      if (params.length > 0) {
        this.getCurrClckdImg(ref, this.getTrimedSelectedImages().toString());
      } else {
        this.getCurrClckdImg(ref, "");
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
      if (typeof selectionFind === "function") selectionFind(value);
    }
    if (this.moduleId === "spcs_idntfctn_pttrn_rcgntn_mn_pnl") {
      if (typeof selectionfind === "function") selectionfind(value);
    }
  }

  isPlacveHolder(src) {
    if (!src) return true;
    var filename = src.split('/').pop();
    return (
      filename === 'PantheraIDS_image_not_found_2.jpg' ||
      filename === 'Missing_Image.JPG'
    );
  }

  removedRef() {
    return this.tempRemoved;
  }

  displayImages(imgnumb, bat) {
    this.clearImages();
    var start = bat * imgnumb;
    var end = start + imgnumb;
    this.result = this.imgArray.slice(start, end);
    return this.result;
  }

  getBatchNumber() {
    if (this.imgArray.length === 0) return 0;
    if ((this.imgArray.length % this.imgNumb) === 0) {
      return this.imgArray.length / this.imgNumb;
    }
    return Math.floor(this.imgArray.length / this.imgNumb) + 1;
  }

  next() {
    this.flagNextPrev();
    if (this.getBatchNumber() === 0) {
      this.batnum = 0;
      this.updateBatchTicker();
      this.clearImages();
      this.getCurrClckdImg(this.selectedImgShinyRef(), "");
      return;
    }
    if (this.batnum < this.getBatchNumber() - 1) {
      this.batnum++;
    }
    this.updateBatchTicker();
    this.imgloop(this.displayImages(this.imgNumb, this.batnum));
    this.selected_images.length = 0;
    this.selectedImageID.length = 0;
    this.getCurrClckdImg(this.selectedImgShinyRef(), "");
  }

  prev() {
    this.flagNextPrev();
    if (this.getBatchNumber() === 0) {
      this.batnum = 0;
      this.updateBatchTicker();
      this.clearImages();
      this.getCurrClckdImg(this.selectedImgShinyRef(), "");
      return;
    }
    if (this.batnum > 0) {
      this.batnum--;
    }
    this.updateBatchTicker();
    this.imgloop(this.displayImages(this.imgNumb, this.batnum));
    this.selected_images.length = 0;
    this.selectedImageID.length = 0;
    this.getCurrClckdImg(this.selectedImgShinyRef(), "");
  }

  trimSRC(selctdImgAry) {
    var tempArray = [];
    for (var i = 0; i < this.selected_images.length; i++) {
      var full = selctdImgAry[i];
      tempArray[i] = full.substring(full.lastIndexOf("/") + 1, full.length);
    }
    return tempArray;
  }

  clearImages() {
    var el = document.getElementById(this.moduleId);
    if (el) el.innerHTML = "";
  }

  vjs(elementID) {
    new Viewer(document.getElementById(elementID), {
      url: 'data-original',
      title: function (image) {
        return image.alt + ' (' + (this.index + 1) + '/' + this.length + ')';
      }
    });
  }

  getSelectedImages() {
    return this.selected_images;
  }

  getTrimedSelectedImages() {
    return this.trimSRC(this.getSelectedImages());
  }

  invertSelection() {
    var notSelected;
    if (this.selected_images.length > 0) {
      notSelected = this.arryCompliment(this.currentDisplayedImgs, this.selected_images);
      this.deSelectAll();
    } else {
      notSelected = this.arryCompliment(this.currentDisplayedImgs, this.prevSelectedImgs);
    }
    this.highlightInverse(notSelected);
  }

  arryCompliment(ar1, ar2) {
    if (ar1.length === 0 || ar2.length === 0) return [];
    return ar1.filter(function (f) { return !ar2.includes(f); });
  }

  highlightInverse(ar) {
    this.selected_images.length = 0;
    this.selectedImageID.length = 0;
    var slctdimgs = [];
    var mtchStatus = ['mtchd', 'mtchd-nw'];
    var tempSlctdId = [];

    $('#' + this.moduleId + ' img').each(function () {
      if (!mtchStatus.includes($('#' + this.id).closest('li').attr('id'))) {
        if (ar.includes($(this).attr('src'))) {
          $('#' + this.id).css({ 'opacity': '0.4', 'filter': 'alpha(opacity=40)' });
          slctdimgs.push($(this).attr('src'));
          tempSlctdId.push($(this).attr('id'));
          $('#' + this.id).closest('li').css("background-color", "yellow");
        }
      }
    });
    this.selected_images = slctdimgs.slice();
    this.selectedImageID = tempSlctdId.slice();
    this.sendAllImages();
  }

  selectAll() {
    this.selected_images.length = 0;
    this.selectedImageID.length = 0;
    var slctdimgs = [];
    var mtchStatus = ['mtchd', 'mtchd-nw'];
    var tempSlctdId = [];

    $('#' + this.moduleId + ' img').each(function () {
      if (!mtchStatus.includes($('#' + this.id).closest('li').attr('id'))) {
        $('#' + this.id).css({ 'opacity': '0.4', 'filter': 'alpha(opacity=40)' });
        $('#' + this.id).closest('li').css("background-color", "yellow");
        slctdimgs.push($(this).attr('src'));
        tempSlctdId.push($(this).attr('id'));
      }
    });
    this.selected_images = slctdimgs.slice();
    this.selectedImageID = tempSlctdId.slice();
    this.sendAllImages();
  }

  deSelectAll() {
    var mtchStatus = ['mtchd', 'mtchd-nw'];
    $('#' + this.moduleId + ' img').each(function () {
      if (!mtchStatus.includes($('#' + this.id).closest('li').attr('id'))) {
        $('#' + this.id).css({ 'opacity': '', 'filter': '' });
      }
    });
    this.prevSelectedImgs.length = 0;
    this.prevSelectedImgs = this.selected_images.slice();
    this.selected_images.length = 0;
    this.selectedImageID.length = 0;
    this.getCurrClckdImg(this.selectedImgShinyRef(), "");
    this.highlightMatched();
  }

  highlightMatched() {
    if (this.moduleId === "spcs_idntfctn_pttrn_rcgntn_mn_pnl") {
      $("#mtchd > img").css({ 'opacity': '0.4', 'filter': 'alpha(opacity=40)' });
      $('li#mtchd').css("background-color", "#1200a6");
    }
  }

  sendDataToShinny() {
    if (!this.selected_images || this.selected_images.length === 0) {
      return;
    }
    var copy = this.selected_images.slice();
    this.deSelectAll();
    return copy;
  }

  /**
   * Builds image elements in the panel.
   * Uses async onerror fallback instead of synchronous XHR.
   */
  imgloop(arr) {
    this.currentDisplayedImgs.length = 0;
    this.prevSelectedImgs.length = 0;

    var ul = document.getElementById(this.moduleId);
    if (!ul) {
      console.warn("ViewerComponent: container #" + this.moduleId + " not found");
      return;
    }

    var startIndex = this.batnum * this.imgNumb;
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < arr.length; i++) {
      var liId = i + '_' + this.moduleId;
      var src = (arr[i].trim())
        .replace(/[\[\]'"]+/g, '')
        .replace(/(\r\n|\n|\r)/gm, "");

      this.currentDisplayedImgs.push(src);

      var li = document.createElement('li');

      var mtchStatus = null;
      if (this.mtchdArray.length === arr.length) {
        mtchStatus = this.mtchdArray[i];
      } else if (this.mtchdArray.length === this.imgArray.length) {
        mtchStatus = this.mtchdArray[startIndex + i];
      }

      if (mtchStatus !== null && mtchStatus !== undefined && mtchStatus !== "Unvalidated") {
        li.id = 'mtchd';
      }

      var img = document.createElement('img');
      img.id = liId;
      img.src = src;
      img.alt = 'Camera Trap';
      img.setAttribute('data-original', src);
      img.setAttribute('marked', '0');
      img.onerror = function () {
        if (this.src !== PLACEHOLDER_IMG) {
          this.src = PLACEHOLDER_IMG;
          this.alt = 'Image not found';
        }
      };

      li.appendChild(img);
      fragment.appendChild(li);
    }

    ul.appendChild(fragment);
    this.setCol();
    this.highlightMatched();
  }

  callvjs(elementId) {
    this.vjs(elementId);
  }

  keySelection() {
    var slctdimgs = [];
    var tempSlctdId = [];
    var imgs = $('#' + this.moduleId + ' img');
    var start = Math.min.apply(Math, this.hotKeysIndx);
    var end = Math.max.apply(Math, this.hotKeysIndx);

    for (var i = start; i <= end; i++) {
      $('#' + imgs[i].id).css({ 'opacity': '0.4', 'filter': 'alpha(opacity=40)' });
      $('#' + imgs[i].id).closest('li').css("background-color", "yellow");
      slctdimgs.push(imgs[i].src);
      tempSlctdId.push(imgs[i].id);
    }
    this.selected_images.push.apply(this.selected_images, slctdimgs);
    this.selectedImageID.push.apply(this.selectedImageID, tempSlctdId);
    this.selected_images = Array.from(new Set(this.selected_images));
    this.selectedImageID = Array.from(new Set(this.selectedImageID));
    this.sendAllImages();
    this.hotKeysIndx.length = 0;
  }

  matchRejectHighlighter() {
    for (var i = 0; i < this.selectedImageID.length; i++) {
      $('#' + this.selectedImageID[i]).closest('li').css("background-color", "#90EE90");
      $('#' + this.selectedImageID[i]).closest('li').attr('id', 'mtchd-nw');
    }
    this.prevSelectedImgs.length = 0;
    this.prevSelectedImgs = this.selected_images.slice();
    this.selected_images.length = 0;
    this.selectedImageID.length = 0;
  }
}
