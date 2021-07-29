
    /***************************************************************************
      @version Viewer.js v1.3.5
      @author Valentine Tawira
      @description PantheraImageViewer Script for handling the processing of the
                  file data and rendering of the viewer panel
      Copyright (C) 2019 | Panthera Corporation
     ***************************************************************************/


    console.log("IN IMGINDENTIFICATION.JS");
    var imageArray = [];
    var highlighted_images = [];
    //var resultsArray;
    //var startIndex, endIndex;


     /* Function to read Server Data from Server-Side
     * @parameter msg A message from Shiny indication the csv file
     *
     */
    async function processIdnfctn1ResponseText(csvfile) {

      let textResult = await fetchServerFile(csvfile);
      imageArray = (textResult).split(',');
      imageArray.splice(0, 1);
      imageArray[0] = imageArray[0].replace("Source", "");
      imageArray[0] = imageArray[imageArray.length - 1] + imageArray[0];
      imageArray.splice(imageArray.length - 1, 1);
      console.log("Number of Images : " + imageArray.length );
      //displayImages(20,0)
      displayImages(20,0,'spcs_idntfctn_id_rf_1',imageArray);
    }
    /**
    * Handles all image panel click events
    * @parameter - event click/shiftKey
    *
    * Checks if event is shiftKey/click
    * Execute appropriate instructions based on event
    * @return void
    */
    function observeClick(event) {
      console.log("In observeClick imgIdentification");
      objectOf("imgIdentification");
      vjsCall();
    }

    /**
     * @function displayImages(a,b)
     * @description determines the images to be rendered
     * @parameter - number of images of render
     *           - batch number of the image lot
     * @returns void
     *


    function displayImages(imgnumb,bat) {
      console.log("In displayImages() imgIdentification");
        removeImages();
        startIndex = bat * imgnumb;
        endIndex = startIndex + imgnumb;
        resultsArray = imageArray.slice(startIndex, endIndex);
        imgloop(resultsArray,'spcs_idntfctn_id_rf_1');
        //dispImages(resultsArray);
    } */

    /************************************************************************/

    /************************************************************************/

    /**
     * @description clears inner html components identified by elementId 'x'
     *
     */
    function removeImages() {
      console.log("In removeImages() imgIdentification");
      $("#x").html("");
    }

    /**
     *
     * @param {String} arry

    function dispImages(arry) {
      console.log("IN dispImages() imgIdentification");
      imgloop(arry,'spcs_idntfctn_id_rf_1');
      //pasteImages(arry);
    }*/

    /**
     * @description - indirect call to the createViewerComponent() function
     * @returns image view
     */
    function vjsCall() {
      console.log("In vjsCall() imgIdentification");
      //confirm.log("In observeClick imgIdentification");
      createViewerComponent();
      return;
    }

    /**
     * @function createViewerComponent()
     * @description Function that creates the viewer component to view images
     * @returns viewer component
     */
    function createViewerComponent() {
      console.log("In ViewerJS() imgIdentification ");
      var viewer = new Viewer(document.getElementById('spcs_idntfctn-galley'), {
        url: 'data-original',
        title: function (image) {
          return image.alt + ' (' + (this.index + 1) + '/' + this.length + ')';
        },
      });
    }

    /**
     * @function SelectedImages()
     * @returns an array with the currently selected images
    */
    function SelectedImages()
    {
      return highlighted_images;
    }

