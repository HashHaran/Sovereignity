import lit from './lit';
import { Sovereignity } from './sovereignity';

import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js'
// import * as dotenv from "dotenv";
// dotenv.config();
// console.log(process.env);

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

  async uploadEncryptedFileAndAddContent(files) {
    for (let file of files) {
      var { contentId, encryptedSymmetricKey } = await lit.encryptAndUploadFile(file, storage, this.onRootCidReady, this.onStoredChunk, REACT_APP_SOVEREIGNITY_MUMBAI, this.setTotalSizeOfEncryptedFile);
      console.log(encryptedSymmetricKey);  //TODO: store this somewhere to decrypt when user tries to retreive the file
      console.log(contentId);
      this.sovereignity.addContent(contentId);
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
    var encryptedSymmetricKey = '0eca302ebfe4daab23491dcb586a2abd48c9ba44c636d4d87539c449a5c6bb0c28a5305c88193625b222d92645d72616648a4e417340756a96144424699fc485c5b452878e5cf1b87e8932e91364da88d13952321b38ba9970e4173a30e016af206b650acc73f8eda78c75dc51ad46d39a5a9fbef25243c97f5a28d833284202000000000000002072725545e5df00cfd02bc30fc6fd32f46e7cd580510f382d8a8037a01cfadb0e511a7dba43cc41913805199a9464f3a4';

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