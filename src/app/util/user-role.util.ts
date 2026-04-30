export type UserRole = "User" | "Writer" | "Editor" | "Publisher" | "Approver" | "Admin" | "Sales" | "Marketing" | "SiteManager" | "CMSManager" | "CustomerSupport" | "Consultant" | "ConsultantOnboarding" | "CorporateManager" | "CorporateUser" | "Author" | "Accountant" | "ProductManager" | "DiagnosticEditor" | "HealthpackageEditor" | "ConsultUsAdmin" | "ConsultationsManager";

const roleList: Array<{ role: UserRole }> = [
    { role: "User" },
    { role: "Writer" },
    { role: "Editor" },
    { role: "Publisher" },
    { role: "Approver" },
    { role: "Admin" },
    { role: "Sales" },
    { role: "Marketing" },
    { role: "SiteManager" },
    { role: "CMSManager" },
    { role: "CustomerSupport" },
    { role: "Consultant" },
    { role: "ConsultantOnboarding" },
    { role: "CorporateManager" },
    { role: "CorporateUser" },
    { role: "Author" },
    { role: "Accountant" },
    { role: "ProductManager" },
    { role: "DiagnosticEditor" },
    { role: "HealthpackageEditor" },
    { role: "ConsultUsAdmin" },
    { role: "ConsultationsManager" },
];

export const getUserRoles = () => {
    return roleList.sort((a, b) => {
        let roleA = a.role.toLowerCase(), roleB = b.role.toLowerCase()
        if (roleA < roleB) {
            return -1;
        } else if (roleA > roleB) {
            return 1;
        } else return 0
    })
}