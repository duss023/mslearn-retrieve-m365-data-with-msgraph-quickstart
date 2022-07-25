// Create an authentication provider
const authProvider = {
    getAccessToken: async () => {
        // Call getToken in auth.js
        return await getToken();
    }
};
// Initialize the Graph client
const graphClient = MicrosoftGraph.Client.initWithMiddleware({ authProvider });
//Get user info from Graph
async function getUser() {
    ensureScope('user.read');
    return await graphClient
        .api('/me')
        .select('id,displayName')
        .get();
}

// Get files in root of user's OneDrive
async function getFiles() {
    ensureScope('files.read');
    try {
      const response = await graphClient
          .api('/sites/d0bc0a15-84c0-41e0-929d-9888b4cd1df8/drive/items/root/children')
          .select('id,name,folder,package')
          .get();
      return response.value;
    } catch (error) {
      console.error(error);
    }
  }

  async function downloadFile(filePath) {
    try {
        // var filePath = "https://kszngy.sharepoint.com/:b:/s/sealTest/EVMwCHLOsBBLpyetBkr-_3cB3zor-KXu4udJP4sGAL8VlQ?e=ZuwCu0";
        filePath = urlToToSharingToken(filePath)
        const response = await graphClient
          .api(`/shares/${filePath}/driveItem`)
          .select('@microsoft.graph.downloadUrl')
          .get();
        pdfUrl = response["@microsoft.graph.downloadUrl"];
        pdfId = response["id"];
        driveId = response["parentReference"]["driveId"];
        await viewPdf ();
      // const downloadUrl = response["@microsoft.graph.downloadUrl"];
      // window.open(downloadUrl, "_self");
      
    } catch (error) {
      console.error(error);
    }
  }

  async function uploadFile(pdfBytes) {
    try {
      ensureScope('files.readwrite');
      const response = await graphClient.api(`/drives/${driveId}/items/${pdfId}/content`).put(pdfBytes);
      //const response = await graphClient.api(`/sites/kszngy.sharepoint.com,d0bc0a15-84c0-41e0-929d-9888b4cd1df8,b51188f3-11bb-4d66-8239-3900d56b1ceb/drive/items/${pdfId}/content`).put(pdfBytes);
      console.log(`File ${response.name} of ${response.size} bytes uploaded`);
      alert("ファイル更新に完了でした。")
      return response;
    } catch (error) {
      console.error(error);
    }
  }