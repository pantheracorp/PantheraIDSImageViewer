function fetchServerData(src, moduleId) {
    if (moduleId === "spcs_idntfctn_pttrn_rcgntn_mn_pnl") {
        setimgarryTest(src);
    }
    if (moduleId === "img_clssfctn_ud") {
        setImageArrayTest(src);
    }
    if (moduleId === "ct_vldt_img_trggr_tbl_vldtn_9") {
        setValidationArrayTest(src, 9);
    }
    if (moduleId === "ct_vldt_img_trggr_tbl_vldtn_10") {
        setValidationArrayTest(src, 10);
    }
    if (moduleId === "ct_vldt_img_trggr_tbl_vldtn_11") {
        setValidationArrayTest(src, 11);
    }
    if (moduleId === "ct_vldt_img_trggr_tbl_vldtn_12") {
        setValidationArrayTest(src, 12);
    }
}

function loadFile(filename) {
    let result = null;
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filename, false);
    xmlhttp.send();
    if (xmlhttp.status == 200) {
        result = (xmlhttp.responseText).replace(/^\s*$[\n\r]{1,}/gm, '');
        return result;
    }
    return result;
}

function observeClick(event) {
    mapObject(event);
}

function clcsfcnSave() {
    saveButtonListerner();
}