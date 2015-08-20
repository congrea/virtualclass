var roles = {

    /**
     * Teacher is super Admin in our app, original Teacher
     * We should avoid using IS functions and rather use HAS functions, wherever possible
     * @returns {boolean}
     */
    isTeacher: function () {
        return (virtualclass.gObj.uRole === 't')
    },
    /**
     * Student is student, lease privileged user
     * We should avoid using IS functions and rather use HAS functions, wherever possible
     * @returns {boolean}
     */
    isStudent: function () {
        return (virtualclass.gObj.uRole === 's')
    },
    /**
     * Presenter is upgraded Student role
     * We should avoid using IS functions and rather use HAS functions, wherever possible
     * @returns {boolean}
     */
    isPresenter: function () {
        return (virtualclass.gObj.uRole === 'p')
    },
    /**
     * Educator is downgraded Teacher role
     * We should avoid using IS functions and rather use HAS functions, wherever possible
     * @returns {boolean}
     */
    isEducator: function () {
        return (virtualclass.gObj.uRole === 'e')
    },
    /**
     * Teacher and Presenter should have controls
     * We should avoid using IS functions and rather use HAS functions, wherever possible
     * @returns {boolean}
     */
    hasControls: function () {
        return (virtualclass.gObj.uRole === 't' || virtualclass.gObj.uRole === 'p')
    },
    /**
     * Teacher and Educator should have OT.
     * There should be only one person having OT Permission.
     * @returns {boolean}
     */
    hasAdmin: function () {
        return (virtualclass.gObj.uRole === 't' || virtualclass.gObj.uRole === 'e')
    },
    /**
     * Student and Educator has View Only Access
     * @returns {boolean}
     */
    hasView: function () {
        return (virtualclass.gObj.uRole === 's' || virtualclass.gObj.uRole === 'e')
    }
};