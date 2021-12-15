import {useParams} from "react-router-dom";

const ApplicationDetail = () => {
    let {applicationId} = useParams();

    return (
        <div className="application">
            <span>Application {applicationId}</span>
        </div>
    );

}

export default ApplicationDetail;
