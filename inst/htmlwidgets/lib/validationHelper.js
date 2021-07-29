 /***************************************************************************
  *   @author Valentine Tawira
  *   @description  Script for handling all the specific logic for the validation viewers.
  *                
  *                  
  *   Copyright (C) 2019 | Panthera Corporation
  * ***************************************************************************/


 var ct_vldt_img_trggr_tbl_vldtn_9 = new ViewerComponent(0, 30, 5, "ct_vldt_img_trggr_tbl_vldtn_9");
 var ct_vldt_img_trggr_tbl_vldtn_11 = new ViewerComponent(0, 30, 5, "ct_vldt_img_trggr_tbl_vldtn_11");
 var ct_vldt_img_trggr_tbl_vldtn_10 = new ViewerComponent(0, 30, 5, "ct_vldt_img_trggr_tbl_vldtn_10");
 var ct_vldt_img_trggr_tbl_vldtn_12 = new ViewerComponent(0, 30, 5, "ct_vldt_img_trggr_tbl_vldtn_12");

 /**
  * 
  * @param {*} event 
  */
 function mapObject(event) {
   let id = event.target.id;
   let moduleId = id.substr(id.indexOf("ct"), id.length);

   if (moduleId == "ct_vldt_img_trggr_tbl_vldtn_9") {
     viewImages(ct_vldt_img_trggr_tbl_vldtn_9)
   }
   if (moduleId == "ct_vldt_img_trggr_tbl_vldtn_10") {
     viewImages(ct_vldt_img_trggr_tbl_vldtn_10)
   }
   if (moduleId == "ct_vldt_img_trggr_tbl_vldtn_11") {
     viewImages(ct_vldt_img_trggr_tbl_vldtn_11)
   }
   if (moduleId == "ct_vldt_img_trggr_tbl_vldtn_12") {
     viewImages(ct_vldt_img_trggr_tbl_vldtn_12)
   }
 }

 /**
  * 
  * @param {*} object 
  */
 function viewImages(object) {
   object.columnSize = 5;
   object.imgNumb = 30;
   object.setCol();
   object.callvjs(object.moduleId + "_divId");
 }


 /**
  * 
  * @param {*} resp image names string 
  * @param {*} vldtnNum validation viewer  
  */
 function setValidationArray(resp, vldtnNum) {
   if (vldtnNum === 9) {
     ct_vldt_img_trggr_tbl_vldtn_9.readServerData(resp);
   }
   if (vldtnNum === 10) {
     ct_vldt_img_trggr_tbl_vldtn_10.readServerData(resp);
   }
   if (vldtnNum === 11) {
     ct_vldt_img_trggr_tbl_vldtn_11.readServerData(resp);
   }
   if (vldtnNum === 12) {
     ct_vldt_img_trggr_tbl_vldtn_12.readServerData(resp);
   }
 }

 function setValidationArrayTest(resp, vldtnNum) {

   if (vldtnNum === 9) {
     ct_vldt_img_trggr_tbl_vldtn_9.readServerDataTest(resp);
   }
   if (vldtnNum === 10) {
     ct_vldt_img_trggr_tbl_vldtn_10.readServerDataTest(resp);
   }
   if (vldtnNum === 11) {
     ct_vldt_img_trggr_tbl_vldtn_11.readServerDataTest(resp);
   }
   if (vldtnNum === 12) {
     ct_vldt_img_trggr_tbl_vldtn_12.readServerDataTest(resp);
   }
 }