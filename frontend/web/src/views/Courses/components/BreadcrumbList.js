import {Breadcrumb, BreadcrumbItem} from "react-bootstrap";
import {Link} from "react-router-dom";
import {isNull} from 'lodash';
import React from "react";

const BreadcrumbList = ({breadcrumbs}) => {
    return (
        <Breadcrumb>
            {breadcrumbs.map(({link, name}, key) => (
                    <BreadcrumbItem active={isNull(link)} key={key}>
                        {isNull(link) ? (name) : <Link to={link}>{name}</Link>}
                    </BreadcrumbItem>
                )
            )}
        </Breadcrumb>
    )
}

export default BreadcrumbList;