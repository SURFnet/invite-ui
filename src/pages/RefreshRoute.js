import React, {useEffect} from "react";
import Spinner from "../components/Spinner";
import {useNavigate, useParams} from "react-router-dom";

const RefreshRoute = () => {

    const {path} = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        const decodedPath = decodeURIComponent(path);
        navigate(decodedPath);
    }, [path, navigate]);

    return (
        <Spinner/>
    );

}
export default RefreshRoute;
