import http from "./http-common";

class ContentDataService {
    createContent(contentId, encryptedSymKey, name, owner) {
        return http.post("", {contentId, encryptedSymKey, name, owner});
    }

    getContentForOwner(owner) {
        return http.get(`?owner=${owner}`);
    }

    getContentForCid(cid) {
        return http.get(`?cid=${cid}`);
    }

    updateContentOwner(contentId, newOwner) {
        return http.put("", { data: { contentId, owner: newOwner } });
    }

    markContentInactive(contentId) {
        return http.delete(`?contentId=${contentId}`);
    }
}

export default new ContentDataService();