import { gql } from "@apollo/client";

export const convertEpochTimeToDateTime = (epochTime) => {
    var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    d.setUTCSeconds(epochTime);
    return d.toLocaleString();
}

export const getPermittedUsersForContent = async (contentId, client) => {
    let permittedUsers = [];
    const GET_PERMITTED_USERS = gql`
        query GetPermittedUsers($contentId: String!) {
            contents(where: {contentId: $contentId}) {
                id
                contentId
                permissions {
                    id
                    permittedUser
                }
            }
        }`;
    
    const { data, loading, networkStatus } = await client.query({ query: GET_PERMITTED_USERS, variables: { contentId } });
    console.log(data);
    for (let contentPermission of data.contents[0].permissions) {
        permittedUsers.push(contentPermission.permittedUser);
    }
    console.log(permittedUsers);
    return permittedUsers;
}