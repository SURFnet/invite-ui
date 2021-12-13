import {useParams} from "react-router-dom";

const Application = () => {
    let {applicationId} = useParams();

    return (
        <div className="application">
            <span>Application {applicationId}</span>
        </div>
    );

}

export default Application;
