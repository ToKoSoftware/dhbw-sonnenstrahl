import {Vars} from '../vars';

/**
 * Check if user is allowed to view/edit data.
 * @param {string} allowedUserId
 * @returns {boolean}
 */
export function currentUserIsAdminOrMatchesId(allowedUserId: string): boolean {
    if (Vars.currentUser.is_admin) {
        return true;
    } else if (Vars.currentUser.id === allowedUserId) {
        return true;
    }

    return false;
}
