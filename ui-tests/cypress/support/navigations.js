import sidebarElements from './elements/sidebar';

const goToLoginPage = () => {
    cy.visit('/login');
};

const goToLogoutPage = () => {
    cy.visit('/logout');
};

const goToHomePage = () => {
<<<<<<< HEAD
    cy.clickElement(sidebarElements.SIDEBAR_MENU_OPTIONS.MAIN_MENU);
    cy.clickElement(sidebarElements.SIDEBAR_MAIN_MENU_OPTIONS.HOME);
};

const goToVisitorLoyalty = () => {
    cy.clickElement(sidebarElements.SIDEBAR_MENU_OPTIONS.MAIN_MENU);
    cy.clickElement(sidebarElements.SIDEBAR_MAIN_MENU_OPTIONS.ANALYTICS);
    cy.clickElement(sidebarElements.SIDEBAR_MAIN_MENU_OPTIONS.ANALYTICS_LIST.VISITOR_LOYALTY);
};
=======
	cy.clickElement(sidebarElements.SIDEBAR_MENU_OPTIONS_LIST.MAIN_MENU)
	cy.clickElement(sidebarElements.SIDEBAR_MAIN_MENU_OPTIONS.HOME)
}

const goToVisitorLoyalty = () => {
	cy.clickElement(sidebarElements.SIDEBAR_MENU_OPTIONS_LIST.MAIN_MENU)
	cy.clickElement(sidebarElements.SIDEBAR_MAIN_MENU_OPTIONS.ANALYTICS)
	cy.clickElement(sidebarElements.SIDEBAR_MAIN_MENU_OPTIONS.ANALYTICS_LIST.VISITOR_LOYALTY)
}
>>>>>>> 5329704f95 (Updated sidebar duplicate defines for lint)

const isNavigatedToDashboard = () => {
    cy.shouldUrlInclude('/dashboard');
    cy.shouldBeVisible(sidebarElements.SIDEBAR);
};

module.exports = {
    goToLoginPage,
    goToLogoutPage,
    goToHomePage,
    goToVisitorLoyalty,
    isNavigatedToDashboard,
};
