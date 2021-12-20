import {library} from '@fortawesome/fontawesome-svg-core'
import {
    faMobileAlt,
    faUniversity,
    faChevronRight,
    faSearch,
    faTrash,
    faCaretUp,
    faCaretDown,
    faInfoCircle,
    faExclamationCircle,
    faTimes,
    faUser,
    faHatCowboy

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
        faHatCowboy
    );
}
