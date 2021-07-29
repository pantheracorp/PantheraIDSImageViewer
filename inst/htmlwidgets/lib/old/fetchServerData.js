/* Function to read Server Data from Server-Side
* @parameter msg A message from Shiny indication the csv file
*
*/
function fetchServerData(msg) {
    var csvfile = "" + msg + "";
    console.log("readServerData : " + csvfile);
    loadDoc(csvfile, myFunction1);
}
