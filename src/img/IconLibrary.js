import {library} from '@fortawesome/fontawesome-svg-core'
import {
    faMobileAlt,
    faUniversity,
    faSearch,
    faTrash,
    faCaretUp,
    faCaretDown,
    faExclamationCircle

} from '@fortawesome/free-solid-svg-icons'

export function addIcons() {
    library.add(
        faMobileAlt,
        faUniversity,
        faSearch,
        faTrash,
        faCaretUp,
        faCaretDown,
        faExclamationCircle
    );
}
