import {library} from '@fortawesome/fontawesome-svg-core'
import {
    faCalendarAlt,
    faCaretDown,
    faCaretUp,
    faCheck,
    faChevronRight,
    faExclamationCircle,
    faHatCowboy,
    faInfoCircle,
    faMobileAlt,
    faPlus,
    faSearch,
    faTimes,
    faTrash,
    faUniversity,
    faUser,
    faUserCircle,
    faExclamationTriangle,
    faEllipsisV
} from '@fortawesome/free-solid-svg-icons'

export function addIcons() {
    library.add(
        faMobileAlt,
        faUniversity,
        faInfoCircle,
        faChevronRight,
        faSearch,
        faTrash,
        faCaretUp,
        faCaretDown,
        faExclamationCircle,
        faTimes,
        faUser,
        faHatCowboy,
        faCalendarAlt,
        faPlus,
        faCheck,
        faUserCircle,
        faExclamationTriangle,
        faEllipsisV
    );
}
