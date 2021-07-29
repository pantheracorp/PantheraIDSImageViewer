
    /***************************************************************************
      @version Viewer.js v1.3.5
      @author Valentine Tawira
      @description PantheraImageViewer Script for handling the processing of the
                  file data and rendering of the viewer panel
      Copyright (C) 2019 | Panthera Corporation
     ***************************************************************************/


  /**Program Global Variables */
  var ar_ct_vldt = [];
  var resetSel_ct_vldt = [];
  var selected_images_ct_vldt = [];
  var tempRemoved_ct_vldt ;
  var nextPrev_ct_vldt = "0";

  var result_ct_vldt;
  var start_ct_vldt, end;

  var batnum_ct_vldt  = 0 ; // default batch Number
  var imgNumb_ct_vldt = 30; // default image size
  var columnSize_ct_vldt = 5;


    function setImagesNumber_ct_vldt(numb)
    {
      imgNumb_ct_vldt = numb;
    }

    function setColumnNumb_ct_vldt(numb)
    {
        columnSize_ct_vldt = numb;
        setCol_ct_vldt();
    }

   /* Function to read Server Data from Server-Side
   * @parameter msg A message from Shiny indication the csv file
   *
   */
  function readServerData_ct_vldt(msg) {  // datapath , batchNumber , loadSize
    console.log("In readServerData_ct_vldt ");
    var csvfile = "" + msg + "";
    loadDoc_ct_vldt( csvfile, myFunction1_ct_vldt);
  }

  function loadDoc_ct_vldt(url, cFunction) {
     console.log("In loadDoc_ct_vldt ");
    var xhttp;
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {

           cFunction(this);
      }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
  }

  function myFunction1_ct_vldt(xhttp) {
     console.log("In myFunction1_ct_vldt ");
    ar_ct_vldt = (xhttp.responseText.replace(/^\s*$[\n\r]{1,}/gm, '')).split(',');
    ar_ct_vldt.splice(0, 1);
    ar_ct_vldt[0] = ar_ct_vldt[0].replace("Source", "");
    ar_ct_vldt[0] = ar_ct_vldt[ar_ct_vldt.length - 1] + ar_ct_vldt[0];
    ar_ct_vldt.splice(ar_ct_vldt.length - 1, 1);
    console.log(ar_ct_vldt);
    initial_ct_vldt(imgNumb_ct_vldt,0);

  }

  /************************************************************************/
  /**
   * Highlights a selected image
   * @parameter selected image id
   * Applies opacity 0.4
   * @return void
  */
  function highliter_ct_vldt(elementID)
  {
    $('#' + elementID + '').css({
          'opacity': '0.4',
          'filter': 'alpha(opacity=40)'
        });
  }

  /**
  * Removes Highlights a unselected image
  * @parameter selected image id
  * Removes opacity - reverts to original opacity
  * @return void
  */
  function removeHighlight_ct_vldt(elementID)
  {
    $('#' + elementID + '').css({
          'opacity': '',
          'filter': ''
        });
  }
  function setCol_ct_vldt(){

    $('.pictures > li').css({
        'width' : 'calc(100% /' + 5 +')'
    });
  }



  function getCurrClckdImg_ct_vldt(state, imgsrc)
  {
    Shiny.onInputChange(state,imgsrc);
  }

  /**
   * Function inprogress to fix the previous image Reference
  */
  function removedRef_ct_vldt()
  {
    return tempRemoved_ct_vldt;
  }

  /**
  * Handles all image panel click events
  * @parameter - event click/shiftKey
  *
  * Checks if event is shiftKey/click
  * Execute appropriate instructions based on event
  * @return void
  */
  function isKeyPressed_ct_vldt(event) {
      objectOf("imgClassification");
      myFunction_ct_vldt();
  }

  /**
   * @function initial_ct_vldt(a,b)
   * @description determines the images to be rendered
   * @parameter - number of images of render
   *           - batch number of the image lot
   * @returns void
   *
  */
  function initial_ct_vldt(imgnumb,bat) {
    console.log("In initial_ct_vldt ");
      clearImages_ct_vldt();
      start_ct_vldt = bat * imgnumb;
      end = start_ct_vldt + imgnumb;
      result_ct_vldt = ar_ct_vldt.slice(start_ct_vldt, end);
      console.log("Array Size  : " + result_ct_vldt.length);
      callImges_ct_vldt(result_ct_vldt);
  }

  function tester_ct_vldt()
  {
    initial_ct_vldt(9,0);
  }


  function trimSRC_ct_vldt(selctdImgAry)
  {
    let i = 0;
    let tempArray = [];
    for(i;i < selected_images_ct_vldt.length;i++)
    {
      let newSRC = selctdImgAry[i].substring(selctdImgAry[i].lastIndexOf("/") + 1, selctdImgAry[i].length );
      tempArray[i] = newSRC;
    }
    //console.log("Trimed Array");
    //console.log(tempArray);
    return tempArray;
  }

  /************************************************************************/

  /**
   * @description - creates html component to display the images
   * @param {String} ar_ct_vldt - an array of images
   * @returns {void} var src = ( ( ar_ct_vldt[0].trim()).replace(/['"]+/g, ''));
   * someText = src.replace(/(\r\n|\n|\r)/gm,"");
   */
  function imgloop_ct_vldt(ar_ct_vldt) {
    $(".pictures > li").css("background-color", "white");
    console.log("In imgloop_ct_vldt ");
    for (i = 0; i < ar_ct_vldt.length; i++) {
      var liId = i;
      var img = new Image();
      var ul = document.getElementById('ct_vldt_img_trggr_tbl_vldtn_9');
      img.src = ((ar_ct_vldt[i].trim()).replace(/['"]+/g, '')).replace(/(\r\n|\n|\r)/gm,"");
      img.alt = "Camera Trap";
      img.datamarked = 0;
      ul.innerHTML += '<li  ><img id="' + liId + '" data-original="' +
      img.src + '"  marked="' + img.datamarked + '" src="' +
      img.src + '" alt="' + img.alt + '" /> </li>';
      setCol_ct_vldt();
    }
  }

  /**
   * @description clears inner html components identified by elementId 'x'
   *
   */
  function clearImages_ct_vldt() {
    $("#img_clssfctn_ud").html("");
  }

  /**
   *
   * @param {String} arry
   */
  function callImges_ct_vldt(arry) {
    console.log("In callImges_ct_vldt ");
    imgloop_ct_vldt(arry);
  }

  /**
   * @description - indirect call to the vjs_ct_vldt() function
   * @returns image view
   */
  function myFunction_ct_vldt() {
    vjs_ct_vldt();
    return;
  }

  /**
   * @function vjs_ct_vldt()
   * @description Function that creates the viewer component to view images
   * @returns viewer component
   */
  function vjs_ct_vldt() {
      var viewer = new Viewer(document.getElementById('galley'), {
      url: 'data-original',
      title: function (image) {
        return image.alt + ' (' + (this.index + 1) + '/' + this.length + ')';
      },
    });


  }

  /**
   * @function getSelectedImages_ct_vldt()
   * @returns an array with the currently selected images
  */
  function getSelectedImages_ct_vldt()
  {
    // src.substring(src.lastIndexOf("/") + 1, src.length )
    //console.log(selected_images_ct_vldt);
    return selected_images_ct_vldt;
  }

  function getTrimedSelectedImages_ct_vldt()
  {
    return trimSRC_ct_vldt(getSelectedImages_ct_vldt());
  }

