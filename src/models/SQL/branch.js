const branchSQL = {

    getAllList(start, pageSize) {
        return `
            SELECT COUNT(*) AS total FROM branch;
            SELECT * FROM branch limit ${start}, ${pageSize}
        `
    },

    getHistoryList(start, pageSize) {
        return `
            SELECT COUNT(*) AS total FROM branch WHERE published=2 and merged_master=1;
            SELECT * FROM branch WHERE published=2 and merged_master=1 limit ${start}, ${pageSize}
        `
    },

    findBranchByBranch(branch) {
        return `
            SELECT * FROM branch where branch="${branch}" limit 1
        `;
    },

    findBranchByBranchAndProjectKey(branch, projectKey) {
        return `
            SELECT * FROM branch where branch="${branch}" and project_key="${projectKey}" limit 1
        `;
    },

    findBranchByProjectKey(projectKey, start, pageSize) {
        return `
            SELECT COUNT(*) AS total FROM branch where project_key="${projectKey}";
            SELECT * FROM branch where project_key="${projectKey}" limit ${start}, ${pageSize}
        `;
    }

}

module.exports = branchSQL;