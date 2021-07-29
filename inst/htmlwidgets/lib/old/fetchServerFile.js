        async function fetchServerFile(msg) {
            var result= await (await fetch(msg)).text();
            return result.replace(/^\s*$[\n\r]{1,}/gm, '');
        }

      /**
       * @description - creates html component to display the images
       * @param {String} ar - an array of images
       * @returns {void} var src = ( ( ar[0].trim()).replace(/['"]+/g, ''));
       * someText = src.replace(/(\r\n|\n|\r)/gm,"");
       */
      function imgloop(ar,moduleId) {
        console.log("moduleId : " + moduleId);
        clearImages(moduleId);
        $(".pictures > li").css("background-color", "white");
        console.log("In imgloop");
        for (i = 0; i < ar.length; i++) {
          var liId = i;
          var img = new Image();
          var ul = document.getElementById(moduleId);
          img.src = ((ar[i].trim()).replace(/['"]+/g, '')).replace(/(\r\n|\n|\r)/gm,"");
          // Triming the double quotes passed on each image src
          img.alt = "Camera Trap";
          img.datamarked = 0;
          ul.innerHTML += '<li ><img id="' + liId + '" data-original="' +
          img.src + '"  marked="' + img.datamarked + '" src="' +
          img.src + '" alt="' + img.alt + '" /> </li>';
          // inserting an list of images uinside the ul tag
        }
      }

      function clearImages(moduleId) {
        console.log("In clearImages() " + moduleId);
        $('#' + moduleId + '').html("");
        //$("#x").html("");
      }

    /**
     * @function displayImages(a,b)
     * @description determines the images to be rendered
     * @parameter - number of images of render
     *           - batch number of the image lot
     * @returns void
     *
    */
    function displayImages(imgnumb,bat,moduleId,arry) {
      console.log("In displayImages()");
          let startIndex , endIndex;
          clearImages(moduleId);
          startIndex = bat * imgnumb;
          endIndex = startIndex + imgnumb;
          resultsArray = arry.slice(startIndex, endIndex);
          imgloop(resultsArray,moduleId);
          //dispImages(resultsArray);
      }

