import {Vars} from '../vars';

//function to check, if user can view/edit data.
export function currentUserIsAdminOrMatchesId(allowedUserId: string): boolean {
    if (Vars.currentUser.is_admin) {
        return true;
    } else if (Vars.currentUser.id === allowedUserId) {
        return true;
    }

    return false;
}
