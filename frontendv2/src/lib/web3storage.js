import lit from './lit';
import { Sovereignity } from './sovereignity';

import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js'
import contentDataService from './contentDataService';

const REACT_APP_WEB3_STORAGE_API_KEY = process.env.REACT_APP_WEB3_STORAGE_API_KEY;
const REACT_APP_SOVEREIGNITY_MUMBAI = process.env.REACT_APP_SOVEREIGNITY_MUMBAI;

if (!REACT_APP_WEB3_STORAGE_API_KEY) {
  throw new Error("Please set your WEB3_STORAGE_API_KEY in a .env file");
}
const storage = new Web3Storage({ token: REACT_APP_WEB3_STORAGE_API_KEY });

export default class Web3storage {

  sovereignity;
  setProgress;
  uploaded;
  totalSize;

  constructor(provider, setProgress) {
    this.sovereignity = new Sovereignity(REACT_APP_SOVEREIGNITY_MUMBAI, provider);
    this.setProgress = setProgress;
  }

  onRootCidReady = (cid) => {
    alert(`CID of file computed: ${cid} . Beginning upload...`)
  }

  onStoredChunk = (size) => {
    this.uploaded = this.uploaded + size;
    this.setProgress((this.uploaded / this.totalSize) * 100 > 100 ? 100 : (this.uploaded / this.totalSize) * 100);
  }

  setTotalSizeOfEncryptedFile = (size) => {
    this.totalSize = size;
    this.uploaded = 0;
  }

  async uploadEncryptedFileAndAddContent(files, owner) {
    for (let file of files) {
      var { contentId, encryptedSymmetricKey } = await lit.encryptAndUploadFile(file, storage, this.onRootCidReady, this.onStoredChunk, REACT_APP_SOVEREIGNITY_MUMBAI, this.setTotalSizeOfEncryptedFile);
      console.log(encryptedSymmetricKey);  //TODO: store this somewhere to decrypt when user tries to retreive the file
      console.log(contentId);
      await this.sovereignity.addContent(contentId);
      contentDataService.createContent(contentId, encryptedSymmetricKey, file.name, owner);
    }
  }

  download = (
    filename,
    contents,
    mimeType = 'text/plain'
  ) => {
    const blob = new Blob([new Uint8Array(contents, 0, contents.byteLength)], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  async downloadDecryptedFile(contentId) {
    var encryptedFilResponse = await storage.get(contentId);
    const encryptedFiles = await encryptedFilResponse.files();
    const contentFromDb = await contentDataService.getContentForCid(contentId);
    console.log(contentFromDb);
    var encryptedSymmetricKey = contentFromDb.data.content.encryptedSymKey;
    console.log(encryptedSymmetricKey);

    for (const encryptedFile of encryptedFiles) {
      var decryptedFile = await lit.decryptFile(encryptedFile, encryptedSymmetricKey, contentId, REACT_APP_SOVEREIGNITY_MUMBAI);
      this.download(contentId, decryptedFile);
    }
  }

  async getStatus(contentId) {
    const status = await storage.status(contentId);
    return status;
  }
}