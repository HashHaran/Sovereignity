import http from "./http-common";

class ContentDataService {
    createContent(contentId, encryptedSymKey, name, owner) {
        http.post("", {contentId, encryptedSymKey, name, owner});
    }

    getContentForOwner(owner) {
        http.get(`?owner=${owner}`);
    }

    getContentForCid(cid) {
        http.get(`?cid=${cid}`);
    }

    updateContentOwner(contentId, newOwner) {
        http.put("", { data: { contentId, owner: newOwner } });
    }

    markContentInactive(contentId) {
        http.delete(`?contentId=${contentId}`);
    }
}

export default new ContentDataService();