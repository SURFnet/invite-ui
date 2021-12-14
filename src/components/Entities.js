import React, {useState} from "react";
import I18n from "i18n-js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Button from "./Button";
import {isEmpty, sortObjects, valueForSort} from "../utils/forms";
import {headerIcon} from "../forms/helpers";
import "./Entities.scss";
import Spinner from "./Spinner";
import {useNavigate} from "react-router-dom";

const Entities = ({
                      title,
                      entities,
                      modelName,
                      tableClassName,
                      className,
                      customNoEntities,
                      searchAttributes,
                      defaultSort,
                      loading,
                      columns,
                      newEntityPath,
                      newEntityFunc,
                      rowLinkMapper,
                      searchCallback,
                      customSearch,
                      showNew,
                      actions,
                      filters,
                      hideTitle,
                      children
                  }) => {

    const navigate = useNavigate();

    const [query, setQuery] = useState("");
    const [sorted, setSorted] = useState(defaultSort);
    const [reverse, setReverse] = useState(false);

    const newEntity = () => {
        if (newEntityFunc) {
            newEntityFunc();
        } else {
            navigate(newEntityPath);
        }

    };

    const queryChanged = e => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        if (customSearch) {
            customSearch(newQuery);
        }
        if (searchCallback) {
            searchCallback(filterEntities(entities, newQuery, searchAttributes));
        }
    }

    const renderSearch = (modelName, title, entities, query, searchAttributes, showNew, filters, customSearch, hideTitle) => {
        return (
            <section className="entities-search">
                {showNew &&
                <Button onClick={newEntity} className={`plus ${hideTitle && !filters ? "no-title" : ""}`}
                        txt={I18n.t(`${modelName}.new`)}/>
                }
                {!hideTitle && <h1>{title || `${I18n.t(`${modelName}.title`)} (${entities.length})`}</h1>}
                {filters}


                <div className={`search ${showNew ? "" : "standalone"}`}>
                    {(!isEmpty(searchAttributes) || customSearch) && <div>

                        <input type="text"
                               onChange={queryChanged}
                               value={query}
                               placeholder={I18n.t(`${modelName}.searchPlaceHolder`)}/>
                        <FontAwesomeIcon icon="search"/>
                    </div>}

                </div>
            </section>
        );
    };

    const filterEntities = (entities, query, searchAttributes, customSearch) => {
        if (isEmpty(query) || customSearch) {
            return entities;
        }
        query = query.toLowerCase();
        return entities.filter(entity => {
            return searchAttributes.some(attr => {
                const val = valueForSort(attr, entity);
                return val.toLowerCase().indexOf(query) > -1
            });
        });

    };

    const setSortedColumn = key => () => {
        const reversed = (sorted === key ? !reverse : false);
        setSorted(key);
        setReverse(reversed);
    }

    const getEntityValue = (entity, column) => {
        if (column.mapper) {
            return column.mapper(entity);
        }
        return entity[column.key];
    }

    const onRowClick = (rowLinkMapper, entity) => e => {
        const hasValue = typeof rowLinkMapper === "function" && rowLinkMapper(entity);
        if (hasValue) {
            hasValue(entity)(e);
        }
    }

    const renderEntities = (entities, sorted, reverse, modelName, tableClassName, columns, children,
                            rowLinkMapper, customNoEntities) => {
        const hasEntities = !isEmpty(entities);
        return (
            <section className="entities-list">
                {hasEntities &&
                <table className={tableClassName || modelName}>
                    <thead>
                    <tr>
                        {columns.map(column =>
                            <th key={column.key}
                                className={`${column.key} ${column.class || ""} ${column.nonSortable ? "" : "sortable"}`}
                                onClick={setSortedColumn(column.key)}>
                                {column.header}
                                {headerIcon(column, sorted, reverse)}
                            </th>
                        )}
                    </tr>
                    </thead>
                    <tbody>
                    {entities.map((entity, index) =>
                        <tr key={index}
                            className={`${(typeof rowLinkMapper === "function" && rowLinkMapper(entity)) ? "clickable" : ""}`}>
                            {columns.map(column =>
                                <td key={column.key}
                                    onClick={column.key !== "check" && column.key !== "role" ? onRowClick(rowLinkMapper, entity) : undefined}
                                    className={`${column.key} ${column.nonSortable ? "" : "sortable"} ${column.className ? column.className : ""}`}>
                                    {getEntityValue(entity, column)}
                                </td>)}
                        </tr>
                    )}
                    </tbody>
                </table>}
                {(!hasEntities && !children) &&
                <p className="no-entities">{customNoEntities || I18n.t(`${modelName}.noEntities`)}</p>}
            </section>
        );
    };


    if (loading) {
        return <Spinner/>;
    }
    const filteredEntities = filterEntities(entities, query, searchAttributes, customSearch);
    const sortedEntities = sortObjects(filteredEntities, sorted, reverse);
    return (
        <div className={`mod-entities ${className}`}>
            {renderSearch(modelName, title, entities, query, searchAttributes, showNew, filters, customSearch, hideTitle)}
            {actions}
            {renderEntities(sortedEntities, sorted, reverse, modelName, tableClassName, columns, children,
                rowLinkMapper, customNoEntities)}
            <div>{children}</div>
        </div>);

}

export default Entities;
