const projectSQL = {

    getAllProjectList () {
        return `
            SELECT * from project
        `
    },
    getProjectByProjectKey (key) {
        return `
            SELECT * from project
            where project_key="${key}"
            limit 1
        `
    },
    getProjectByProjectName (name) {
        return `
            SELECT * from project
            where project_name="${name}"
            limit 1
        `
    },
    findProjectByNameOrKey (name = '', key = '') {
        return `
            SELECT * from project
            where project_name="${name}" or project_key="${key}"
        `
    } 
}

module.exports = projectSQL;