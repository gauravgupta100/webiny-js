const { localStorage, log } = require("@webiny/cli/utils");
const { request } = require("graphql-request");

const GET_CURRENT_USER = /* GraphQL */ `
    query GetUser {
        users {
            getCurrentUser {
                id
                firstName
                lastName
            }
        }
    }
`;

const LIST_ORGS = /* GraphQL */ `
    query ListOrgs {
        orgs {
            listOrgs {
                data {
                    id
                    name
                }
            }
        }
    }
`;

const LIST_PROJECTS = /* GraphQL */ `
    query ListProjects($orgId: ID!) {
        projects {
            listProjects(orgId: $orgId) {
                data {
                    id
                    name
                    org {
                        id
                        name
                    }
                }
            }
        }
    }
`;

let user;
module.exports.getUser = async () => {
    if (user) {
        return user;
    }

    const pat = localStorage().get("wcpPat");
    if (!pat) {
        throw new Error(
            `It seems you are not logged in. Please login using the ${log.error.hl(
                "webiny login"
            )} command.`
        );
    }

    try {
        const { WCP_API_URL } = require(".");
        const headers = { authorization: pat };
        user = await request(WCP_API_URL, GET_CURRENT_USER, {}, headers).then(async response => {
            const user = response.users.getCurrentUser;

            const orgs = await request(WCP_API_URL, LIST_ORGS, {}, headers).then(async response => {
                const orgs = response.orgs.listOrgs.data;
                for (let i = 0; i < orgs.length; i++) {
                    const org = orgs[i];
                    org.projects = await request(
                        WCP_API_URL,
                        LIST_PROJECTS,
                        { orgId: org.id },
                        headers
                    ).then(response => response.projects.listProjects.data);
                }
                return orgs;
            });

            const projects = orgs.map(org => org.projects).flat();

            return { ...user, orgs, projects };
        });
    } catch {
        throw new Error(
            `It seems the personal access token is incorrect or does not exist. Please log out and again log in using the ${log.error.hl(
                "yarn webiny login"
            )} command.`
        );
    }

    return user;
};
